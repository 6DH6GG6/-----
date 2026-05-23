// parser.js

function parseAIResponse(data) {
  if (!data || !data.content) return '';

  return data.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');
}


function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/```$/gm, '')
    .trim();
}


function parseCodeOnly(data) {
  const raw = parseAIResponse(data);
  return stripMarkdown(raw);
}


function parseReport(text) {
  if (!text) return { errors: [], warnings: [], score: null };

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const errors = [];
  const warnings = [];
  let score = null;

  lines.forEach(line => {
    const scoreMatch = line.match(/(\d+)\s*\/\s*100/);
    if (scoreMatch) {
      score = parseInt(scoreMatch[1]);
      return;
    }

    const errorMatch = line.match(/(\d+)\.\s*\[?(high|medium|low)\]?\s*(?:سطر\s*(\d+))?\s*[—-]\s*(.+)/i);
    if (errorMatch) {
      errors.push({
        index:    parseInt(errorMatch[1]),
        severity: errorMatch[2].toLowerCase(),
        line:     errorMatch[3] ? parseInt(errorMatch[3]) : null,
        message:  errorMatch[4].trim()
      });
      return;
    }

    const warnMatch = line.match(/(\d+)\.\s*(?:سطر\s*(\d+))\s*[—-]\s*(.+)/);
    if (warnMatch) {
      warnings.push({
        index:   parseInt(warnMatch[1]),
        line:    parseInt(warnMatch[2]),
        message: warnMatch[3].trim()
      });
    }
  });

  return { errors, warnings, score };
}


function parseExplanation(data) {
  const raw = parseAIResponse(data);
  if (!raw) return '';
  return raw.trim();
}


function parseGeneratedCode(data) {
  const raw = parseAIResponse(data);
  return stripMarkdown(raw);
}


function parseBlocks(text) {
  if (!text) return [];

  const blocks = [];
  const blockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let match;

  while ((match = blockRegex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code:     match[2].trim()
    });
  }

  if (blocks.length === 0) {
    blocks.push({ language: 'text', code: text.trim() });
  }

  return blocks;
}


function extractFunctions(code) {
  if (!code) return [];

  const functions = [];

  const namedFunc = /function\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
  let match;
  while ((match = namedFunc.exec(code)) !== null) {
    functions.push({
      name:   match[1],
      params: match[2].split(',').map(p => p.trim()).filter(Boolean),
      index:  match.index,
      line:   code.slice(0, match.index).split('\n').length
    });
  }

  const arrowFunc = /(?:const|let|var)\s+(\w+)\s*=\s*(?:\(([^)]*)\)|(\w+))\s*=>/g;
  while ((match = arrowFunc.exec(code)) !== null) {
    functions.push({
      name:   match[1],
      params: match[2]
        ? match[2].split(',').map(p => p.trim()).filter(Boolean)
        : [match[3]],
      index:  match.index,
      line:   code.slice(0, match.index).split('\n').length
    });
  }

  functions.sort((a, b) => a.index - b.index);
  return functions;
}


function validateResponse(data) {
  if (!data) return { valid: false, reason: 'لا يوجد رد' };
  if (!data.content) return { valid: false, reason: 'رد فارغ' };
  if (!Array.isArray(data.content)) return { valid: false, reason: 'تنسيق غير صحيح' };
  if (data.content.length === 0) return { valid: false, reason: 'المحتوى فارغ' };

  const hasText = data.content.some(b => b.type === 'text' && b.text.trim());
  if (!hasText) return { valid: false, reason: 'لا يوجد نص في الرد' };

  return { valid: true, reason: null };
}