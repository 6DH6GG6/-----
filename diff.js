// diff.js

const DiffType = {
  ADDED:   'added',
  REMOVED: 'removed',
  CHANGED: 'changed',
  EQUAL:   'equal'
};


function diffLines(before, after) {
  if (!before && !after) return [];
  if (!before) return after.split('\n').map(line => ({ type: DiffType.ADDED,   line }));
  if (!after)  return before.split('\n').map(line => ({ type: DiffType.REMOVED, line }));

  const beforeLines = before.split('\n');
  const afterLines  = after.split('\n');
  const result      = [];

  const matrix = buildMatrix(beforeLines, afterLines);
  const diff   = traceback(matrix, beforeLines, afterLines);

  return diff;
}


function buildMatrix(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  return matrix;
}


function traceback(matrix, a, b) {
  const result = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: DiffType.EQUAL,   line: a[i - 1], lineNum: i });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      result.unshift({ type: DiffType.ADDED,   line: b[j - 1], lineNum: j });
      j--;
    } else {
      result.unshift({ type: DiffType.REMOVED, line: a[i - 1], lineNum: i });
      i--;
    }
  }

  return result;
}


function getDiffStats(diff) {
  const stats = {
    added:    0,
    removed:  0,
    equal:    0,
    changed:  0,
    total:    diff.length
  };

  diff.forEach(d => {
    if (d.type === DiffType.ADDED)   stats.added++;
    if (d.type === DiffType.REMOVED) stats.removed++;
    if (d.type === DiffType.EQUAL)   stats.equal++;
    if (d.type === DiffType.CHANGED) stats.changed++;
  });

  stats.similarity = stats.total > 0
    ? ((stats.equal / stats.total) * 100).toFixed(1)
    : '0.0';

  return stats;
}


function renderDiff(diff, containerId = 'diffView') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  diff.forEach((d, index) => {
    const line = document.createElement('div');
    line.className = `diff-line diff-${d.type}`;
    line.dataset.index = index;

    const prefix = {
      [DiffType.ADDED]:   '+',
      [DiffType.REMOVED]: '-',
      [DiffType.EQUAL]:   ' ',
      [DiffType.CHANGED]: '~'
    }[d.type] || ' ';

    const colors = {
      [DiffType.ADDED]:   '#003300',
      [DiffType.REMOVED]: '#330000',
      [DiffType.EQUAL]:   'transparent',
      [DiffType.CHANGED]: '#332200'
    };

    const textColors = {
      [DiffType.ADDED]:   '#00ff41',
      [DiffType.REMOVED]: '#ff4444',
      [DiffType.EQUAL]:   '#5a8a5a',
      [DiffType.CHANGED]: '#ffaa00'
    };

    line.style.cssText = `
      background: ${colors[d.type]};
      color: ${textColors[d.type]};
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      padding: 2px 8px;
      white-space: pre;
      display: flex;
      gap: 12px;
    `;

    const prefixEl = document.createElement('span');
    prefixEl.style.opacity = '0.6';
    prefixEl.textContent   = prefix;

    const numEl = document.createElement('span');
    numEl.style.cssText  = 'color:#2a1a0a;min-width:32px;text-align:right';
    numEl.textContent    = d.lineNum || '';

    const codeEl = document.createElement('span');
    codeEl.textContent = d.line || '';

    line.appendChild(prefixEl);
    line.appendChild(numEl);
    line.appendChild(codeEl);
    container.appendChild(line);
  });
}


function diffToText(diff) {
  return diff.map(d => {
    const prefix = {
      [DiffType.ADDED]:   '+ ',
      [DiffType.REMOVED]: '- ',
      [DiffType.EQUAL]:   '  ',
      [DiffType.CHANGED]: '~ '
    }[d.type] || '  ';
    return prefix + d.line;
  }).join('\n');
}


function compareCodes(before, after) {
  if (!before && !after) return null;

  const diff  = diffLines(before, after);
  const stats = getDiffStats(diff);
  const text  = diffToText(diff);

  return { diff, stats, text };
}


function showDiff() {
  const before = document.getElementById('input')?.value.trim();
  const after  = document.getElementById('result')?.textContent.trim();

  if (!before || !after) {
    shadowLog('يجب وجود كود في المدخلات والمخرجات للمقارنة', 'warn');
    return;
  }

  if (before === after) {
    shadowLog('الكودان متطابقان — لا يوجد فرق', 'info');
    return;
  }

  const { diff, stats, text } = compareCodes(before, after);

  setResult(text);

  shadowLog(`✓ المقارنة: +${stats.added} سطر مضاف، -${stats.removed} سطر محذوف`, 'ok');
  shadowLog(`التشابه: ${stats.similarity}%`, 'info');
}


function highlightChanges(before, after) {
  const beforeLines = before.split('\n');
  const afterLines  = after.split('\n');
  const changes     = [];

  const maxLen = Math.max(beforeLines.length, afterLines.length);

  for (let i = 0; i < maxLen; i++) {
    const bLine = beforeLines[i] || null;
    const aLine = afterLines[i]  || null;

    if (bLine === null) {
      changes.push({ lineNum: i + 1, type: DiffType.ADDED,   before: null,  after: aLine });
    } else if (aLine === null) {
      changes.push({ lineNum: i + 1, type: DiffType.REMOVED, before: bLine, after: null  });
    } else if (bLine !== aLine) {
      changes.push({ lineNum: i + 1, type: DiffType.CHANGED, before: bLine, after: aLine });
    }
  }

  return changes;
}


function exportDiff(before, after, filename = 'shadow_diff') {
  const { text, stats } = compareCodes(before, after);

  const header = [
    '=== Shadow Engine — Diff Report ===',
    `التاريخ: ${new Date().toLocaleString('ar')}`,
    `مضاف: ${stats.added} | محذوف: ${stats.removed} | تشابه: ${stats.similarity}%`,
    '='.repeat(40),
    ''
  ].join('\n');

  const blob = new Blob([header + text], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');

  a.href     = url;
  a.download = `${filename}_${Date.now()}.txt`;
  a.click();

  URL.revokeObjectURL(url);
  shadowLog('✓ تم تصدير تقرير المقارنة', 'ok');
}