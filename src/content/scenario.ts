import { chapterOne } from './chapters/c1';
import type { Scenario } from '../engine/types';

// Additive chapters retain these versions only while existing IDs and event semantics stay stable.
export const scenario: Scenario = { contentVersion: 'trusttrail-1', rubricVersion: 'v1', chapters: [chapterOne] };
