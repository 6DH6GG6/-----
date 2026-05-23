// clean_code.js

function removeLineComments(code) {
  if (!code) return '';
  return code.replace(/\/\/[^\n]*/g, '');
}


function removeBlockComments(code) {
  if (!code) return '';
  return code.replace(/\/\*[\s\S]*?\*\//g, '');
}


function removeHashComments(code) {
  if (!code) return '';
  return code.replace(/#[^\n]*/g, '');
}


function removeHtmlComments(code) {
  if (!code) return '';
  return code.replace(/<!--[\s\S]*?-->/g, '');
}


function removeAllComments(code) {
  if (!code) return '';

  let result = code;

  const strings = [];
  let index = 0;

  result = result.replace(/(`[^`]*`|"[^"]*"|'[^']*')/g, (match) => {
    const placeholder = `__STR${index}__`;
    strings.push({ placeholder, value: match });
    index++;
    return placeholder;
  });

  result = removeBlockComments(result);
  result = removeLineComments(result);
  result = removeHtmlComments(result);

  strings.forEach(({ placeholder, value }) => {
    result = result.replace(placeholder, value);
  });

  return result;
}


function removeEmptyLines(code) {
  if (!code) return '';
  return code
    .split('\n')
    .filter(line => line.trim().length > 0)
    .join('\n');
}


function removeExtraSpaces(code) {
  if (!code) return '';
  return code
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n');
}


function removeConsoleLogs(code) {
  if (!code) return '';
  return code.replace(/\s*console\.(log|warn|error|info|debug)\([^)]*\);?\n?/g, '\n');
}


function removeDebugger(code) {
  if (!code) return '';
  return code.replace(/\s*debugger\s*;?\n?/g, '\n');
}


function normalizeBlankLines(code) {
  if (!code) return '';
  return code
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}


function cleanCode(code, options = {}) {
  if (!code) return '';

  const {
    comments    = true,
    emptyLines  = false,
    consoleLogs = false,
    debugger_   = false,
    extraSpaces = true
  } = options;

  let result = code;

  if (comments)    result = removeAllComments(result);
  if (consoleLogs) result = removeConsoleLogs(result);
  if (debugger_)   result = removeDebugger(result);
  if (emptyLines)  result = removeEmptyLines(result);
  if (extraSpaces) result = removeExtraSpaces(result);

  result = normalizeBlankLines(result);

  return result;
}


function getCleanStats(original, cleaned) {
  const originalLines = original.split('\n').length;
  const cleanedLines  = cleaned.split('\n').length;
  const removedLines  = originalLines - cleanedLines;

  const commentCount = (original.match(/\/\/[^\n]*/g) || []).length
    + (original.match(/\/\*[\s\S]*?\*\//g) || []).length;

  return { originalLines, cleanedLines, removedLines, commentCount };
}


function cleanRun() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود للتنظيف', 'warn');
    return;
  }

  shadowLog('جاري حذف التعليقات وتنظيف الكود...', 'info');

  const cleaned = cleanCode(input, {
    comments:    true,
    emptyLines:  false,
    consoleLogs: false,
    debugger_:   false,
    extraSpaces: true
  });

  setResult(cleaned);

  const stats = getCleanStats(input, cleaned);
  shadowLog(`✓ تم التنظيف — حُذف ${stats.commentCount} تعليق، ${stats.removedLines} سطر`, 'ok');
}


cleanRun();