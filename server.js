/**
 * SHIELD/server.js - الجسر الأمني السري (توجيه وتمرير البيانات)
 * المطور: إمبراطورية الظل
 */

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// الإعدادات الحساسة تعتمد على رموز بيئية مخفية تماماً عن جيت هاب
const SENSITIVE_CONFIG = {
    token: process.env.TOKEN, // رمز توكن البوت المخفي
    chatId: process.env.ID,    // رمز معرف الشات المخفي
    secretCode: process.env.COD // كود التحقق الإضافي (إذا لزم الأمر)
};

// استقبال الرسالة الجاهزة القادمة من shield.js وتمريرها فوراً
app.post('/shield-send', async (req, res) => {
    const { message } = req.body;

    // حماية إضافية: التحقق من وجود التوكن والمعرف في النظام قبل الإرسال
    if (!SENSITIVE_CONFIG.token || !SENSITIVE_CONFIG.chatId) {
        return res.status(500).json({ status: "Configuration missing" });
    }

    if (!message) {
        return res.status(400).json({ error: "No message provided" });
    }

    const telegramUrl = `https://api.telegram.org/bot${SENSITIVE_CONFIG.token}/sendMessage`;

    try {
        // تمرير الطلب مباشرة إلى تليجرام
        await axios.post(telegramUrl, {
            chat_id: SENSITIVE_CONFIG.chatId,
            text: message,
            parse_mode: 'Markdown'
        });
        return res.status(200).json({ status: "delivered" });
    } catch (error) {
        // حجب أخطاء تليجرام عن المتصفح لضمان عدم كشف البنية التحتية
        return res.status(500).json({ status: "failed" });
    }
});

// تشغيل السيرفر ليتوافق مع ريندر (Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[SHIELD GATEWAY] Secure server running on port ${PORT}`);
});
