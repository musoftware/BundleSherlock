import fingerprints from './fingerprints.json';

export interface LibrarySignature {
  name: string;
  category: string;
  versionRegex?: string;
  signatures: string[];
  weight: number;
  cdn?: string;
}

export interface DetectionResult {
  name: string;
  category: string;
  confidence: number;
  version?: string;
  cdn?: string;
}

export function detectLibraries(code: string): DetectionResult[] {
  const results: DetectionResult[] = [];
  const libs: LibrarySignature[] = fingerprints as LibrarySignature[];

  for (const lib of libs) {
    let score = 0;
    const maxScore = lib.signatures.length * lib.weight;

    for (const sig of lib.signatures) {
      try {
        const regex = new RegExp(sig, 'i');
        if (regex.test(code)) {
          score += lib.weight;
        }
      } catch {
        if (code.includes(sig)) {
          score += lib.weight;
        }
      }
    }

    if (score > 0) {
      const rawConfidence = (score / maxScore) * 100;
      const confidence = Math.min(100, Math.round(rawConfidence > 50 ? 95 : rawConfidence > 20 ? 70 : 40));

      let version: string | undefined = undefined;
      if (lib.versionRegex) {
        try {
          const vMatch = new RegExp(lib.versionRegex).exec(code);
          if (vMatch && vMatch[1]) {
            version = vMatch[1];
          }
        } catch {
          // ignore version regex error
        }
      }

      results.push({
        name: lib.name,
        category: lib.category,
        confidence,
        version,
        cdn: lib.cdn
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}
