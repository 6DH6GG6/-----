// generate.js

async function generateCode(description, options = {}) {
  if (!description) return '';

  const {
    language   = 'JavaScript',
    style      = 'clean',
    withErrors = false,
    comments   = true
  } = options;

  const systemPrompt = buildGeneratePrompt(language, style, comments);
  const userMessage  = buildGenerateMessage(description, language, withErrors);

  shadowLog(`جاري توليد كود ${language}...`, 'ai');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userMessage }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const data   = await response.json();
  const raw    = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
  const result = stripGenerated(raw);

  return result;
}


function buildGeneratePrompt(language, style, comments) {
  const styles = {
    clean: 'كود نظيف واحترافي مع أسماء متغيرات واضحة',
    compact: 'كود مضغوط وقصير قدر الإمكان',
    full: 'كود مفصل مع شرح كامل وتوثيق',
    functional: 'كود وظيفي يعتمد على functions و pure functions',
    oop: 'كود يعتمد على OOP و classes'
  };

  return `أنت مطور متخصص في كتابة كود ${language} احترافي.
أسلوب الكود: ${styles[style] || styles.clean}
${comments ? 'أضف تعليقات مختصرة للأجزاء المهمة.' : 'لا تضيف أي تعليقات.'}
قواعد ثابتة:
- أعد الكود فقط بدون شرح أو markdown أو backticks
- لا تضيف \`\`\`${language.toLowerCase()} أو أي علامات تنسيق
- الكود يجب أن يكون قابلاً للتشغيل مباشرة
- اتبع best practices للغة ${language}
- بين كل دالة ودالة سطر فارغ واحد`;
}


function buildGenerateMessage(description, language, withErrors) {
  let msg = `اكتب كود ${language} يقوم بـ:\n${description}`;
  if (withErrors) {
    msg += '\n\nملاحظة: أضف بعض الأخطاء المتعمدة لأغراض الاختبار.';
  }
  return msg;
}


function stripGenerated(text) {
  if (!text) return '';
  return text
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/```$/gm, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}


function getInputDescription() {
  const input = document.getElementById('input').value.trim();
  const prompt = document.getElementById('aiPrompt')?.value.trim();
  return prompt || input;
}


function detectLanguage(description) {
  const desc = description.toLowerCase();

  if (desc.includes('python') || desc.includes('بايثون'))   return 'Python';
  if (desc.includes('java') && !desc.includes('javascript')) return 'Java';
  if (desc.includes('typescript') || desc.includes('ts'))    return 'TypeScript';
  if (desc.includes('css') || desc.includes('style'))        return 'CSS';
  if (desc.includes('html') || desc.includes('صفحة'))        return 'HTML';
  if (desc.includes('sql') || desc.includes('قاعدة بيانات')) return 'SQL';
  if (desc.includes('php'))                                   return 'PHP';
  if (desc.includes('swift') || desc.includes('ios'))        return 'Swift';
  if (desc.includes('kotlin') || desc.includes('android'))   return 'Kotlin';
  if (desc.includes('rust'))                                  return 'Rust';
  if (desc.includes('go') || desc.includes('golang'))        return 'Go';
  if (desc.includes('c++') || desc.includes('cpp'))          return 'C++';
  if (desc.includes('c#') || desc.includes('csharp'))        return 'C#';

  return 'JavaScript';
}


function detectStyle(description) {
  const desc = description.toLowerCase();

  if (desc.includes('مضغوط') || desc.includes('قصير'))   return 'compact';
  if (desc.includes('مفصل') || desc.includes('موثق'))    return 'full';
  if (desc.includes('class') || desc.includes('oop'))     return 'oop';
  if (desc.includes('functional') || desc.includes('وظيفي')) return 'functional';

  return 'clean';
}


async function generateRun() {
  const description = getInputDescription();

  if (!description) {
    shadowLog('أدخل وصفاً للكود المطلوب في حقل المدخلات', 'warn');
    return;
  }

  const language = detectLanguage(description);
  const style    = detectStyle(description);

  shadowLog(`اللغة المكتشفة: ${language} — الأسلوب: ${style}`, 'info');

  try {
    setLoading(true);

    const code = await generateCode(description, {
      language,
      style,
      comments: true,
      withErrors: false
    });

    if (!code) {
      shadowLog('✗ لم يتم توليد أي كود', 'err');
      return;
    }

    setResult(code);

    const lines = code.split('\n').length;
    shadowLog(`✓ تم توليد ${lines} سطر من كود ${language}`, 'ok');

  } catch (err) {
    shadowLog(`✗ خطأ في التوليد: ${err.message}`, 'err');
    setResult(`// حدث خطأ أثناء التوليد\n// ${err.message}`);
  } finally {
    setLoading(false);
  }
}


generateRun();