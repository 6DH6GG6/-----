// mode_compact.js

function toCompactMode(code) {
  if (!code) return '';

  let result = code;

  result = removeCommentsCompact(result);
  result = compactVariables(result);
  result = compactFunctions(result);
  result = compactConditions(result);
  result = compactLoops(result);
  result = normalizeCompact(result);

  return result;
}


function removeCommentsCompact(code) {
  const strings = [];
  let index = 0;

  let result = code.replace(/(`[^`]*`|"[^"]*"|'[^']*')/g, (match) => {
    const placeholder = `__STR${index}__`;
    strings.push({ placeholder, value: match });
    index++;
    return placeholder;
  });

  result = result
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');

  strings.forEach(({ placeholder, value }) => {
    result = result.replace(placeholder, value);
  });

  return result;
}


function compactVariables(code) {
  return code
    .replace(/\bvar\s+/g, 'let ')
    .replace(/\s*=\s*/g, '=')
    .replace(/\s*\+=\s*/g, '+=')
    .replace(/\s*-=\s*/g, '-=')
    .replace(/\s*\*=\s*/g, '*=')
    .replace(/\s*\/=\s*/g, '/=');
}


function compactFunctions(code) {
  return code
    .replace(
      /function\s+(\w+)\s*\(([^)]*)\)\s*\{\s*return\s+([^;]+);\s*\}/g,
      'const $1=($2)=>$3'
    )
    .replace(/function\s+(\w+)\s*\(/g, 'function $1(')
    .replace(/\)\s*\{/g, '){')
    .replace(/\{\s*\n\s*/g, '{')
    .replace(/\s*\n\s*\}/g, '}');
}


function compactConditions(code) {
  return code
    .replace(/if\s*\(/g, 'if(')
    .replace(/\)\s*\{/g, '){')
    .replace(/\}\s*else\s*if\s*\(/g, '}else if(')
    .replace(/\}\s*else\s*\{/g, '}else{')
    .replace(/\s*===\s*/g, '===')
    .replace(/\s*!==\s*/g, '!==')
    .replace(/\s*&&\s*/g, '&&')
    .replace(/\s*\|\|\s*/g, '||');
}


function compactLoops(code) {
  return code
    .replace(/for\s*\(/g, 'for(')
    .replace(/while\s*\(/g, 'while(')
    .replace(/\s*;\s*/g, ';')
    .replace(/;\s+/g, ';');
}


function normalizeCompact(code) {
  return code
    .replace(/\n{2,}/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s*,\s*/g, ',')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\[\s+/g, '[')
    .replace(/\s+\]/g, ']')
    .trim();
}


function getCompactStats(original, compacted) {
  const originalSize  = new Blob([original]).size;
  const compactedSize = new Blob([compacted]).size;
  const saved = ((originalSize - compactedSize) / originalSize * 100).toFixed(1);
  const originalLines = original.split('\n').length;
  const compactedLines = compacted.split('\n').length;

  return { originalSize, compactedSize, saved, originalLines, compactedLines };
}


function compactRun() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود لضغطه', 'warn');
    return;
  }

  shadowLog('جاري تحويل الكود إلى الوضع المضغوط...', 'info');

  const compacted = toCompactMode(input);

  setResult(compacted);

  const stats = getCompactStats(input, compacted);
  shadowLog(`✓ الوضع المضغوط — ${stats.originalLines} → ${stats.compactedLines} سطر`, 'ok');
  shadowLog(`حجم: ${stats.originalSize} → ${stats.compactedSize} بايت (${stats.saved}%)`, 'ok');
}


compactRun();