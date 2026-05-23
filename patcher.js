function patchCode(code, errors) {
  if (!code || !code.trim()) return code;
  if (!errors || errors.length === 0) return code;

  let patched = code;

  const highErrors = errors.filter(e => e.severity === 'high');
  const medErrors  = errors.filter(e => e.severity === 'medium');
  const lowErrors  = errors.filter(e => e.severity === 'low');

  patched = applyHighFixes(patched, highErrors);
  patched = applyMediumFixes(patched, medErrors);
  patched = applyLowFixes(patched, lowErrors);
  patched = cleanPatched(patched);

  return patched;
}


function applyHighFixes(code, errors) {
  let result = code;

  errors.forEach(err => {
    if (err.message.includes('<=') && err.message.includes('length')) {
      result = fixLoopBound(result);
    }
    if (err.message.includes('تعيين داخل شرط')) {
      result = fixAssignmentInCondition(result);
    }
    if (err.message.includes('غير معرّفة')) {
      result = fixUndefinedUsage(result, err);
    }
  });

  return result;
}


function applyMediumFixes(code, errors) {
  let result = code;

  errors.forEach(err => {
    if (err.message.includes('لا تُرجع قيمة')) {
      result = fixMissingReturn(result);
    }
    if (err.message.includes('.length')) {
      result = fixLengthArithmetic(result);
    }
  });

  return result;
}


function applyLowFixes(code, errors) {
  let result = code;

  errors.forEach(err => {
    if (err.message.includes('==')) {
      result = fixLooseEquality(result);
    }
    if (err.message.includes('!=')) {
      result = fixLooseInequality(result);
    }
  });

  return result;
}


function fixLoopBound(code) {
  return code.replace(
    /(for\s*\(\s*(?:let|var|const)\s+\w+\s*=\s*\d+\s*;\s*\w+\s*)<=(\s*\w+\.length\s*;)/g,
    '$1<$2'
  );
}


function fixAssignmentInCondition(code) {
  return code.replace(
    /if\s*\(\s*(\w+)\s*=(?!=)\s*(\w+)\s*\)/g,
    'if ($1 === $2)'
  );
}


function fixLooseEquality(code) {
  return code.replace(
    /([^=!<>])==(?!=)/g,
    '$1==='
  );
}


function fixLooseInequality(code) {
  return code.replace(
    /([^!])!=(?!=)/g,
    '$1!=='
  );
}


function fixMissingReturn(code) {
  return code.replace(
    /(function\s+\w+\s*\([^)]*\)\s*\{)([\s\S]*?)(\})/g,
    (match, open, body, close) => {
      const hasReturn = /return\s+/.test(body);
      if (!hasReturn) {
        return open + body + '  return null;\n' + close;
      }
      return match;
    }
  );
}


function fixLengthArithmetic(code) {
  return code.replace(
    /(\w+)\.length\s*-\s*(\d+)/g,
    (match, arr, num) => {
      return `Math.max(0, ${arr}.length - ${num})`;
    }
  );
}


function fixUndefinedUsage(code, err) {
  if (!err.snippet) return code;
  const name = err.snippet.replace(/\(.*/, '').trim();
  const alreadyDeclared = new RegExp(`(?:let|const|var|function)\\s+${name}`).test(code);
  if (alreadyDeclared) return code;
  return `let ${name};\n\n` + code;
}


function applyStyleFixes(code) {
  let result = code;

  result = result.replace(/\bvar\s+/g, 'let ');
  result = removeConsoleLogs(result);
  result = normalizeSpacing(result);

  return result;
}


function removeConsoleLogs(code) {
  return code.replace(/\s*console\.log\([^)]*\);?\n?/g, '\n');
}


function normalizeSpacing(code) {
  return code
    .replace(/\{(?!\n)/g, '{\n')
    .replace(/(?<!\n)\}/g, '\n}')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}


function cleanPatched(code) {
  return code
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}


function patchAndReport(code, analysisResult) {
  const { errors, warnings, score } = analysisResult;

  if (errors.length === 0 && warnings.length === 0) {
    return {
      patched: code,
      changed: false,
      fixedCount: 0,
      report: 'الكود سليم، لا توجد إصلاحات مطلوبة'
    };
  }

  const patched = patchCode(code, errors);
  const changed = patched !== code;
  const fixedCount = errors.filter(e => e.severity === 'high' || e.severity === 'medium').length;

  const reportLines = [];
  reportLines.push(`تم إصلاح ${fixedCount} خطأ من أصل ${errors.length}`);
  reportLines.push(`النقطة قبل: ${score}/100`);
  reportLines.push('');

  if (fixedCount > 0) {
    reportLines.push('الإصلاحات المطبّقة:');
    errors.forEach((e, i) => {
      if (e.severity === 'high' || e.severity === 'medium') {
        reportLines.push(`  ${i + 1}. سطر ${e.line} — ${e.message}`);
      }
    });
  }

  return {
    patched,
    changed,
    fixedCount,
    report: reportLines.join('\n')
  };
}