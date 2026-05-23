// mode_full.js

function toFullMode(code) {
  if (!code) return '';

  let result = code;

  result = expandBraces(result);
  result = expandConditions(result);
  result = expandLoops(result);
  result = expandArrowFunctions(result);
  result = addSpacing(result);
  result = addIndentation(result);
  result = normalizeFullMode(result);

  return result;
}


function expandBraces(code) {
  return code
    .replace(/\{(?!\n)/g, '{\n')
    .replace(/(?<!\n)\}/g, '\n}')
    .replace(/;(?!\n)/g, ';\n')
    .replace(/\}(?=\s*else)/g, '} ')
    .replace(/\}\s*else\s*\{/g, '} else {');
}


function expandConditions(code) {
  return code
    .replace(/if\s*\(/g, 'if (')
    .replace(/\)\s*\{/g, ') {')
    .replace(/\}\s*else\s*if\s*\(/g, '} else if (')
    .replace(/\}\s*else\s*\{/g, '} else {')
    .replace(/===\s*/g, ' === ')
    .replace(/\s*===/g, ' === ')
    .replace(/!==\s*/g, ' !== ')
    .replace(/\s*!==/g, ' !== ')
    .replace(/&&\s*/g, ' && ')
    .replace(/\s*&&/g, ' && ')
    .replace(/\|\|\s*/g, ' || ')
    .replace(/\s*\|\|/g, ' || ');
}


function expandLoops(code) {
  return code
    .replace(/for\s*\(/g, 'for (')
    .replace(/while\s*\(/g, 'while (')
    .replace(/;\s*/g, '; ')
    .replace(/;\s+/g, '; ');
}


function expandArrowFunctions(code) {
  return code
    .replace(
      /const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*([^{;\n][^\n;]*)/g,
      'function $1($2) {\n  return $3;\n}'
    )
    .replace(
      /const\s+(\w+)\s*=\s*(\w+)\s*=>\s*([^{;\n][^\n;]*)/g,
      'function $1($2) {\n  return $3;\n}'
    );
}


function addSpacing(code) {
  return code
    .replace(/,(?!\s)/g, ', ')
    .replace(/\s*=(?!=)\s*/g, ' = ')
    .replace(/\s*\+=\s*/g, ' += ')
    .replace(/\s*-=\s*/g, ' -= ')
    .replace(/\s*\*=\s*/g, ' *= ')
    .replace(/\s*\/=\s*/g, ' /= ')
    .replace(/\s*\+\s*/g, ' + ')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s*\*\s*/g, ' * ')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/function\s*\(/g, 'function (')
    .replace(/function\s+(\w+)\s*\(/g, 'function $1(')
    .replace(/return\s+/g, 'return ');
}


function addIndentation(code) {
  let depth = 0;
  const indent = '  ';
  const lines = code.split('\n');
  const result = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push('');
      return;
    }

    const closes = (trimmed.match(/[}\])]|^\)/g) || []).length;
    const opens  = (trimmed.match(/[{[(]/g) || []).length;

    if (closes > opens) {
      depth = Math.max(0, depth - (closes - opens));
    }

    result.push(indent.repeat(depth) + trimmed);

    if (opens > closes) {
      depth += (opens - closes);
    }
  });

  return result.join('\n');
}


function addDocComments(code) {
  return code.replace(
    /function\s+(\w+)\s*\(([^)]*)\)/g,
    (match, name, params) => {
      const paramList = params
        .split(',')
        .map(p => p.trim())
        .filter(Boolean);

      const doc = [
        '/**',
        ` * ${name}`,
        ...paramList.map(p => ` * @param ${p}`),
        ' */',
        match
      ].join('\n');

      return doc;
    }
  );
}


function normalizeFullMode(code) {
  return code
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\[\s+/g, '[')
    .replace(/\s+\]/g, ']')
    .replace(/\s{2,}(?=[^\n])/g, ' ')
    .trim();
}


function getFullStats(original, expanded) {
  const originalLines  = original.split('\n').length;
  const expandedLines  = expanded.split('\n').length;
  const addedLines     = expandedLines - originalLines;
  const originalSize   = new Blob([original]).size;
  const expandedSize   = new Blob([expanded]).size;

  return { originalLines, expandedLines, addedLines, originalSize, expandedSize };
}


function fullRun() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود للتوسيع', 'warn');
    return;
  }

  shadowLog('جاري تحويل الكود إلى الوضع المفصل...', 'info');

  const expanded = toFullMode(input);

  setResult(expanded);

  const stats = getFullStats(input, expanded);
  shadowLog(`✓ الوضع المفصل — ${stats.originalLines} → ${stats.expandedLines} سطر`, 'ok');
  shadowLog(`تمت إضافة ${stats.addedLines} سطر للوضوح والقراءة`, 'ok');
}


fullRun();