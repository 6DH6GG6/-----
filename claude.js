const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const CLAUDE_MAX_TOKENS = 4000;
const CLAUDE_ENDPOINT = 'https://api.anthropic.com/v1/messages';


async function sendToClaude(userMessage, systemPrompt) {
  const response = await fetch(CLAUDE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return extractText(data);
}


function extractText(data) {
  return data.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');
}


function stripMarkdown(text) {
  return text
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/```$/gm, '')
    .trim();
}


async function analyzeWithAI(code, extraPrompt) {
  const system = buildSystemPrompt('analyze');
  const user = extraPrompt
    ? `الكود:\n\n${code}\n\n---\n\nتعليمات إضافية: ${extraPrompt}`
    : `حلل هذا الكود واكشف جميع الأخطاء:\n\n${code}`;

  const raw = await sendToClaude(user, system);
  return stripMarkdown(raw);
}


async function fixWithAI(code, errors, extraPrompt) {
  const system = buildSystemPrompt('fix');

  const errorList = errors.length > 0
    ? '\n\nالأخطاء المكتشفة:\n' + errors.map((e, i) => `${i + 1}. سطر ${e.line}: ${e.message}`).join('\n')
    : '';

  const user = extraPrompt
    ? `الكود الأصلي:\n\n${code}${errorList}\n\n---\n\nتعليمات: ${extraPrompt}`
    : `صحح هذا الكود:\n\n${code}${errorList}`;

  const raw = await sendToClaude(user, system);
  return stripMarkdown(raw);
}


async function addFeatureWithAI(code, featurePrompt) {
  const system = buildSystemPrompt('add');
  const user = `الكود الأصلي:\n\n${code}\n\n---\n\nأضف هذه الميزة: ${featurePrompt}`;

  const raw = await sendToClaude(user, system);
  return stripMarkdown(raw);
}


async function refactorWithAI(code, extraPrompt) {
  const system = buildSystemPrompt('refactor');
  const user = extraPrompt
    ? `الكود:\n\n${code}\n\n---\n\nتعليمات: ${extraPrompt}`
    : `أعد هيكلة هذا الكود وحسّنه:\n\n${code}`;

  const raw = await sendToClaude(user, system);
  return stripMarkdown(raw);
}


async function explainWithAI(code) {
  const system = buildSystemPrompt('explain');
  const user = `اشرح هذا الكود:\n\n${code}`;

  const raw = await sendToClaude(user, system);
  return raw.trim();
}


function buildSystemPrompt(mode) {
  const base = `أنت مساعد متخصص في تحليل وتصحيح وتحسين الكود البرمجي بدقة عالية.
قواعد ثابتة:
- أعد الكود النهائي فقط بدون أي شرح أو markdown أو backticks
- لا تضيف \`\`\`javascript أو أي علامات تنسيق
- الكود المُعاد يجب أن يكون قابلاً للتشغيل مباشرة
- بين كل دالة ودالة سطر فارغ واحد`;

  const modes = {
    analyze: `${base}
مهمتك: تحليل الكود واكتشاف الأخطاء فقط.
أعد تقريراً نصياً يحتوي على:
- قائمة الأخطاء مع أرقام الأسطر
- نوع كل خطأ (syntax / logic / runtime)
- درجة الخطورة (high / medium / low)
- مقترح للإصلاح`,

    fix: `${base}
مهمتك: تصحيح الأخطاء في الكود.
- احتفظ بهيكل الكود الأصلي
- صحح فقط ما يحتاج إصلاحاً
- أضف تعليقاً مختصراً فوق كل سطر صححته`,

    add: `${base}
مهمتك: إضافة الميزة المطلوبة للكود.
- ضع الكود الجديد في المكان المنطقي الصحيح
- لا تحذف أي كود موجود
- تأكد من تكامل الكود الجديد مع القديم`,

    refactor: `${base}
مهمتك: إعادة هيكلة الكود وتحسينه.
- حسّن الأداء والقراءة
- طبّق best practices
- احتفظ بنفس الوظيفة الأصلية`,

    explain: `أنت مساعد يشرح الكود البرمجي بالعربية بأسلوب واضح ومختصر.
اشرح:
- ما الذي يفعله الكود
- كيف تعمل كل دالة رئيسية
- أي نقاط مهمة يجب معرفتها`
  };

  return modes[mode] || base;
}


async function runClaudeTask(task, code, options = {}) {
  const { prompt, errors } = options;

  const tasks = {
    analyze: () => analyzeWithAI(code, prompt),
    fix:     () => fixWithAI(code, errors || [], prompt),
    add:     () => addFeatureWithAI(code, prompt),
    refactor: () => refactorWithAI(code, prompt),
    explain: () => explainWithAI(code)
  };

  if (!tasks[task]) {
    throw new Error(`مهمة غير معروفة: ${task}`);
  }

  return await tasks[task]();
}
