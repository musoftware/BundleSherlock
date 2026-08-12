export type RuleCategory = 'ui' | 'editor' | 'polyfill' | 'vendor' | 'app';

export interface DetectionRule {
  name: string;
  category: RuleCategory;
  signatures: string[];
  weight: number;
  penaltyIf?: string[]; // Exception patterns: if present, reduce vendor score or treat as original
}

export interface DetectionResult {
  isOriginal: boolean;
  type: 'ORIGINAL' | 'VENDOR' | 'UNKNOWN';
  confidence: number; // 0 - 100
  vendorScore: number;
  originalScore: number;
  matchedRules: string[];
}
