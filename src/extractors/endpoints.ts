export interface ExtractedEndpoints {
  relative: string[];
  absolute: string[];
}

export function extractEndpoints(code: string): ExtractedEndpoints {
  const relativeSet = new Set<string>();
  const absoluteSet = new Set<string>();

  const endpointRegex = /(?:["'`])(\/(?:api|v1|v2|v3|auth|graphql|rest|user|admin|dashboard|hooks|ws)[\/\w\-]*)(?:["'`])/g;
  const urlRegex = /https?:\/\/(?:api\.)?[\w\-]+\.[\w\.\-]+[\/\w\-]*/g;

  let match;
  while ((match = endpointRegex.exec(code)) !== null) {
    if (match[1] && match[1].length > 3) {
      relativeSet.add(match[1]);
    }
  }

  while ((match = urlRegex.exec(code)) !== null) {
    if (match[0] && !match[0].includes('w3.org') && !match[0].includes('schema.org')) {
      absoluteSet.add(match[0]);
    }
  }

  return {
    relative: Array.from(relativeSet),
    absolute: Array.from(absoluteSet)
  };
}
