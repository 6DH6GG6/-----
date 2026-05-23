// format_5lines.js

function formatTo5Lines(code) {
  if (!code) return '';

  const lines = code
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const groups = [];
  for (let i = 0; i < lines.length; i += 5) {
    groups.push(lines.slice(i, i + 5).join('\n'));
  }

  return groups.join('\n\n');
}


function smartFormat5(code) {
  if (!code) return '';

  const blocks = splitToBlocks(code);
  const formatted = [];

  blocks.forEach(block => {
    const lines = block
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) return;

    const groups = [];
    for (let i = 0; i < lines.length; i += 5) {
      groups.push(lines.slice(i, i + 5).join('\n'));
    }

    formatted.push(groups.join('\n\n'));
  });

  return formatted.join('\n\n');
}


function splitToBlocks(code) {
  const blocks = [];
  let current = [];
  let depth = 0;

  const lines = code.split('\n');

  lines.forEach(line => {
    const trimmed = line.trim();

    for (const ch of trimmed) {
      if (ch === '{') depth++;
      if (ch === '}') depth--;
    }

    current.push(line);

    if (depth === 0 && current.length > 0 && trimmed.endsWith('}')) {
      blocks.push(current.join('\n'));
      current = [];
    }
  });

  if (current.length > 0) {
    blocks.push(current.join('\n'));
  }

  return blocks.filter(b => b.trim().length > 0);
}


function addIndent(code) {
  if (!code) return '';

  let depth = 0;
  const lines = code.split('\n');
  const result = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push('');
      return;
    }

    if (trimmed.startsWith('}') || trimmed.startsWith(')') || trimmed.startsWith(']')) {
      depth = Math.max(0, depth - 1);
    }

    result.push('  '.repeat(depth) + trimmed);

    if (trimmed.endsWith('{') || trimmed.endsWith('(') || trimmed.endsWith('[')) {
      depth++;
    }
  });

  return result.join('\n');
}


function format5Run() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود للتنسيق', 'warn');
    return;
  }

  shadowLog('جاري تنسيق الكود بـ 5 أسطر...', 'info');

  const formatted = smartFormat5(input);
  const indented  = addIndent(formatted);

  setResult(indented);

  const before = input.split('\n').length;
  const after  = indented.split('\n').length;
  shadowLog(`✓ تم التنسيق — من ${before} إلى ${after} سطر`, 'ok');
}


format5Run();