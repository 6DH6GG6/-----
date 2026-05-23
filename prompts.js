const PROMPTS = {

  analyze: (code) => ({
    system: `أنت محلل كود متخصص. مهمتك اكتشاف الأخطاء فقط.
أعد تقريراً نصياً يحتوي على:
- قائمة الأخطاء مع أرقام الأسطر
- نوع كل خطأ (syntax / logic / runtime)
- درجة الخطورة (high / medium / low)
- مقترح للإصلاح
لا تعيد الكود، فقط التقرير.`,
    user: `حلل هذا الكود واكتشف جميع الأخطاء:\n\n${code}`
  }),

  fix: (code, errors = []) => ({
    system: `أنت مصحح كود متخصص.
قواعد ثابتة:
- أعد الكود النهائي فقط بدون شرح أو markdown
- لا تضيف backticks أو علامات تنسيق
- احتفظ بهيكل الكود الأصلي
- أضف تعليقاً مختصراً فوق كل سطر صححته
- الكود يجب أن يكون قابلاً للتشغيل مباشرة`,
    user: errors.length > 0
      ? `الكود الأصلي:\n\n${code}\n\nالأخطاء المكتشفة:\n${errors.map((e,i) => `${i+1}. سطر ${e.line}: ${e.message}`).join('\n')}\n\nصحح الكود.`
      : `صحح هذا الكود:\n\n${code}`
  }),

  add: (code, feature) => ({
    system: `أنت مطور متخصص في إضافة ميزات للكود.
قواعد ثابتة:
- أعد الكود النهائي فقط بدون شرح أو markdown
- لا تحذف أي كود موجود
- ضع الكود الجديد في المكان المنطقي الصحيح
- تأكد من تكامل الكود الجديد مع القديم`,
    user: `الكود الأصلي:\n\n${code}\n\n---\n\nأضف هذه الميزة: ${feature}`
  }),

  refactor: (code, instructions = '') => ({
    system: `أنت متخصص في إعادة هيكلة الكود.
قواعد ثابتة:
- أعد الكود النهائي فقط بدون شرح أو markdown
- حسّن الأداء والقراءة
- طبّق best practices
- احتفظ بنفس الوظيفة الأصلية`,
    user: instructions
      ? `الكود:\n\n${code}\n\n---\n\nتعليمات: ${instructions}`
      : `أعد هيكلة هذا الكود وحسّنه:\n\n${code}`
  }),

  explain: (code) => ({
    system: `أنت مساعد يشرح الكود البرمجي بالعربية بأسلوب واضح ومختصر.
اشرح:
- ما الذي يفعله الكود
- كيف تعمل كل دالة رئيسية
- أي نقاط مهمة يجب معرفتها`,
    user: `اشرح هذا الكود:\n\n${code}`
  }),

  generate: (description, language = 'JavaScript') => ({
    system: `أنت مطور متخصص في توليد كود نظيف واحترافي.
قواعد ثابتة:
- أعد الكود فقط بدون شرح أو markdown
- الكود يجب أن يكون قابلاً للتشغيل مباشرة
- أضف تعليقات مختصرة للأجزاء المهمة
- اتبع best practices للغة المطلوبة`,
    user: `اكتب كود ${language} يقوم بـ: ${description}`
  }),

  custom: (code, instruction) => ({
    system: `أنت مساعد برمجي متخصص.
قواعد ثابتة:
- أعد الكود النهائي فقط بدون شرح أو markdown
- لا تضيف backticks أو علامات تنسيق
- الكود يجب أن يكون قابلاً للتشغيل مباشرة`,
    user: `الكود:\n\n${code}\n\n---\n\nالتعليمات: ${instruction}`
  })

};


function getPrompt(type, ...args) {
  const builder = PROMPTS[type];
  if (!builder) throw new Error(`prompt غير معروف: ${type}`);
  return builder(...args);
}


function buildMessages(promptObj, history = []) {
  return {
    system: promptObj.system,
    messages: [
      ...history,
      { role: 'user', content: promptObj.user }
    ]
  };
}