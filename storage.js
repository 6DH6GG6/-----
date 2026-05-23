// storage.js

const Storage = {
  prefix:  'shadow_',
  version: 'v24',
  maxSize: 5 * 1024 * 1024
};


function storageKey(key) {
  return `${Storage.prefix}${Storage.version}_${key}`;
}


function saveCode(code, name = 'main') {
  if (!code) return false;

  try {
    const entry = {
      code,
      name,
      time:    new Date().toISOString(),
      timeStr: new Date().toLocaleString('ar'),
      size:    new Blob([code]).size,
      lines:   code.split('\n').length
    };

    localStorage.setItem(storageKey(`code_${name}`), JSON.stringify(entry));
    shadowLog(`✓ تم حفظ الكود: ${name}`, 'ok');
    return true;
  } catch (e) {
    shadowLog(`✗ فشل الحفظ: ${e.message}`, 'err');
    return false;
  }
}


function loadCode(name = 'main') {
  try {
    const raw = localStorage.getItem(storageKey(`code_${name}`));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}


function deleteCode(name = 'main') {
  try {
    localStorage.removeItem(storageKey(`code_${name}`));
    shadowLog(`تم حذف: ${name}`, 'info');
    return true;
  } catch {
    return false;
  }
}


function saveSession(data) {
  if (!data) return false;

  try {
    const session = {
      ...data,
      time:    new Date().toISOString(),
      timeStr: new Date().toLocaleString('ar')
    };

    localStorage.setItem(storageKey('session'), JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}


function loadSession() {
  try {
    const raw = localStorage.getItem(storageKey('session'));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}


function clearSession() {
  try {
    localStorage.removeItem(storageKey('session'));
    return true;
  } catch {
    return false;
  }
}


function saveHistory(code, action) {
  if (!code) return false;

  try {
    const raw     = localStorage.getItem(storageKey('history'));
    const history = raw ? JSON.parse(raw) : [];

    history.unshift({
      code,
      action,
      time:    new Date().toISOString(),
      timeStr: new Date().toLocaleString('ar'),
      size:    new Blob([code]).size,
      lines:   code.split('\n').length
    });

    if (history.length > 50) history.splice(50);

    localStorage.setItem(storageKey('history'), JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}


function loadHistory() {
  try {
    const raw = localStorage.getItem(storageKey('history'));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}


function clearHistory() {
  try {
    localStorage.removeItem(storageKey('history'));
    shadowLog('تم مسح السجل التاريخي', 'info');
    return true;
  } catch {
    return false;
  }
}


function saveSettings(settings) {
  if (!settings) return false;

  try {
    localStorage.setItem(storageKey('settings'), JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}


function loadSettings() {
  try {
    const raw = localStorage.getItem(storageKey('settings'));
    if (!raw) return getDefaultSettings();
    return { ...getDefaultSettings(), ...JSON.parse(raw) };
  } catch {
    return getDefaultSettings();
  }
}


function getDefaultSettings() {
  return {
    theme:       'dark',
    language:    'JavaScript',
    autoSave:    true,
    maxHistory:  50,
    logLevel:    'info',
    compactMode: false
  };
}


function getAllKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(Storage.prefix)) {
      keys.push(key);
    }
  }
  return keys;
}


function getStorageSize() {
  let total = 0;
  getAllKeys().forEach(key => {
    const val = localStorage.getItem(key);
    if (val) total += new Blob([val]).size;
  });
  return total;
}


function getStorageInfo() {
  const size  = getStorageSize();
  const keys  = getAllKeys();
  const usage = ((size / Storage.maxSize) * 100).toFixed(1);

  return {
    keys:    keys.length,
    size,
    sizeStr: size > 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${size} B`,
    usage:   `${usage}%`,
    max:     Storage.maxSize
  };
}


function clearAll() {
  try {
    getAllKeys().forEach(key => localStorage.removeItem(key));
    shadowLog('✓ تم مسح كل البيانات المحفوظة', 'ok');
    return true;
  } catch {
    shadowLog('✗ فشل المسح', 'err');
    return false;
  }
}


function autoSave() {
  const settings = loadSettings();
  if (!settings.autoSave) return;

  const input = document.getElementById('input')?.value;
  const result = document.getElementById('result')?.textContent;

  if (input)  saveCode(input,  'autosave_input');
  if (result && !result.startsWith('//')) saveCode(result, 'autosave_result');
}


function restoreAutoSave() {
  const input  = loadCode('autosave_input');
  const result = loadCode('autosave_result');

  if (input?.code) {
    const el = document.getElementById('input');
    if (el && !el.value.trim()) {
      el.value = input.code;
      shadowLog(`✓ تم استعادة الكود — ${input.timeStr}`, 'ok');
    }
  }

  if (result?.code) {
    const el = document.getElementById('result');
    if (el) {
      el.textContent = result.code;
    }
  }
}


setInterval(autoSave, 30000);