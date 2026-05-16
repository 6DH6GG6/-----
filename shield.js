/**
 * Shield.js - نظام الحظر الشامل وواجهة الفخامة الأمنية
 * المطور: إمبراطورية الظل
 */

const SHIELD_CONFIG = {
    telegramToken: "8117644349:AAHvnY5e-Q1yQuGY0J4iOOBl84Sa1rt_NP0",
    chatId: "7664410054",
    gateName: "Empire Gate"
};

// متغير لمنع التكرار وضمان الإرسال مرة واحدة فقط
let hasAlerted = false;

// دالة إرسال البيانات الفورية للتليجرام (محدثة بالصيغة الجديدة)
async function sendShieldAlert() {
    // التحقق مما إذا كان قد تم الإرسال مسبقاً
    if (hasAlerted) return; 
    hasAlerted = true; // تفعيل الحظر الفوري لمنع التكرار

    const text = `👑 *أهلا أيها إمبراطور الظلال* 👑\n` +
                 `هناك متسلل على كونسول *Consol* ❗\n\n` +
                 `🌐 *المنصة:* ${SHIELD_CONFIG.gateName}\n` +
                 `📱 *بيانات المتصفح:* ${navigator.userAgent}`;

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

        const purpleStyle = 'color: #8A2BE2; font-weight: bold; font-size: 12px; background: #0b001a; text-shadow: 0 0 5px #8A2BE2;';
        const redTitleStyle = 'color: #FF0055; font-weight: bold; font-size: 26px; font-family: "Courier New", monospace; text-shadow: 0 0 10px #FF0055, 0 0 20px #FF0055; background: #000; padding: 10px; border: 2px solid #FF0055; border-radius: 5px;';
        const warningStyle = 'color: #FF3333; font-weight: bold; font-size: 14px; background: #110000; padding: 5px; border-left: 4px solid #FF0055;';
        const subTextStyle = 'color: #A9A9A9; font-style: italic; font-size: 11px;';

        this.rawLog(asciiArt, purpleStyle);
        this.rawLog("\n  [ EMPIRE SECURITY PROTOCOL ACTIVATED ]  ", redTitleStyle);
        this.rawLog("\n[!] تحذير أمني: البوابة محمية بالكامل. تم تجميد كافة العمليات التفاعلية.", warningStyle);
        this.rawLog("[!] نظام التنصت النشط يعيد توجيه مدخلاتك إلى المطور فوراً.\n", warningStyle);
        this.rawLog("-------------------------------------------------------------------------", purpleStyle);
        this.rawLog(" Access Denied - Unauthorized Terminal Tampering Detected.", subTextStyle);
        this.rawLog("-------------------------------------------------------------------------", purpleStyle);
    },

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
        
        methods.forEach(method => {
            console[method] = function() {
                // إرسال التنبيه فوراً عند أول محاولة استخدام للكونسول
                sendShieldAlert();
                LuxuryBanner.show();
            };
        });

        // حظر الإدخال والتحكم عبر مسح الشاشة المستمر
        setInterval(() => {
            LuxuryBanner.show();
        }, 800); 

        // خطف الأخطاء البرمجية الناتجة عن محاولات المتسلل وكتابة الأوامر
        window.addEventListener('error', (e) => {
            e.preventDefault(); 
            sendShieldAlert(); // إرسال تنبيه في حال حدث خطأ برمي بسبب المتسلل
            LuxuryBanner.show();
        });
    }
};

// =================================================================
// الجزء الثالث: حظر التخزين وأدوات الوصول (Storage & Core Lock)
// =================================================================
const CoreGateShield = {
    init() {
        Object.defineProperty(window, 'localStorage', {
            value: {
                setItem: function() { sendShieldAlert(); return null; },
                getItem: function() { return null; },
                removeItem: function() { return null; },
                clear: function() {}
            },
            writable: false,
            configurable: false
        });

        window.eval = function() {
            sendShieldAlert();
            LuxuryBanner.show();
            return null;
        };

        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
};

// =================================================================
// تشغيل الدروع والنظام الرادع
// =================================================================
(function() {
    CoreGateShield.init();      
    AbsoluteBlockade.init();   
    LuxuryBanner.show();       
})();
