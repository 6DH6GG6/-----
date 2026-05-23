const ErrorTypes = {
  SYNTAX: 'syntax',
  LOGIC: 'logic',
  RUNTIME: 'runtime',
  STYLE: 'style'
};


const ErrorSeverity = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};


function analyzeCode(code) {
  if (!code || !code.trim()) {
    return { errors: [], warnings: [], score: 100 };
  }

  const errors = [];
  const warnings = [];

  const syntaxErrors = checkSyntax(code);
  const logicErrors = checkLogic(code);
  const styleWarnings = checkStyle(code);

  errors.push(...syntaxErrors, ...logicErrors);
  warnings.push(...styleWarnings);

  const score = calcScore(errors, warnings);

  return { errors, warnings, score };
}


function checkSyntax(code) {
  const found = [];

  const checks = [
    {
      pattern: /for\s*\(.*;\s*\w+\s*<=\s*\w+\.length\s*;/g,
      message: 'حلقة تتجاوز حدود المصفوفة — استخدم < بدل <=',
      type: ErrorTypes.SYNTAX,
      severity: ErrorSeverity.HIGH
    },
    {
      pattern: /if\s*\([^=!<>]*=[^=][^)]*\)/g,
      message: 'تعيين داخل شرط if — ربما قصدت == أو ===',
      type: ErrorTypes.SYNTAX,
      severity: ErrorSeverity.HIGH
    },
    {
      pattern: /\)\s*\{[\s\S]*?^\}/gm,
      message: null
    }
  ];

  checks.forEach(check => {
    if (!check.message) return;
    let match;
    const regex = new RegExp(check.pattern.source, check.pattern.flags);
    while ((match = regex.exec(code)) !== null) {
      const line = getLineNumber(code, match.index);
      found.push({
        type: check.type,
        severity: check.severity,
        message: check.message,
        line,
        snippet: match[0].trim().slice(0, 60)
      });
    }
  });

  found.push(...checkBrackets(code));
  found.push(...checkStrings(code));

  return found;
}


function checkBrackets(code) {
  const errors = [];
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  const lines = code.split('\n');
  let inString = false;
  let stringChar = '';

  lines.forEach((line, lineIdx) => {
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      if (inString) {
        if (ch === stringChar && line[i - 1] !== '\\') inString = false;
        continue;
      }

      if (ch === '"' || ch === "'" || ch === '`') {
        inString = true;
        stringChar = ch;
        continue;
      }

      if ('({['.includes(ch)) {
        stack.push({ ch, line: lineIdx + 1 });
      } else if (')]}'.includes(ch)) {
        if (!stack.length || stack[stack.length - 1].ch !== pairs[ch]) {
          errors.push({
            type: ErrorTypes.SYNTAX,
            severity: ErrorSeverity.HIGH,
            message: `إغلاق غير متطابق "${ch}"`,
            line: lineIdx + 1,
            snippet: line.trim().slice(0, 60)
          });
        } else {
          stack.pop();
        }
      }
    }
  });

  stack.forEach(item => {
    errors.push({
      type: ErrorTypes.SYNTAX,
      severity: ErrorSeverity.HIGH,
      message: `قوس "${item.ch}" لم يُغلق`,
      line: item.line,
      snippet: ''
    });
  });

  return errors;
}


function checkStrings(code) {
  const errors = [];
  const lines = code.split('\n');

  lines.forEach((line, idx) => {
    const stripped = line.replace(/`[^`]*`/g, '').replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '');
    const singles = (stripped.match(/'/g) || []).length;
    const doubles = (stripped.match(/"/g) || []).length;

    if (singles % 2 !== 0 || doubles % 2 !== 0) {
      errors.push({
        type: ErrorTypes.SYNTAX,
        severity: ErrorSeverity.HIGH,
        message: 'سلسلة نصية غير مغلقة',
        line: idx + 1,
        snippet: line.trim().slice(0, 60)
      });
    }
  });

  return errors;
}


function checkLogic(code) {
  const found = [];

  const checks = [
    {
      pattern: /function\s+\w+\s*\([^)]*\)\s*\{[^}]*if\s*\([^)]+\)\s*\{[^}]*return[^}]*\}(?!\s*else)(?!\s*return)/g,
      message: 'دالة قد لا تُرجع قيمة في بعض المسارات',
      type: ErrorTypes.LOGIC,
      severity: ErrorSeverity.MEDIUM
    },
    {
      pattern: /\w+\s*=\s*\w+\s*\+\+|--\s*\w+\s*(?:;|\))/g,
      message: 'استخدام ++ أو -- قد يسبب نتائج غير متوقعة',
      type: ErrorTypes.LOGIC,
      severity: ErrorSeverity.LOW
    },
    {
      pattern: /==(?!=)/g,
      message: 'استخدم === بدل == لمقارنة دقيقة',
      type: ErrorTypes.LOGIC,
      severity: ErrorSeverity.LOW
    },
    {
      pattern: /!=(?!=)/g,
      message: 'استخدم !== بدل != لمقارنة دقيقة',
      type: ErrorTypes.LOGIC,
      severity: ErrorSeverity.LOW
    },
    {
      pattern: /\.length\s*[-+*/]\s*\d+\s*(?:;|\))/g,
      message: 'حساب على .length قد يخرج عن حدود المصفوفة',
      type: ErrorTypes.LOGIC,
      severity: ErrorSeverity.MEDIUM
    }
  ];

  checks.forEach(check => {
    let match;
    const regex = new RegExp(check.pattern.source, check.pattern.flags);
    while ((match = regex.exec(code)) !== null) {
      const line = getLineNumber(code, match.index);
      found.push({
        type: check.type,
        severity: check.severity,
        message: check.message,
        line,
        snippet: match[0].trim().slice(0, 60)
      });
    }
  });

  found.push(...checkUndefinedUsage(code));

  return found;
}


function checkUndefinedUsage(code) {
  const errors = [];
  const declared = new Set();
  const declPattern = /(?:let|const|var)\s+(\w+)/g;
  const funcPattern = /function\s+(\w+)/g;

  let match;
  while ((match = declPattern.exec(code)) !== null) declared.add(match[1]);
  while ((match = funcPattern.exec(code)) !== null) declared.add(match[1]);

  const usagePattern = /\b(\w+)\s*\(/g;
  const builtins = new Set([
    'console', 'log', 'setTimeout', 'setInterval', 'clearTimeout',
    'clearInterval', 'fetch', 'JSON', 'Math', 'Object', 'Array',
    'String', 'Number', 'Boolean', 'Promise', 'parseInt', 'parseFloat',
    'isNaN', 'isFinite', 'encodeURI', 'decodeURI', 'alert', 'confirm',
    'document', 'window', 'navigator', 'localStorage', 'sessionStorage'
  ]);

  while ((match = usagePattern.exec(code)) !== null) {
    const name = match[1];
    if (!declared.has(name) && !builtins.has(name) && name.length > 2) {
      const line = getLineNumber(code, match.index);
      errors.push({
        type: ErrorTypes.RUNTIME,
        severity: ErrorSeverity.HIGH,
        message: `"${name}" قد تكون غير معرّفة`,
        line,
        snippet: match[0].trim()
      });
    }
  }

  return errors;
}


function checkStyle(code) {
  const warnings = [];

  const checks = [
    {
      pattern: /var\s+/g,
      message: 'استخدم let أو const بدل var'
    },
    {
      pattern: /console\.log\(/g,
      message: 'تأكد من حذف console.log قبل النشر'
    },
    {
      pattern: /function\s+\w+\s*\([^)]{60,}\)/g,
      message: 'دالة بمعاملات كثيرة — فكر في تمرير object بدلاً منها'
    },
    {
      pattern: /^\s{0}(?:let|const|var|function)/gm,
      message: null
    }
  ];

  checks.forEach(check => {
    if (!check.message) return;
    let match;
    const regex = new RegExp(check.pattern.source, check.pattern.flags);
    while ((match = regex.exec(code)) !== null) {
      const line = getLineNumber(code, match.index);
      warnings.push({
        message: check.message,
        line,
        snippet: match[0].trim().slice(0, 60)
      });
    }
  });

  return warnings;
}


function calcScore(errors, warnings) {
  let score = 100;
  errors.forEach(e => {
    if (e.severity === ErrorSeverity.HIGH)   score -= 15;
    if (e.severity === ErrorSeverity.MEDIUM) score -= 8;
    if (e.severity === ErrorSeverity.LOW)    score -= 3;
  });
  warnings.forEach(() => score -= 1);
  return Math.max(0, score);
}


function getLineNumber(code, index) {
  return code.slice(0, index).split('\n').length;
}


function formatReport(result) {
  const { errors, warnings, score } = result;
  const lines = [];

  lines.push(`النتيجة: ${score}/100`);
  lines.push('');

  if (errors.length === 0 && warnings.length === 0) {
    lines.push('لا توجد أخطاء مكتشفة');
    return lines.join('\n');
  }

  if (errors.length > 0) {
    lines.push(`أخطاء (${errors.length}):`);
    errors.forEach((e, i) => {
      lines.push(`  ${i + 1}. [${e.severity.toUpperCase()}] سطر ${e.line} — ${e.message}`);
      if (e.snippet) lines.push(`     > ${e.snippet}`);
    });
    lines.push('');
  }

  if (warnings.length > 0) {
    lines.push(`تحذيرات (${warnings.length}):`);
    warnings.forEach((w, i) => {
      lines.push(`  ${i + 1}. سطر ${w.line} — ${w.message}`);
      if (w.snippet) lines.push(`     > ${w.snippet}`);
    });
  }

  return lines.join('\n');
}
