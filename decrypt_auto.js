// decrypt_auto.js

function detectEncoding(input) {
  if (!input) return null;
  const clean = input.replace(/\s+/g, '');

  if (/^[0-9a-fA-F]+$/.test(clean) && clean.length % 2 === 0) {
    return 'hex';
  }

  if (/^[A-Za-z0-9+/]*={0,2}$/.test(clean) && clean.length % 4 === 0) {
    return 'base64';
  }

  if (/^[01\s]+$/.test(clean) && clean.replace(/\s/g, '').length % 8 === 0) {
    return 'binary';
  }

  if (/^(\d{1,3}\s+)+\d{1,3}$/.test(input.trim())) {
    return 'decimal';
  }

  if (/^[A-Za-z]+$/.test(clean) && clean.length > 4) {
    return 'caesar';
  }

  return null;
}


function decryptHex(input) {
  const clean = input.replace(/\s+/g, '');
  let result = '';
  for (let i = 0; i < clean.length; i += 2) {
    result += String.fromCharCode(parseInt(clean.slice(i, i + 2), 16));
  }
  return result;
}


function decryptBase64(input) {
  try {
    return decodeURIComponent(escape(atob(input.replace(/\s+/g, ''))));
  } catch {
    try {
      return atob(input.replace(/\s+/g, ''));
    } catch {
      return null;
    }
  }
}


function decryptBinary(input) {
  const clean = input.replace(/\s+/g, '');
  let result = '';
  for (let i = 0; i < clean.length; i += 8) {
    result += String.fromCharCode(parseInt(clean.slice(i, i + 8), 2));
  }
  return result;
}


function decryptDecimal(input) {
  return input.trim().split(/\s+/).map(n => String.fromCharCode(parseInt(n))).join('');
}


function decryptCaesar(input, shift = 13) {
  return input.replace(/[a-zA-Z]/g, ch => {
    const base = ch >= 'a' ? 97 : 65;
    return String.fromCharCode((ch.charCodeAt(0) - base - shift + 26) % 26 + base);
  });
}


function tryAllDecryptions(input) {
  const results = [];

  try {
    const hex = decryptHex(input);
    if (hex && isPrintable(hex)) results.push({ type: 'Hex', result: hex });
  } catch {}

  try {
    const b64 = decryptBase64(input);
    if (b64 && isPrintable(b64)) results.push({ type: 'Base64', result: b64 });
  } catch {}

  try {
    const bin = decryptBinary(input);
    if (bin && isPrintable(bin)) results.push({ type: 'Binary', result: bin });
  } catch {}

  try {
    const dec = decryptDecimal(input);
    if (dec && isPrintable(dec)) results.push({ type: 'Decimal', result: dec });
  } catch {}

  for (let shift = 1; shift <= 25; shift++) {
    try {
      const caesar = decryptCaesar(input, shift);
      if (caesar && isReadable(caesar)) {
        results.push({ type: `Caesar(${shift})`, result: caesar });
        break;
      }
    } catch {}
  }

  return results;
}


function isPrintable(str) {
  if (!str) return false;
  const printable = str.split('').filter(c => c.charCodeAt(0) >= 32).length;
  return printable / str.length > 0.85;
}


function isReadable(str) {
  if (!str) return false;
  const letters = (str.match(/[a-zA-Z\u0600-\u06FF]/g) || []).length;
  return letters / str.length > 0.6;
}


function decryptAuto() {
  const input = document.getElementById('input').value.trim();
  if (!input) {
    shadowLog('لا يوجد كود لفك التشفير', 'warn');
    return;
  }

  shadowLog('جاري تحليل نوع التشفير...', 'info');

  const detected = detectEncoding(input);

  if (detected) {
    shadowLog(`تم اكتشاف التشفير: ${detected.toUpperCase()}`, 'ai');

    let result = null;

    if (detected === 'hex')     result = decryptHex(input);
    if (detected === 'base64')  result = decryptBase64(input);
    if (detected === 'binary')  result = decryptBinary(input);
    if (detected === 'decimal') result = decryptDecimal(input);
    if (detected === 'caesar')  result = decryptCaesar(input);

    if (result) {
      setResult(result);
      shadowLog(`✓ تم فك التشفير بنجاح (${detected.toUpperCase()})`, 'ok');
      return;
    }
  }

  shadowLog('لم يُكتشف نوع محدد — جاري تجربة الكل...', 'warn');
  const all = tryAllDecryptions(input);

  if (all.length > 0) {
    const best = all[0];
    setResult(best.result);
    shadowLog(`✓ أفضل نتيجة: ${best.type}`, 'ok');
    if (all.length > 1) {
      shadowLog(`نتائج أخرى محتملة: ${all.slice(1).map(r => r.type).join(', ')}`, 'info');
    }
  } else {
    setResult('// تعذّر فك التشفير تلقائياً\n// جرب نوعاً محدداً من قائمة التشفير');
    shadowLog('✗ لم يتم التعرف على نوع التشفير', 'err');
  }
}


decryptAuto();