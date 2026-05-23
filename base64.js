// base64.js

function toBase64(input) {
  if (!input) return '';
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch (e) {
    return btoa(input);
  }
}


function fromBase64(input) {
  if (!input) return '';
  try {
    return decodeURIComponent(escape(atob(input)));
  } catch (e) {
    try {
      return atob(input);
    } catch {
      return '';
    }
  }
}


function isBase64(str) {
  if (!str) return false;
  const clean = str.replace(/\s+/g, '');
  return /^[A-Za-z0-9+/]*={0,2}$/.test(clean) && clean.length % 4 === 0;
}


function base64Encode() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود للتشفير', 'warn');
    return;
  }
  const encoded = toBase64(input);
  setResult(encoded);
  shadowLog('✓ تم تشفير الكود إلى Base64', 'ok');
}


function base64Decode() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود لفك التشفير', 'warn');
    return;
  }
  if (!isBase64(input)) {
    shadowLog('✗ النص ليس Base64 صحيح', 'err');
    return;
  }
  const decoded = fromBase64(input);
  if (!decoded) {
    shadowLog('✗ فشل فك التشفير', 'err');
    return;
  }
  setResult(decoded);
  shadowLog('✓ تم فك تشفير Base64 بنجاح', 'ok');
}


function base64Run() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود', 'warn');
    return;
  }
  if (isBase64(input)) {
    base64Decode();
  } else {
    base64Encode();
  }
}


base64Run();