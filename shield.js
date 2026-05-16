/**
 * Shield.js - نظام الحظر، الاعتراض، وصياغة الرسائل
 * المطور: إمبراطورية الظل
 */

(function () {
  "use strict";

  // متغيرات داخلية للتحكم في الإرسال (مرة واحدة فقط لكل حدث)
  let observeAlertSent = false;
  let tamperAlertSent = false;

  // هيكلية المسارات الافتراضية للحمايات الإضافية داخل الكود الأمامي
  const SHIELD = {
    "core.js": function() {
      // حظر القائمة اليمنى، التحديد، والنسخ
      document.addEventListener("contextmenu", e => e.preventDefault());
      document.addEventListener("selectstart", e => e.preventDefault());
      document.addEventListener("copy", e => e.preventDefault());
    },

    "storage_lock.js": function() {
      // حظر قاطع واعتراض محاولات الوصول إلى empire_access
      const originalGetItem = localStorage.getItem;
      const originalSetItem = localStorage.setItem;

      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: function(key, value) {
            if (key === "empire_access") {
              SHIELD["network.js"].sendAlert(`⚠️ *[تنبيه اختراق وتلاعب]* ⚠️\n\n👤 *الحدث:* محاولة تعديل أو حقن المفتاح المحمي \`empire_access\`\n📂 *عبر المكون:* SHIELD/storage_lock.js\n🚫 تم إيقاف العملية بنجاح.`, "tamper");
              return null;
            }
            return originalSetItem.apply(localStorage, arguments);
          },
          getItem: function(key) {
            if (key === "empire_access") {
              SHIELD["network.js"].sendAlert(`⚠️ *[تنبيه اختراق وتلاعب]* ⚠️\n\n👤 *الحدث:* محاولة قراءة واستدعاء المفتاح المحمي \`empire_access\`\n📂 *عبر المكون:* SHIELD/storage_lock.js\n🚫 تم حجب القيمة وإرجاع فارغ.`, "tamper");
              return null;
            }
            return originalGetItem.apply(localStorage, arguments);
          },
          removeItem: function() { return null; },
          clear: function() {}
        },
        writable: false,
        configurable: false
      });
    },

    "dev_detect.js": function() {
      // اعتراض واكتشاف زيارة أو مراقبة الكونسول بمجرد الفتح (بدون تفاعل)
      const detector = /./;
      detector.toString = function() {
        if (!observeAlertSent) {
          const msg = `.............................................\n` +
                      `👑 *أيها الإمبراطور لظلال* 👑\n` +
                      `هناك متسلل يراقب 👀❗\n\n` +
                      `*نوع جهة التسلل:* Console ⛩️\n` +
                      `*الملف المستدعى:* SHIELD/dev_detect.js\n` +
                      `.............................................`;
          SHIELD["network.js"].sendAlert(msg, "observe");
        }
        return "SHIELD_ACTIVE";
      };
      console.log(detector);

      // كشف فتح الأدوات عبر أبعاد الشاشة
      function detectByDimensions() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;

        if (widthThreshold || heightThreshold) {
          document.body.innerHTML = `<div style="position:fixed;inset:0;background:#000;color:red;display:flex;align-items:center;justify-content:center;font-size:30px;z-index:999999;font-family:sans-serif;">ACCESS DENIED</div>`;
          while (true) { debugger; }
        }
      }
      setInterval(detectByDimensions, 1000);
    },

    "hotkeys.js": function() {
      document.addEventListener("keydown", function (e) {
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
          (e.ctrlKey && e.key === "u")
        ) {
          e.preventDefault();
        }
      });
    },

    "network.js": {
      // تم تعديل المسار هنا ليكون مساراً مباشراً بدون مجلدات ليطابق الـ Server الرئيسي
      sendAlert(formattedMessage, type) {
        if (type === "observe" && observeAlertSent) return;
        if (type === "tamper" && tamperAlertSent) return;

        if (type === "observe") observeAlertSent = true;
        if (type === "tamper") tamperAlertSent = true;

        // الإرسال المباشر إلى جذر السيرفر المرفوع
        fetch("/shield-send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: formattedMessage })
        }).catch(() => {});
      }
    },

    "obfuscation.js": function() {
      // إغراق الكونسول وتنظيفه لحجب الرؤية عن المتسلل
      setInterval(() => {
        console.error("Uncaught TypeError: Cannot read properties of undefined");
        console.warn("Error with Permissions-Policy header");
      }, 3000);

      setInterval(() => {
        console.clear();

        // أنماط التصميم للألوان المختلفة بدقة عالية وتأثيرات الظل (Text Shadow)
        const redStyle = "color: #FF0055; font-size: 18px; font-weight: bold; text-shadow: 0 0 8px #FF0055; background: #000; padding: 4px; border-left: 5px solid #FF0055;";
        const purpleStyle = "color: #8A2BE2; font-size: 18px; font-weight: bold; text-shadow: 0 0 8px #8A2BE2; background: #0b001a; padding: 4px; border-left: 5px solid #8A2BE2;";
        const goldStyle = "color: #FFD700; font-size: 16px; font-weight: bold; text-shadow: 0 0 6px #FFD700; background: #1a1500; padding: 4px;";
        const blueStyle = "color: #00FFFF; font-size: 16px; font-weight: bold; text-shadow: 0 0 6px #00FFFF; background: #00111a; padding: 4px;";
        const greenStyle = "color: #39FF14; font-size: 15px; font-weight: bold; text-shadow: 0 0 6px #39FF14; background: #001a00; padding: 4px;";

        // طباعة النصوص الخمسة المتتالية بالتأثيرات البصرية المرتبة
        console.log("%c[!] لا تحاول بمجرد دخولك تم سحب معلوماتك", redStyle);
        console.log("%c*👑الامبراطور الظل👑 يضع قيودًا للدخلاء 🔥*", purpleStyle);
        console.log("%c[📜] تم رصد معلوماتك ووضعها في قائمة مفصلة وتم ارسالها عبر تيليغرام لبوت الامبراطور", goldStyle);
        console.log("%c[💀] لا تحاول اركاب اي خطأ او تقليد الامبراطور ظل فا محاولاتك بلا جدوى 🔥", blueStyle);
        console.log("%c[🛡️] هنا منصة درع طائفة الظلام لا يمكن لأي ذبابة أن تعبر", greenStyle);
        
        // نص إضافي كقاعدة تفاعلية لتنبيه المهاجم
        console.log("%c[🎮] قم بإدخال مكتبات او اجرائات تنفيذية ليبدء امبراطور بستلامها مع معلومات هاتفك", redStyle);

      }, 2000);
    }
  };

  // تشغيل كافة آليات الدروع الموزعة داخلياً
  SHIELD["core.js"]();
  SHIELD["storage_lock.js"]();
  SHIELD["dev_detect.js"]();
  SHIELD["hotkeys.js"]();
  SHIELD["obfuscation.js"]();

})();
