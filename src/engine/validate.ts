import type { Scenario } from './types';

/** Content failures are authoring errors, checked independently of renderer execution. */
export function validateScenario(content: Scenario): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const unique = (id: string) => { if (!id || ids.has(id)) problems.push(`Duplicate/empty ID: ${id}`); ids.add(id); };
  if (!content.chapters.length) problems.push('Scenario needs a chapter.');
  for (const [index, chapter] of content.chapters.entries()) {
    unique(chapter.id);
    if (chapter.id !== `C${index + 1}`) problems.push(`Chapter order: ${chapter.id}`);
    if (!chapter.intro.length) problems.push(`Missing intro: ${chapter.id}`);
    chapter.intro.forEach(line => { unique(line.id); if (!line.text.trim()) problems.push(`Empty line: ${line.id}`); });
    const source = chapter.source;
    unique(source.id); unique(source.inspectionId); unique(chapter.decision.id);
    if (!/^[a-z0-9.-]+\.example(?:\/|$)/i.test(source.address)) problems.push(`Unsafe source domain: ${source.id}`);
    for (const address of [chapter.email.address, chapter.decoy.address]) {
      if (!/^[^@\s]+@[a-z0-9.-]+\.example$/i.test(address)) problems.push(`Unsafe sender: ${address}`);
    }
    for (const address of [chapter.email.displayedLink, chapter.email.destination]) {
      if (!/^[a-z0-9.-]+\.example(?:\/|$)/i.test(address)) problems.push(`Unsafe destination: ${address}`);
    }
    for (const clue of chapter.evidence) {
      unique(clue.id);
      if (clue.chapterId !== chapter.id || !clue.detail || !clue.explanation || !clue.caution) problems.push(`Incomplete evidence: ${clue.id}`);
    }
    const requiredEvidence = [1, 2, 3, 4].map(number => `${chapter.id}-E0${number}`);
    if (chapter.evidence.length !== 4 || requiredEvidence.some(id => !chapter.evidence.some(clue => clue.id === id))) problems.push(`Evidence map: ${chapter.id}`);
    if (chapter.evidence.filter(clue => clue.discovery === 'hotspot').length !== 3) problems.push(`Hotspot count: ${chapter.id}`);
    const comparisonClues = chapter.evidence.filter(clue => clue.discovery === 'source-comparison');
    if (comparisonClues.length !== 1 || comparisonClues[0]?.id !== source.evidenceId) problems.push(`Broken source evidence: ${source.id}`);
    if (!source.provenance || !source.claim || !source.reference || !source.comparison) problems.push(`Incomplete source: ${source.id}`);
    if (chapter.decision.options.length < 2 || chapter.decision.options.length > 3) problems.push(`Option count: ${chapter.decision.id}`);
    const options = new Set<string>();
    for (const option of chapter.decision.options) {
      if (options.has(option.id)) problems.push(`Duplicate option: ${option.id}`);
      options.add(option.id);
      if (option.resolution && option.resolution.sourceId !== source.id) problems.push(`Broken resolution: ${option.id}`);
      if (!option.outcome.title || !option.outcome.text || !option.outcome.reflection || Object.values(option.feedback).some(value => !value.trim())) problems.push(`Dead/incomplete outcome: ${option.id}`);
      if (new Set(option.safetyCriteriaMet).size !== option.safetyCriteriaMet.length || option.safetyCriteriaMet.length > 2) problems.push(`Invalid safety criteria: ${option.id}`);
    }
    if (!chapter.bridge.cautious || !chapter.bridge.exposed) problems.push(`Missing continuation: ${chapter.id}`);
  }
  return problems;
}
