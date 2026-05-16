/**
 * SHIELD/server.js - الجسر الأمني السري (توجيه وتمرير البيانات)
 * المطور: إمبراطورية الظل
 */

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// وضع البيانات الحساسة بشكل مباشر لتفادي مشاكل الـ Environment Variables
const SENSITIVE_CONFIG = {
    token: "8117644349:AAHvnY5e-Q1yQuGY0J4iOOBl84Sa1rt_NP0", 
    chatId: "7664410054",    
    secretCode: "EMPIRE_SHIELD_2026" 
};

// استقبال الرسالة الجاهزة القادمة من shield.js وتمريرها فوراً
app.post('/shield-send', async (req, res) => {
    const { message } = req.body;

    // التحقق من وجود الإعدادات
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
        // حجب تفاصيل الخطأ عن المتصفح لأمان البنية التحتية
        return res.status(500).json({ status: "failed" });
    }
});

// تشغيل السيرفر ليتوافق مع ريندر (Render) أو أي منصة استضافة
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[SHIELD GATEWAY] Secure server running on port ${PORT}`);
});
