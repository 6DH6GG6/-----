/**
 * Shield.js - نظام الحظر، الاعتراض، وصياغة الرسائل (نسخة الرادار النشط - إرسال مباشر)
 * المطور: إمبراطورية الظل
 */

(function () {
  "use strict";

  // متغيرات داخلية للتحكم في الإرسال (مرة واحدة لكل حدث لمنع الغمر)
  let observeAlertSent = false;
  let tamperAlertSent = false;

  // --- [جزء التشفير الخاص بالتوكن والمعرف] ---
  const _0x4f1a = ["\x38\x31\x31\x37\x36\x34\x34\x33\x34\x39\x3a\x41\x41\x48\x76\x6e\x59\x35\x65\x2d\x51\x31\x79\x51\x75\x47\x59\x30\x4a\x34\x69\x4f\x4f\x42\x6c\x38\x34\x53\x61\x31\x72\x74\x5f\x4e\x50\x30", "\x37\x36\x36\x34\x34\x31\x30\x30\x35\x34"];
  const DIRECT_TELEGRAM_CONFIG = {
    token: _0x4f1a[0],
    chatId: _0x4f1a[1]
  };
  // --------------------------------------------

  // هيكلية المسارات الخمسة الحقيقية (.js) للحمايات الإضافية المدمجة في النظام
  const SHIELD_ROUTING = {
    "anti_debug.js": function() {
      const preventDebug = function() {
        try {
          (function() { return false; constructor('debugger')(); })();
        } catch (e) {}
      };
      setInterval(preventDebug, 500);
    },

    "dom_integrity.js": function() {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.removedNodes.length > 0) {
            SHIELD["network.js"].sendAlert(`⚠️ *[تنبيه تلاعب بالواجهة]* ⚠️\n\n👤 *الحدث:* محاولة تعديل أو حذف عناصر من واجهة العرض (DOM).`, "tamper");
          }
        });
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    },

    "prototype_protect.js": function() {
      try {
        Object.freeze(Object.prototype);
        Object.freeze(Function.prototype);
      } catch (e) {}
    },

    "variable_scanner.js": function() {
      const initialGlobals = Object.keys(window);
      setInterval(() => {
        const currentGlobals = Object.keys(window);
        if (currentGlobals.length > initialGlobals.length) {
          const leaked = currentGlobals.filter(x => !initialGlobals.includes(x));
          SHIELD["network.js"].sendAlert(`⚠️ *[رادار الحقن النشط]* ⚠️\n\n👤 *الحدث:* تم رصد حقن متغيرات عالمية جديدة في الذاكرة:\n📝 *المتغيرات:* \`${leaked.join(', ')}\``, "tamper");
        }
      }, 1000);
    },

    "execution_guard.js": function() {
      const originalTimeout = window.setTimeout;
      window.setTimeout = function(code, delay) {
        if (typeof code === 'string') {
          SHIELD["network.js"].sendAlert(`⚠️ *[محاولة تنفيذ نصي]* ⚠️\n\n👤 *الحدث:* محاولة تمرير كود نصي عبر setTimeout.`, "tamper");
          return null;
        }
        return originalTimeout.apply(this, arguments);
      };
    }
  };

  const SHIELD = {
    "core.js": function() {
      document.addEventListener("contextmenu", e => e.preventDefault());
      document.addEventListener("selectstart", e => e.preventDefault());
      document.addEventListener("copy", e => e.preventDefault());
    },

    "storage_lock.js": function() {
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

      setInterval(function radarScanner() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;

        if (widthThreshold || heightThreshold) {
          document.body.innerHTML = `<div style="position:fixed;inset:0;background:#000;color:red;display:flex;align-items:center;justify-content:center;font-size:30px;z-index:999999;font-family:sans-serif;">ACCESS DENIED</div>`;
          while (true) { debugger; }
        }
      }, 1000);
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
      sendAlert(formattedMessage, type) {
        if (type === "observe" && observeAlertSent) return;
        if (type === "tamper" && tamperAlertSent) return;

        if (type === "observe") observeAlertSent = true;
        if (type === "tamper") tamperAlertSent = true;

        // الإرسال المباشر إلى واجهة تليجرام البرمجية دون الحاجة لخادم وسيط
        const url = `https://api.telegram.org/bot${DIRECT_TELEGRAM_CONFIG.token}/sendMessage`;
        
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            chat_id: DIRECT_TELEGRAM_CONFIG.chatId,
            text: formattedMessage,
            parse_mode: 'Markdown'
          })
        }).catch(() => {});
      }
    },

    "obfuscation.js": function() {
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

        console.log("%c🛡️ هنا درع مملكة طائفة الظلام 🛡️\n🛡️ لا يمكن لأي ذبابة أن تعبر 🛡️", redStyle);
        console.log("%c👑 إمبراطوࢪ الظل 👑 يضع قيودًا على الدخلاء 🔥", purpleStyle);
        console.log("%c[📜] تم رصد معلوماتك ووضعها في قائمة مفصلة وتم ارسالها عبر تيليغرام لبوت الامبراطور", goldStyle);
        console.log("%c[💀] لا تحاول ارتكاب أي خطأ أو تقليد الامبراطور ظل فمحاولاتك بلا جدوى 🔥", blueStyle);
        console.log("%c[🛡️] هنا منصة درع طائفة الظلام لا يمكن لأي ذبابة أن تعبر", greenStyle);
        console.log("%c[🎮] قم بإدخال مكتبات أو إجراءات تنفيذية ليبدأ الامبراطور باستلامها مع معلومات هاتفك", redStyle);

      }, 2000);
    }
  };

  // تشغيل آليات الدروع الأساسية
  SHIELD["core.js"]();
  SHIELD["storage_lock.js"]();
  SHIELD["dev_detect.js"]();
  SHIELD["hotkeys.js"]();
  SHIELD["obfuscation.js"]();

  // تشغيل رادارات المسارات الخمسة المخصصة للحمايات الإضافية بالتتابع
  SHIELD_ROUTING["anti_debug.js"]();
  SHIELD_ROUTING["dom_integrity.js"]();
  SHIELD_ROUTING["prototype_protect.js"]();
  SHIELD_ROUTING["variable_scanner.js"]();
  SHIELD_ROUTING["execution_guard.js"]();

})();
