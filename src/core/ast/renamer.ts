export function renameSemanticIdentifiers(code: string): string {
  let cleaned = code;

  // Replace minified anonymous function parameters function(e,t,n,o) -> function(params, options, config, context)
  cleaned = cleaned.replace(/function\s*\(\s*e\s*,\s*t\s*,\s*n\s*,\s*o\s*\)/g, 'function(params, options, config, context)');
  cleaned = cleaned.replace(/function\s*\(\s*e\s*,\s*t\s*,\s*n\s*\)/g, 'function(params, options, config)');
  cleaned = cleaned.replace(/function\s*\(\s*e\s*,\s*t\s*\)/g, 'function(params, options)');

  // Replace minified arrow function parameters (e,t,n) => -> (params, options, config) =>
  cleaned = cleaned.replace(/\(\s*e\s*,\s*t\s*,\s*n\s*\)\s*=>/g, '(params, options, config) =>');
  cleaned = cleaned.replace(/\(\s*e\s*,\s*t\s*\)\s*=>/g, '(params, options) =>');

  // Contextual paystack / transaction parameter renaming
  if (/paystack|transaction/i.test(cleaned)) {
    cleaned = cleaned.replace(/\btransactionId\b/g, 'transactionId')
      .replace(/\bmerchant_key\b/g, 'merchantKey')
      .replace(/\baccess_code\b/g, 'accessCode');
  }

  return cleaned;
}
