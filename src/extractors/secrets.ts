export interface SecretMatch {
  type: string;
  key: string;
  snippet: string;
}

const secretPatterns: Record<string, RegExp> = {
  'AWS Access Key': /AKIA[0-9A-Z]{16}/g,
  'Google API Key': /AIza[0-9A-Za-z\-_]{35}/g,
  'Stripe Live Key': /sk_live_[0-9a-zA-Z]{24,34}/g,
  'GitHub Personal Access Token': /ghp_[0-9a-zA-Z]{36}/g,
  'Slack Webhook': /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]+\/B[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+/g,
  'Generic API Key': /(?:api_key|apikey|secret_key|private_key)\s*[:=]\s*["']([0-9a-zA-Z\-_]{16,64})["']/gi,
  'JWT Token': /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/g
};

export function extractSecrets(code: string): SecretMatch[] {
  const secrets: SecretMatch[] = [];

  for (const [type, pattern] of Object.entries(secretPatterns)) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(code)) !== null) {
      const key = match[1] || match[0];
      const start = Math.max(0, match.index - 20);
      const end = Math.min(code.length, match.index + match[0].length + 20);
      const snippet = code.substring(start, end).replace(/\n/g, ' ');

      secrets.push({
        type,
        key,
        snippet
      });
    }
  }

  return secrets;
}
