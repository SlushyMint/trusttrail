import { chapterOne } from './chapters/c1';
import { chapterTwo } from './chapters/c2';
import { chapterThree } from './chapters/c3';
import type { Scenario } from '../engine/types';

// Additive chapters retain these versions only while existing IDs and event semantics stay stable.
export const scenario: Scenario = { contentVersion: 'trusttrail-1', rubricVersion: 'v1', chapters: [chapterOne, chapterTwo, chapterThree] };
