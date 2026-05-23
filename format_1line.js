// format_1line.js

function compressToOneLine(code) {
  if (!code) return '';

  return code
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*([{};,()[\]=+\-*/<>!&|?:])\s*/g, '$1')
    .replace(/\s*=>\s*/g, '=>')
    .replace(/;\s*}/g, ';}')
    .replace(/{\s*/g, '{')
    .replace(/\s*}/g, '}')
    .replace(/,\s*/g, ',')
    .trim();
}


function smartCompress(code) {
  if (!code) return '';

  let result = code;

  result = removeComments(result);
  result = compressStrings(result);
  result = compressToOneLine(result);
  result = finalClean(result);

  return result;
}


function removeComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');
}


function compressStrings(code) {
  const strings = [];
  let index = 0;

  const result = code.replace(/(`[^`]*`|"[^"]*"|'[^']*')/g, (match) => {
    const placeholder = `__STR${index}__`;
    strings.push({ placeholder, value: match });
    index++;
    return placeholder;
  });

  let compressed = result
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*([{};,()[\]=+\-*/<>!&|?:])\s*/g, '$1')
    .replace(/\s*=>\s*/g, '=>')
    .trim();

  strings.forEach(({ placeholder, value }) => {
    compressed = compressed.replace(placeholder, value);
  });

  return compressed;
}


function finalClean(code) {
  return code
    .replace(/;;+/g, ';')
    .replace(/\{\s*\}/g, '{}')
    .replace(/\(\s*\)/g, '()')
    .replace(/,\s*\)/g, ')')
    .replace(/,\s*}/g, '}')
    .trim();
}


function estimateSize(original, compressed) {
  const originalSize  = new Blob([original]).size;
  const compressedSize = new Blob([compressed]).size;
  const saved = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
  return { originalSize, compressedSize, saved };
}


function format1Run() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود للضغط', 'warn');
    return;
  }

  shadowLog('جاري ضغط الكود إلى سطر واحد...', 'info');

  const compressed = smartCompress(input);

  setResult(compressed);

  const { originalSize, compressedSize, saved } = estimateSize(input, compressed);
  shadowLog(`✓ تم الضغط — ${originalSize} → ${compressedSize} بايت (وفّر ${saved}%)`, 'ok');
}


format1Run();