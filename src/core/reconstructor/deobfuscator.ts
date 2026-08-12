export function deobfuscateCode(code: string): string {
  let cleaned = code;

  // 1. Replace boolean shorthand: !0 -> true, !1 -> false
  cleaned = cleaned.replace(/(?<=\W|^)!0(?=\W|$)/g, 'true');
  cleaned = cleaned.replace(/(?<=\W|^)!1(?=\W|$)/g, 'false');

  // 2. Replace void shorthand: void 0 -> undefined, void 1 -> undefined
  cleaned = cleaned.replace(/\bvoid\s+[01]\b/g, 'undefined');

  // 3. De-group trailing sequence calls e.g., (a(), b(), c()) into readable statements
  cleaned = cleaned.replace(/;\s*\(([\w\.\(\)]+,\s*[\w\.\(\)]+)\)/g, (match, body) => {
    const parts = body.split(/,\s*/);
    return ';\n' + parts.map((p: string) => p.trim() + ';').join('\n');
  });

  return cleaned;
}
