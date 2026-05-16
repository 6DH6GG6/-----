/**
 * Shield.js - نظام الحظر التام، واعتراض العمليات والمفاتيح المحمية
 * المطور: إمبراطورية الظل
 */

(function () {
  "use strict";

  // متغيرات التحكم في تدفق الرسائل (تمنع التكرار اللحظي المزعج وتسمح بالتنبيه لكل محاولة منفصلة)
  let observeAlertSent = false;
  let tamperAlertSent = false;

  // دالة لإعادة تفعيل إمكانية الإرسال للمحاولات الجديدة بعد فترة وجيزة (2 ثانية)
  function resetAlertCooldown() {
    setTimeout(() => {
      tamperAlertSent = false;
    }, 2000);
  }

  const SHIELD = {
    "core.js": function() {
      // حظر القائمة اليمنى، التحديد، والنسخ
      document.addEventListener("contextmenu", e => e.preventDefault());
      document.addEventListener("selectstart", e => e.preventDefault());
      document.addEventListener("copy", e => e.preventDefault());
    },

    "storage_lock.js": function() {
      // حظر قاطع واعتراض محاولات الوصول أو الكتابة للمفتاح empire_access
      const originalGetItem = localStorage.getItem;
      const originalSetItem = localStorage.setItem;

      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: function(key, value) {
            // حظر الحفظ وإرجاع null عند محاولة حقن القيمة المطلوبة
            if (key === "empire_access") {
              SHIELD["network.js"].sendAlert(
                `⚠️ *[تنبيه اختراق وتلاعب]* ⚠️\n\n` +
                `👤 *الحدث:* محاولة حقن أو تعديل المفتاح المحمي \`empire_access\`\n` +
                `📝 *المدخلات المرفوضة:* \`${key} = ${value}\`\n` +
                `🚫 *الإجراء:* تم رفض العملية بالكامل وإرجاع \`null\`.`, 
                "tamper"
              );
              return null;
            }
            return originalSetItem.apply(localStorage, arguments);
          },
          getItem: function(key) {
            // حظر القراءة وإرجاع null عند محاولة استدعاء القيمة المطلوبة
            if (key === "empire_access") {
              SHIELD["network.js"].sendAlert(
                `⚠️ *[تنبيه اختراق وتلاعب]* ⚠️\n\n` +
                `👤 *الحدث:* محاولة استدعاء وقراءة المفتاح المحمي \`empire_access\`\n` +
                `🚫 *الإجراء:* تم حجب القيمة بالكامل وإرجاع \`null\`.`, 
                "tamper"
              );
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
          observeAlertSent = true; // يتم إرسالها مرة واحدة فقط عند فتح الكونسول لأول مرة
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

      // كشف فتح الأدوات عبر أبعاد الشاشة لحظر المتسلل فوراً
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
      // دالة الإرسال إلى جذر السيرفر بدون مجلدات
      sendAlert(formattedMessage, type) {
        if (type === "observe" && observeAlertSent && !formattedMessage.includes("👑")) return;
        if (type === "tamper" && tamperAlertSent) return;

        if (type === "tamper") {
          tamperAlertSent = true;
          resetAlertCooldown(); // بدء مؤقت التبريد للسماح بالإنذار القادم عند كتابة أمر جديد
        }

        fetch("/shield-send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: formattedMessage })
        }).catch(() => {});
      }
    },

    "obfuscation.js": function() {
      // اعتراض الأخطاء الناتجة عن كتابة أو إدخال أي كلمات برمجية من المتسلل وتطهيرها فوراً
      window.addEventListener('error', (e) => {
        e.preventDefault(); // إخفاء تفاصيل الخطأ التقليدية عن المتسلل
        SHIELD["network.js"].sendAlert(
          `⚠️ *[تنبيه محاولة إدخال أمر]* ⚠️\n\n` +
          `👤 *الحدث:* حاول المتسلل كتابة أو تنفيذ كود غير مصرح به في الكونسول.\n` +
          `📝 *الخطأ المرصود:* \`${e.message}\`\n` +
          `🚫 *الإجراء:* تم تجميد المدخلات وتطهير الشاشة فوراً.`, 
          "tamper"
        );
      });

      // إغراق الكونسول بالأخطاء المزيفة والنصوص الإمبراطورية الخمسة لحجب الرؤية تماماً
      setInterval(() => {
        console.error("Uncaught TypeError: Cannot read properties of undefined");
        console.warn("Error with Permissions-Policy header");
      }, 3000);

      setInterval(() => {
        console.clear();

        const redStyle = "color: #FF0055; font-size: 18px; font-weight: bold; text-shadow: 0 0 8px #FF0055; background: #000; padding: 4px; border-left: 5px solid #FF0055;";
        const purpleStyle = "color: #8A2BE2; font-size: 18px; font-weight: bold; text-shadow: 0 0 8px #8A2BE2; background: #0b001a; padding: 4px; border-left: 5px solid #8A2BE2;";
        const goldStyle = "color: #FFD700; font-size: 16px; font-weight: bold; text-shadow: 0 0 6px #FFD700; background: #1a1500; padding: 4px;";
        const blueStyle = "color: #00FFFF; font-size: 16px; font-weight: bold; text-shadow: 0 0 6px #00FFFF; background: #00111a; padding: 4px;";
        const greenStyle = "color: #39FF14; font-size: 15px; font-weight: bold; text-shadow: 0 0 6px #39FF14; background: #001a00; padding: 4px;";

        console.log("%c[!] لا تحاول بمجرد دخولك تم سحب معلوماتك", redStyle);
        console.log("%c*👑الامبراطور الظل👑 يضع قيودًا للدخلاء 🔥*", purpleStyle);
        console.log("%c[📜] تم رصد معلوماتك ووضعها في قائمة مفصلة وتم ارسالها عبر تيليغرام لبوت الامبراطور", goldStyle);
        console.log("%c[💀] لا تحاول اركاب اي خطأ او تقليد الامبراطور ظل فا محاولاتك بلا جدوى 🔥", blueStyle);
        console.log("%c[🛡️] هنا منصة درع طائفة الظلام لا يمكن لأي ذبابة أن تعبر", greenStyle);
        console.log("%c[🎮] قم بإدخال مكتبات او اجرائات تنفيذية ليبدء امبراطور بستلامها مع معلومات هاتفك", redStyle);

      }, 1500); // تسريع وتيرة التطهير إلى 1.5 ثانية لمنع أي كلمات من البقاء على الشاشة
    }
  };

  // تشغيل كافة آليات الدروع الموزعة داخلياً
  SHIELD["storage_lock.js"]();
  SHIELD["dev_detect.js"]();
  SHIELD["hotkeys.js"]();
  SHIELD["obfuscation.js"]();

})();
