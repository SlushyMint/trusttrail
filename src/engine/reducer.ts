import { scenario } from '../content/scenario';
import type { Chapter, GameEvent, GameState, Position, Scenario } from './types';
import { recoveryDone, recoverySteps } from './recovery';

export function portalOpened(state: GameState, chapter: Chapter) {
  return state.history.some(event => event.type === 'portal.opened' && event.chapterId === chapter.id);
}

export function claimMatched(state: GameState, comparisonId: string) {
  return state.history.some(event => event.type === 'claim.matched' && event.comparisonId === comparisonId);
}

export function initialGame(): GameState {
  return { position: { kind: 'menu' }, history: [], choices: {}, discoveries: {}, references: {}, flags: {} };
}

export function currentChapter(state: GameState, content: Scenario = scenario): Chapter {
  const id = 'chapterId' in state.position ? state.position.chapterId : content.chapters[0]?.id;
  const chapter = content.chapters.find(item => item.id === id);
  if (!chapter) throw new Error('Bab permainan tidak tersedia.');
  return chapter;
}

export function outcomeNode(decisionId: string, optionId: string): string {
  return `${decisionId}-${optionId}-outcome`;
}

export function debriefNode(decisionId: string, optionId: string): string {
  return `${decisionId}-${optionId}-debrief`;
}

export function conversationStep(state: GameState, chapter: Chapter): number {
  return state.history.filter(event => event.type === 'conversation.advanced' && event.conversationId === chapter.conversation?.id).length;
}

/** Invalid/stale/repeated actions preserve identity and never append a durable event. */
export function reduceGame(state: GameState, event: GameEvent, content: Scenario = scenario): GameState {
  const position = state.position;
  const chapter = currentChapter(state, content);
  const decision = chapter.decision;
  const eventIndex = state.history.length;
  let change: Partial<GameState> | undefined;
  const move = (next: Position) => { change = { position: next }; };
  const outcome = (optionId: string): Position => ({ kind: 'outcome', chapterId: chapter.id, decisionId: decision.id, optionId });
  const canInspect = position.kind === 'investigation' || position.kind === 'verification';

  switch (event.type) {
    case 'portal.opened':
      if (position.kind === 'investigation' && chapter.portal && event.chapterId === chapter.id && !portalOpened(state, chapter)) change = {};
      break;
    case 'claim.matched': {
      const comparison = chapter.portal?.comparisons.find(item => item.id === event.comparisonId);
      if (canInspect && comparison && state.references[chapter.source.id] && state.discoveries[comparison.evidenceId] && event.answerId === comparison.correctAnswerId && !claimMatched(state, comparison.id)) change = {};
      break;
    }
    case 'recovery.acted': {
      const next = recoverySteps(state).find(step => !recoveryDone(state, step.id));
      if (position.kind === 'recovery' && next?.id === event.stepId && next.correctActionId === event.actionId) change = {};
      break;
    }
    case 'recovery.completed': {
      if (position.kind === 'recovery' && event.chapterId === chapter.id && recoverySteps(state).every(step => recoveryDone(state, step.id))) {
        const choice = state.choices[decision.id];
        if (choice) move({ kind: 'debrief', chapterId: chapter.id, decisionId: decision.id, optionId: choice.optionId });
      }
      break;
    }
    case 'run.started':
      if (position.kind === 'menu' && state.history.length === 0) move({ kind: 'briefing' });
      break;
    case 'story.begun':
      if (position.kind === 'briefing') move({ kind: 'narrative', chapterId: chapter.id, lineIndex: 0 });
      break;
    case 'chapter.continued': {
      const next = content.chapters[content.chapters.findIndex(item => item.id === chapter.id) + 1];
      if (position.kind === 'chapterComplete' && event.chapterId === chapter.id && next) move({ kind: 'narrative', chapterId: next.id, lineIndex: 0 });
      break;
    }
    case 'conversation.advanced': {
      const conversation = chapter.conversation;
      if (position.kind === 'investigation' && conversation && event.conversationId === conversation.id && event.stepIndex === conversationStep(state, chapter) && event.stepIndex < conversation.exchanges.length) change = {};
      break;
    }
    case 'line.advanced':
      if (position.kind === 'narrative' && event.nodeId === `${chapter.id}-intro` && event.lineIndex === position.lineIndex) {
        move(position.lineIndex + 1 < chapter.intro.length
          ? { ...position, lineIndex: position.lineIndex + 1 }
          : { kind: 'investigation', chapterId: chapter.id });
      }
      break;
    case 'evidence.inspected': {
      const clue = chapter.evidence.find(item => item.id === event.evidenceId);
      const exchangeIndex = chapter.conversation?.exchanges.findIndex(item => item.evidenceId === event.evidenceId) ?? -1;
      if (position.kind === 'investigation' && clue?.discovery === 'hotspot' && (!chapter.portal || portalOpened(state, chapter)) && !state.discoveries[clue.id] && (exchangeIndex < 0 || conversationStep(state, chapter) > exchangeIndex)) {
        change = { discoveries: { ...state.discoveries, [clue.id]: { eventIndex } } };
      }
      break;
    }
    case 'reference.inspected':
      if (canInspect && event.sourceId === chapter.source.id && event.inspectionId === chapter.source.inspectionId && !state.references[event.sourceId]) {
        change = { references: { ...state.references, [event.sourceId]: { inspectedAt: eventIndex } } };
      }
      break;
    case 'source.compared': {
      const reference = state.references[event.sourceId];
      if (canInspect && event.sourceId === chapter.source.id && reference && reference.comparedAt === undefined && (!chapter.portal || chapter.portal.comparisons.every(item => claimMatched(state, item.id)))) {
        change = {
          references: { ...state.references, [event.sourceId]: { ...reference, comparedAt: eventIndex } },
          discoveries: { ...state.discoveries, [chapter.source.evidenceId]: { eventIndex } },
        };
        const choice = state.choices[decision.id];
        if (position.kind === 'verification' && choice) change.position = outcome(choice.optionId);
      }
      break;
    }
    case 'decision.opened':
      if (position.kind === 'investigation' && event.decisionId === decision.id && (!chapter.portal || state.references[chapter.source.id]?.comparedAt !== undefined) && (!chapter.conversation || conversationStep(state, chapter) === chapter.conversation.exchanges.length)) move({ kind: 'decision', chapterId: chapter.id, decisionId: decision.id });
      break;
    case 'decision.closed':
      if (position.kind === 'decision' && event.decisionId === decision.id) move({ kind: 'investigation', chapterId: chapter.id });
      break;
    case 'choice.committed': {
      const option = decision.options.find(item => item.id === event.optionId);
      if (position.kind !== 'decision' || event.decisionId !== decision.id || !option || state.choices[decision.id]) break;
      change = {
        choices: { ...state.choices, [decision.id]: { optionId: option.id, eventIndex, evidenceAtCommit: Object.keys(state.discoveries) } },
        flags: { ...state.flags, ...Object.fromEntries(option.effects.map(flag => [flag, true])) },
        position: option.resolution && state.references[option.resolution.sourceId]?.comparedAt === undefined
          ? { kind: 'verification', chapterId: chapter.id, decisionId: decision.id, sourceId: option.resolution.sourceId }
          : outcome(option.id),
      };
      break;
    }
    case 'outcome.continued':
      if (position.kind === 'outcome' && event.nodeId === outcomeNode(position.decisionId, position.optionId)) move(chapter.portal ? { kind: 'recovery', chapterId: chapter.id } : { ...position, kind: 'debrief' });
      break;
    case 'debrief.continued': {
      if (position.kind !== 'debrief' || event.nodeId !== debriefNode(position.decisionId, position.optionId)) break;
      // Keep shipped chapter checkpoints stable when additive content is installed.
      move({ kind: 'chapterComplete', chapterId: chapter.id });
      break;
    }
  }
  return change ? { ...state, ...change, history: [...state.history, event] } : state;
}

export function chapterFacts(state: GameState, chapter: Chapter) {
  const choice = state.choices[chapter.decision.id];
  const option = chapter.decision.options.find(item => item.id === choice?.optionId);
  const reference = state.references[chapter.source.id];
  return {
    awareness: chapter.evidence.filter(clue => choice?.evidenceAtCommit.includes(clue.id)).length,
    verification: reference ? 1 + Number(reference.comparedAt !== undefined) : 0,
    safety: option?.safetyCriteriaMet.length ?? 0,
    lateEvidence: chapter.evidence.filter(clue => state.discoveries[clue.id] && !choice?.evidenceAtCommit.includes(clue.id)),
    option,
  };
}
