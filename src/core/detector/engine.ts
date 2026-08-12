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
    let matchesCount = 0;
    let score = 0;
    const maxScore = lib.signatures.length * lib.weight;

    for (const sig of lib.signatures) {
      try {
        // Escape standard string characters if not regex
        const safeSig = sig.replace(/([.*+?^${}()|[\]\\])/g, '\\$1');
        const regex = new RegExp(`\\b${safeSig}\\b`, 'i');
        if (regex.test(code)) {
          matchesCount++;
          score += lib.weight;
        }
      } catch {
        if (code.includes(sig)) {
          matchesCount++;
          score += lib.weight;
        }
      }
    }

    // Require at least 2 signature matches or 50%+ ratio to eliminate false positives
    const matchRatio = matchesCount / lib.signatures.length;
    if (matchesCount >= 2 || (matchesCount === 1 && matchRatio >= 0.5 && lib.signatures[0].length > 10)) {
      const rawConfidence = Math.round((score / maxScore) * 100);
      const confidence = Math.min(100, Math.max(50, rawConfidence));

      let version: string | undefined = undefined;
      if (lib.versionRegex) {
        try {
          const vMatch = new RegExp(lib.versionRegex, 'i').exec(code);
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
