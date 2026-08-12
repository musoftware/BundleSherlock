export type RuleCategory = 
  | 'vendor_ui' 
  | 'vendor_editor' 
  | 'vendor_polyfill' 
  | 'vendor_framework' 
  | 'original_app' 
  | 'app' 
  | 'ui' 
  | 'editor' 
  | 'polyfill' 
  | 'vendor';

export interface DetectionRule {
  name: string;
  category: RuleCategory;
  signatures: (string | RegExp)[];
  weight: number; // Positive for vendor (+20 to +50), Negative for application (-30 to -100)
  antiSignatures?: string[]; // If present in code, cancels vendor rule match
}

export interface DetectionResult {
  isOriginal: boolean;
  type: 'ORIGINAL' | 'VENDOR' | 'UNKNOWN';
  confidence: number; // 0 - 100
  totalScore: number;
  vendorScore: number;
  originalScore: number;
  matchedRules: string[];
}
