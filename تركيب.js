let currentMode = 'ai';


function setMode(mode) {
  currentMode = mode;
  document.getElementById('tab-ai').classList.toggle('active', mode === 'ai');
  document.getElementById('tab-manual').classList.toggle('active', mode === 'manual');
  document.getElementById('ai-panel').style.display = mode === 'ai' ? 'flex' : 'none';
  document.getElementById('manual-panel').style.display = mode === 'manual' ? 'flex' : 'none';
  document.getElementById('add-panel').style.display = mode === 'manual' ? 'flex' : 'none';
  shadowLog('تم تغيير الوضع إلى: ' + (mode === 'ai' ? 'AI ذكي' : 'يدوي'), 'info');
}


function shadowLog(msg, type = 'info') {
  const area = document.getElementById('logArea');
  if (!area) return;
  const now = new Date().toLocaleTimeString('en-GB');
  const cls = { info: 'log-info', ok: 'log-ok', warn: 'log-warn', err: 'log-err', ai: 'log-ai' }[type] || 'log-info';
  const el = document.createElement('div');
  el.className = 'log-entry';
  el.innerHTML = `<span class="log-time">${now}</span><span class="${cls}">${msg}</span>`;
  area.appendChild(el);
  area.scrollTop = area.scrollHeight;
}


function setResult(code) {
  const pre = document.getElementById('result');
  if (!pre) return;
  pre.textContent = code;
  const lines = code.split('\n').length;
  const lc = document.getElementById('lineCount');
  if (lc) lc.textContent = `${lines} سطر`;
}


function setLoading(on) {
  const btn = document.getElementById('runBtn');
  const icon = document.getElementById('btn-icon');
  const txt = document.getElementById('btn-text');
  if (!btn) return;
  btn.disabled = on;
  if (on) {
    if (icon) icon.innerHTML = '<span class="spinner"></span>';
    if (txt) txt.textContent = 'جاري التحليل...';
  } else {
    if (icon) icon.textContent = '⚜️';
    if (txt) txt.textContent = 'تركيب ومعالجة';
  }
}


async function runProcess() {
  const main = document.getElementById('mainCode').value.trim();
  if (!main) {
    shadowLog('⚠ الرجاء إدخال الكود الأصلي أولاً', 'warn');
    return;
  }
  if (currentMode === 'ai') {
    await runAI(main);
  } else {
    runManual(main);
  }
}


async function runAI(main) {
  const prompt = document.getElementById('aiPrompt').value.trim();
  shadowLog('إرسال الكود إلى Claude AI...', 'ai');
  setLoading(true);

  const systemPrompt = `أنت مساعد متخصص في تحليل وتصحيح وتحسين الكود البرمجي.
مهامك:
1. تحليل الكود وكشف الأخطاء (syntax errors, logic errors, runtime errors)
2. تصحيح الأخطاء بدقة مع الحفاظ على هيكل الكود الأصلي
3. تطبيق أي تعديلات أو إضافات يطلبها المستخدم
4. تحسين الكود (performance, readability, best practices) إذا طلب ذلك
5. إعادة تركيب الدوال بانتظام ودقة
قواعد مهمة:
- أعد الكود النهائي فقط بدون أي شرح أو markdown أو backticks
- لا تضيف \`\`\`javascript أو أي علامات تنسيق
- احتفظ بالتعليقات الأصلية وأضف تعليقات للأجزاء المصححة
- إذا أضفت دالة جديدة، ضعها في المكان المنطقي الصحيح
- الكود المُعاد يجب أن يكون قابلاً للتشغيل مباشرة`;

  const userMsg = prompt
    ? `الكود الأصلي:\n\n${main}\n\n---\n\nالتعليمات: ${prompt}`
    : `حلل هذا الكود وصحح أي أخطاء وحسّنه:\n\n${main}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    let result = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    result = result
      .replace(/^```[\w]*\n?/gm, '')
      .replace(/```$/gm, '')
      .trim();

    result = cleanCode(result);
    setResult(result);
    shadowLog('✓ اكتمل التحليل والتصحيح بنجاح', 'ok');
    shadowLog(`الكود: ${result.split('\n').length} سطر`, 'ok');

  } catch (err) {
    shadowLog(`✗ خطأ: ${err.message}`, 'err');
    setResult('// حدث خطأ أثناء الاتصال بـ Claude AI\n// ' + err.message);
  } finally {
    setLoading(false);
  }
}


function runManual(main) {
  shadowLog('بدء المعالجة اليدوية...', 'info');
  let output = main;

  const add = document.getElementById('addCode').value.trim();
  if (add) {
    output += '\n\n' + add;
    shadowLog('تمت إضافة الكود الجديد', 'ok');
  }

  const edit = document.getElementById('editCode').value.trim();
  if (edit) {
    const lines = edit.split('\n');
    const key = lines[0].trim();
    const newCode = lines.slice(1).join('\n').trim();

    if (key && newCode) {
      let replaced = false;

      const funcRegex = new RegExp(
        `function\\s+${escapeReg(key)}\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\}`,
        'g'
      );
      if (funcRegex.test(output)) {
        output = output.replace(funcRegex, newCode);
        replaced = true;
        shadowLog(`تم تعديل الدالة: ${key}`, 'ok');
      }

      if (!replaced) {
        const arrowRegex = new RegExp(
          `(const|let|var)\\s+${escapeReg(key)}\\s*=\\s*(?:\\([^)]*\\)|\\w+)\\s*=>\\s*[\\s\\S]*?(?=\\n(?:const|let|var|function|class|$))`,
          'g'
        );
        if (arrowRegex.test(output)) {
          output = output.replace(arrowRegex, newCode);
          replaced = true;
          shadowLog(`تم تعديل الدالة السهمية: ${key}`, 'ok');
        }
      }

      if (!replaced) {
        const varRegex = new RegExp(`(let|const|var)\\s+${escapeReg(key)}\\s*=.*`, 'g');
        if (varRegex.test(output)) {
          output = output.replace(varRegex, newCode);
          replaced = true;
          shadowLog(`تم تعديل المتغير: ${key}`, 'ok');
        }
      }

      if (!replaced) {
        output += '\n\n' + newCode;
        shadowLog(`لم يُعثر على "${key}" — تمت الإضافة في النهاية`, 'warn');
      }
    }
  }

  output = cleanCode(output);
  setResult(output);
  shadowLog('✓ اكتملت المعالجة', 'ok');
}


function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function cleanCode(code) {
  return code
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}


function clearAll() {
  ['mainCode', 'aiPrompt', 'editCode', 'addCode'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const result = document.getElementById('result');
  if (result) result.textContent = '// تم مسح كل شيء...';
  const lc = document.getElementById('lineCount');
  if (lc) lc.textContent = '';
  const logArea = document.getElementById('logArea');
  if (logArea) logArea.innerHTML = '';
  shadowLog('تم مسح كل شيء', 'info');
}


function copyAssemblyResult() {
  const text = document.getElementById('result').textContent;
  if (!text || text.startsWith('//')) {
    shadowLog('لا يوجد نتيجة للنسخ', 'warn');
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    shadowLog('✓ تم نسخ النتيجة إلى الحافظة', 'ok');
  }).catch(() => shadowLog('فشل النسخ', 'err'));
}


function formatCode() {
  const main = document.getElementById('mainCode');
  if (!main || !main.value.trim()) {
    shadowLog('لا يوجد كود للتنسيق', 'warn');
    return;
  }
  main.value = cleanCode(main.value);
  shadowLog('تم تنظيف الكود الأصلي', 'ok');
}
