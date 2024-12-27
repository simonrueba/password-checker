interface KeyboardLayout {
  [key: string]: {
    adjacent: string[];
    row: number;
    col: number;
  };
}

const QWERTY_LAYOUT: KeyboardLayout = {
  'q': { adjacent: ['w', 'a', 's'], row: 0, col: 0 },
  'w': { adjacent: ['q', 'e', 'a', 's', 'd'], row: 0, col: 1 },
  'e': { adjacent: ['w', 'r', 's', 'd', 'f'], row: 0, col: 2 },
  'r': { adjacent: ['e', 't', 'd', 'f', 'g'], row: 0, col: 3 },
  't': { adjacent: ['r', 'y', 'f', 'g', 'h'], row: 0, col: 4 },
  'y': { adjacent: ['t', 'u', 'g', 'h', 'j'], row: 0, col: 5 },
  'u': { adjacent: ['y', 'i', 'h', 'j', 'k'], row: 0, col: 6 },
  'i': { adjacent: ['u', 'o', 'j', 'k', 'l'], row: 0, col: 7 },
  'o': { adjacent: ['i', 'p', 'k', 'l'], row: 0, col: 8 },
  'p': { adjacent: ['o', 'l'], row: 0, col: 9 },
  'a': { adjacent: ['q', 'w', 's', 'z', 'x'], row: 1, col: 0 },
  's': { adjacent: ['w', 'e', 'a', 'd', 'z', 'x', 'c'], row: 1, col: 1 },
  'd': { adjacent: ['e', 'r', 's', 'f', 'x', 'c', 'v'], row: 1, col: 2 },
  'f': { adjacent: ['r', 't', 'd', 'g', 'c', 'v', 'b'], row: 1, col: 3 },
  'g': { adjacent: ['t', 'y', 'f', 'h', 'v', 'b', 'n'], row: 1, col: 4 },
  'h': { adjacent: ['y', 'u', 'g', 'j', 'b', 'n', 'm'], row: 1, col: 5 },
  'j': { adjacent: ['u', 'i', 'h', 'k', 'n', 'm'], row: 1, col: 6 },
  'k': { adjacent: ['i', 'o', 'j', 'l', 'm'], row: 1, col: 7 },
  'l': { adjacent: ['o', 'p', 'k'], row: 1, col: 8 },
  'z': { adjacent: ['a', 's', 'x'], row: 2, col: 0 },
  'x': { adjacent: ['s', 'd', 'z', 'c'], row: 2, col: 1 },
  'c': { adjacent: ['d', 'f', 'x', 'v'], row: 2, col: 2 },
  'v': { adjacent: ['f', 'g', 'c', 'b'], row: 2, col: 3 },
  'b': { adjacent: ['g', 'h', 'v', 'n'], row: 2, col: 4 },
  'n': { adjacent: ['h', 'j', 'b', 'm'], row: 2, col: 5 },
  'm': { adjacent: ['j', 'k', 'n'], row: 2, col: 6 }
};

export interface PatternAnalysis {
  hasKeyboardPattern: boolean;
  patterns: string[];
  patternTypes: {
    horizontal: boolean;
    diagonal: boolean;
    repeated: boolean;
    sequential: boolean;
  };
}

export function analyzeKeyboardPatterns(password: string): PatternAnalysis {
  const lowerPassword = password.toLowerCase();
  const result: PatternAnalysis = {
    hasKeyboardPattern: false,
    patterns: [],
    patternTypes: {
      horizontal: false,
      diagonal: false,
      repeated: false,
      sequential: false
    }
  };

  // Check for horizontal patterns (same row)
  for (let i = 0; i < lowerPassword.length - 2; i++) {
    const char = lowerPassword[i];
    const next = lowerPassword[i + 1];
    const nextNext = lowerPassword[i + 2];

    if (QWERTY_LAYOUT[char] && QWERTY_LAYOUT[next] && QWERTY_LAYOUT[nextNext]) {
      // Check if they're in the same row and sequential
      if (QWERTY_LAYOUT[char].row === QWERTY_LAYOUT[next].row &&
          QWERTY_LAYOUT[next].row === QWERTY_LAYOUT[nextNext].row) {
        const pattern = char + next + nextNext;
        result.patterns.push(pattern);
        result.patternTypes.horizontal = true;
        result.hasKeyboardPattern = true;
      }
    }
  }

  // Check for diagonal patterns
  for (let i = 0; i < lowerPassword.length - 2; i++) {
    const char = lowerPassword[i];
    const next = lowerPassword[i + 1];
    const nextNext = lowerPassword[i + 2];

    if (QWERTY_LAYOUT[char] && QWERTY_LAYOUT[next] && QWERTY_LAYOUT[nextNext]) {
      if (Math.abs(QWERTY_LAYOUT[char].row - QWERTY_LAYOUT[next].row) === 1 &&
          Math.abs(QWERTY_LAYOUT[next].row - QWERTY_LAYOUT[nextNext].row) === 1) {
        const pattern = char + next + nextNext;
        result.patterns.push(pattern);
        result.patternTypes.diagonal = true;
        result.hasKeyboardPattern = true;
      }
    }
  }

  // Check for repeated characters
  const repeatedPattern = /(.)\1{2,}/;
  if (repeatedPattern.test(lowerPassword)) {
    result.patternTypes.repeated = true;
    result.hasKeyboardPattern = true;
    result.patterns.push(...lowerPassword.match(repeatedPattern) || []);
  }

  // Check for sequential characters
  const sequential = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < lowerPassword.length - 2; i++) {
    const slice = lowerPassword.slice(i, i + 3);
    if (sequential.includes(slice) || sequential.split('').reverse().join('').includes(slice)) {
      result.patternTypes.sequential = true;
      result.hasKeyboardPattern = true;
      result.patterns.push(slice);
    }
  }

  return result;
}

export function getKeyboardPatternFeedback(analysis: PatternAnalysis): string[] {
  const feedback: string[] = [];

  if (analysis.patternTypes.horizontal) {
    feedback.push("Avoid using keyboard row patterns (e.g., 'qwerty', 'asdf')");
  }

  if (analysis.patternTypes.diagonal) {
    feedback.push("Avoid diagonal keyboard patterns (e.g., 'qaz', 'zxc')");
  }

  if (analysis.patternTypes.repeated) {
    feedback.push("Avoid repeating characters more than twice");
  }

  if (analysis.patternTypes.sequential) {
    feedback.push("Avoid sequential characters (e.g., 'abc', '123')");
  }

  return feedback;
} 