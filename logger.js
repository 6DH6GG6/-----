// logger.js

const Logger = {
  history: [],
  maxHistory: 200,
  level: 'info',

  levels: {
    info:  0,
    ok:    1,
    warn:  2,
    err:   3,
    ai:    4,
    debug: 5
  }
};


function log(msg, type = 'info') {
  if (!msg) return;

  const entry = {
    id:        Logger.history.length + 1,
    time:      new Date(),
    timeStr:   new Date().toLocaleTimeString('en-GB'),
    message:   msg,
    type:      type
  };

  Logger.history.push(entry);

  if (Logger.history.length > Logger.maxHistory) {
    Logger.history.shift();
  }

  renderLog(entry);
  saveToStorage(entry);

  return entry;
}


function renderLog(entry) {
  const area = document.getElementById('logArea');
  if (!area) return;

  const cls = {
    info:  'log-info',
    ok:    'log-ok',
    warn:  'log-warn',
    err:   'log-err',
    ai:    'log-ai',
    debug: 'log-info'
  }[entry.type] || 'log-info';

  const el = document.createElement('div');
  el.className = 'log-entry';
  el.dataset.id = entry.id;
  el.innerHTML = `
    <span class="log-time">${entry.timeStr}</span>
    <span class="${cls}">${entry.message}</span>
  `;

  area.appendChild(el);
  area.scrollTop = area.scrollHeight;
}


function saveToStorage(entry) {
  try {
    const key  = 'shadow_logs';
    const raw  = localStorage.getItem(key);
    const logs = raw ? JSON.parse(raw) : [];

    logs.push({
      id:      entry.id,
      time:    entry.timeStr,
      message: entry.message,
      type:    entry.type
    });

    if (logs.length > 500) logs.splice(0, logs.length - 500);

    localStorage.setItem(key, JSON.stringify(logs));
  } catch {}
}


function logInfo(msg)  { return log(msg, 'info'); }
function logOk(msg)    { return log(msg, 'ok');   }
function logWarn(msg)  { return log(msg, 'warn'); }
function logErr(msg)   { return log(msg, 'err');  }
function logAI(msg)    { return log(msg, 'ai');   }
function logDebug(msg) { return log(msg, 'debug');}


function clearLog() {
  Logger.history = [];
  const area = document.getElementById('logArea');
  if (area) area.innerHTML = '';
  log('تم مسح السجل', 'info');
}


function exportLog() {
  if (Logger.history.length === 0) {
    log('لا يوجد سجل للتصدير', 'warn');
    return;
  }

  const lines = Logger.history.map(e =>
    `[${e.timeStr}] [${e.type.toUpperCase()}] ${e.message}`
  );

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');

  a.href     = url;
  a.download = `shadow_log_${Date.now()}.txt`;
  a.click();

  URL.revokeObjectURL(url);
  log('✓ تم تصدير السجل', 'ok');
}


function getLogHistory(type = null) {
  if (!type) return Logger.history;
  return Logger.history.filter(e => e.type === type);
}


function getLogStats() {
  const stats = { total: Logger.history.length };

  Object.keys(Logger.levels).forEach(type => {
    stats[type] = Logger.history.filter(e => e.type === type).length;
  });

  return stats;
}


function filterLog(type) {
  const area = document.getElementById('logArea');
  if (!area) return;

  const entries = area.querySelectorAll('.log-entry');
  entries.forEach(el => {
    if (!type || type === 'all') {
      el.style.display = '';
    } else {
      const span = el.querySelector('span:last-child');
      const show = span && span.classList.contains(`log-${type}`);
      el.style.display = show ? '' : 'none';
    }
  });
}


function loadStoredLogs() {
  try {
    const raw = localStorage.getItem('shadow_logs');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}


function shadowLog(msg, type = 'info') {
  return log(msg, type);
}