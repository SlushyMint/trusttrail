export type ChapterId = 'C1' | 'C2' | 'C3';
export type StoryFlag = 'openedSuspiciousLink' | 'simulatedDataExposure' | 'simulatedAccountRisk' | 'protectedData' | 'stoppedPortalFlow';
export type StoryLine = { id: string; speaker: 'Ari' | 'Narator'; text: string };

export type Evidence = {
  id: string;
  chapterId: ChapterId;
  title: string;
  actionLabel: string;
  detail: string;
  explanation: string;
  caution: string;
  discovery: 'hotspot' | 'source-comparison';
};

export type VerificationSource = {
  id: string;
  inspectionId: string;
  actionLabel: string;
  provenance: string;
  address: string;
  claim: string;
  reference: string;
  comparison: string;
  evidenceId: string;
};

export type Option = {
  id: string;
  label: string;
  description: string;
  effects: readonly StoryFlag[];
  safetyCriteriaMet: readonly string[];
  resolution?: { sourceId: string };
  outcome: { title: string; text: string; reflection: string };
  feedback: { happened: string; why: string; next: string; limitation: string };
};

export type Chapter = {
  id: ChapterId;
  title: string;
  subtitle: string;
  objective: string;
  intro: readonly StoryLine[];
  evidence: readonly Evidence[];
  source: VerificationSource;
  email: { sender: string; address: string; subject: string; paragraphs: readonly string[]; displayedLink: string; destination: string };
  decoy: { sender: string; address: string; subject: string; text: string; context: string };
  decision: { id: string; prompt: string; options: readonly Option[] };
  bridge: { cautious: string; exposed: string };
};

export type Scenario = { contentVersion: string; rubricVersion: 'v1'; chapters: readonly Chapter[] };

export type Position =
  | { kind: 'menu' }
  | { kind: 'briefing' }
  | { kind: 'narrative'; chapterId: ChapterId; lineIndex: number }
  | { kind: 'investigation'; chapterId: ChapterId }
  | { kind: 'decision'; chapterId: ChapterId; decisionId: string }
  | { kind: 'verification'; chapterId: ChapterId; decisionId: string; sourceId: string }
  | { kind: 'outcome' | 'debrief'; chapterId: ChapterId; decisionId: string; optionId: string }
  | { kind: 'chapterComplete'; chapterId: ChapterId };

export type GameEvent =
  | { type: 'run.started' }
  | { type: 'story.begun' }
  | { type: 'line.advanced'; nodeId: string; lineIndex: number }
  | { type: 'evidence.inspected'; evidenceId: string }
  | { type: 'reference.inspected'; sourceId: string; inspectionId: string }
  | { type: 'source.compared'; sourceId: string }
  | { type: 'decision.opened' | 'decision.closed'; decisionId: string }
  | { type: 'choice.committed'; decisionId: string; optionId: string }
  | { type: 'outcome.continued' | 'debrief.continued'; nodeId: string };

export type ChoiceRecord = { optionId: string; eventIndex: number; evidenceAtCommit: readonly string[] };
export type GameState = {
  position: Position;
  history: readonly GameEvent[];
  choices: Readonly<Record<string, ChoiceRecord>>;
  discoveries: Readonly<Record<string, { eventIndex: number }>>;
  references: Readonly<Record<string, { inspectedAt: number; comparedAt?: number }>>;
  flags: Readonly<Partial<Record<StoryFlag, boolean>>>;
};
