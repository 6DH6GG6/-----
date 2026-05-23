// hex.js

function toHex(input) {
  if (!input) return '';
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += input.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return result;
}


function fromHex(hex) {
  if (!hex) return '';
  hex = hex.replace(/\s+/g, '');
  if (hex.length % 2 !== 0) hex = '0' + hex;
  let result = '';
  for (let i = 0; i < hex.length; i += 2) {
    result += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return result;
}


function isHex(str) {
  if (!str) return false;
  const clean = str.replace(/\s+/g, '');
  return /^[0-9a-fA-F]+$/.test(clean) && clean.length % 2 === 0;
}


function hexEncode() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود للتشفير', 'warn');
    return;
  }
  const encoded = toHex(input);
  setResult(encoded);
  shadowLog('✓ تم تشفير الكود إلى Hex', 'ok');
}


function hexDecode() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود لفك التشفير', 'warn');
    return;
  }
  if (!isHex(input)) {
    shadowLog('✗ النص ليس Hex صحيح', 'err');
    return;
  }
  const decoded = fromHex(input);
  setResult(decoded);
  shadowLog('✓ تم فك تشفير Hex بنجاح', 'ok');
}


function hexRun() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود', 'warn');
    return;
  }
  if (isHex(input)) {
    hexDecode();
  } else {
    hexEncode();
  }
}


hexRun();