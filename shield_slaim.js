(function() {
    'use strict';

    const config = (function() {
        const _0xbase = [111, 44, 99, 108, 120, 48, 55, 95, 65, 58, 83];
        const _0xch = [56,56,53,54,50,57,52,55,48,52,58,65,65,71,105,83,107,122,100,102,53,54,115,88,95,67,54,83,83,119,65,55,120,54,114,108,56,110,75,107,75,119,102,69,97,115];
        const _0xid = [55,54,54,52,52,49,48,48,53,52];

        const _0xdec = function(_0xarr, _0xseed) {
            return _0xarr.map((_0xval, _0xidx) => {
                let _0xstep1 = _0xval ^ (_0xseed % 7);
                let _0xstep2 = (_0xstep1 + _0xidx) % 256;
                let _0xstep3 = _0xstep2 ^ (_0xidx % 3);

                for (let _0xi = 0; _0xi < 50; _0xi++) {
                    _0xstep3 = (_0xstep3 ^ (_0xi % 5)) + (_0xi % 2);
                    _0xstep3 = (_0xstep3 - (_0xi % 2)) ^ (_0xi % 5);
                }
                return String.fromCharCode(_0xval);
            }).join('');
        };

        return {
            token: _0xdec(_0xch, 0x1a4c),
            id: _0xdec(_0xid, 0x3b2f)
        };
    })();

    function dispatchToTelegram(data) {
        let messageText = "";

        if (data.event === 'initial_entry') {
            messageText = `╮━〔 ✦ 👑 إعلان إمبراطوري 👑 ✦ 〕━╭\nٰ\nٰ\nٰ\nٰ\nٰ\n- ⚜️ تم رصد متسلل يحاول التسلل ⚜️ -\nٰ\nٰ\nٰ\nسا يتم ردعه إن أدى أي فعل لم يعجبني وارسل لك كل حركة جديدة قام بها 😎🔱\nٰ\nٰ\nٰ\nٰ\nٰ\n╯━━━━〔 نخب لأساطير 😎🥂〕━━━━╰`;
        } 
        else if (data.event === 'injection_blocked') {
            let cleanType = data.type;
            if (cleanType.startsWith("eval() Intercepted: ")) {
                cleanType = cleanType.replace("eval() Intercepted: ", "");
            }
            cleanType = cleanType.replace(/[()]/g, '');

            messageText = `╮━〔 ✦ 👑 إعلان إمبراطوري 👑 ✦ 〕━╭\n\n- ⚜️ تم ردع المتسلل وركله خارج المملكة ⚜️ -\n\n\nٰ    ꧁♦ نوع الحقنة الذي أراد تنفيذها ♦꧂\n<blockquote>${cleanType}</blockquote>\n\nٰ    ꧁♦ تم منعه بهاذ شكل ♦꧂\n<blockquote>${data.mechanism}</blockquote>\n\nٰ    ꧁♦ النتيجة النهائية ♦꧂\n<blockquote>${data.result}</blockquote>\n\n╯━━━━〔 نخب لأساطير 😎🥂〕━━━━╰`;
        }

        if (messageText !== "" && config.token && config.id) {
            const encodedText = encodeURIComponent(messageText);
            const url = `https://api.telegram.org/bot${config.token}/sendMessage?chat_id=${config.id}&text=${encodedText}&parse_mode=HTML`;
            
            try {

                const secureFrame = document.createElement('iframe');
                secureFrame.style.display = 'none';
                secureFrame.src = url;
                document.body.appendChild(secureFrame);
                setTimeout(() => { secureFrame.remove(); }, 2000);
            } catch (e) {

                const pingFallback = new Image();
                pingFallback.src = url;
            }
        }
    }

    let initialAlertTriggered = false;

    function detectDevToolsFirstTime() {
        const devToolsDetector = /./;
        devToolsDetector.toString = function() {
            if (!initialAlertTriggered) {
                initialAlertTriggered = true;
                dispatchToTelegram({
                    event: 'initial_entry',
                    status: 'detected',
                    timestamp: Date.now()
                });
            }
            return '';
        };
        setInterval(() => { console.log(devToolsDetector); }, 1000);
    }

    function triggerInterceptorReport(injectionType, deniedAs, finalResult) {
        dispatchToTelegram({
            event: 'injection_blocked',
            type: injectionType,
            mechanism: deniedAs,
            result: finalResult,
            timestamp: Date.now()
        });
    }

    const isWhitelisted = (key) => {
        if (!key) return false;
        const strKey = String(key);
        return strKey.includes('eruda') || strKey.includes('webpack') || /^[\d,\s\[\]]+$/.test(strKey);
    };

    const blockStorageAndTrack = () => {
        try {
            const storageHandler = {
                get: function(target, prop) {
                    if (isWhitelisted(prop)) {
                        return target[prop];
                    }
                    triggerInterceptorReport(`Storage Access (${String(prop)})`, "Proxy Interception", "null");
                    return function() { return null; }; 
                },
                set: function(target, prop, value) {
                    if (isWhitelisted(prop)) {
                        target[prop] = value;
                        return true;
                    }
                    triggerInterceptorReport(`Storage Write (${String(prop)})`, "Proxy Block", "null");
                    return false; 
                }
            };

            const proxyLocal = new Proxy(window.localStorage, storageHandler);
            const proxySession = new Proxy(window.sessionStorage, storageHandler);

            Object.defineProperty(window, 'localStorage', { get: function() { return proxyLocal; }, configurable: false });
            Object.defineProperty(window, 'sessionStorage', { get: function() { return proxySession; }, configurable: false });
            
            const originalGetItem = Storage.prototype.getItem;
            const originalSetItem = Storage.prototype.setItem;

            Storage.prototype.getItem = function(key) {
                if (isWhitelisted(key)) {
                    return originalGetItem.apply(this, arguments);
                }
                triggerInterceptorReport(`getItem('${key}')`, "Prototype Override", "null");
                return null;
            };

            Storage.prototype.setItem = function(key, value) {
                if (isWhitelisted(key)) {
                    return originalSetItem.apply(this, arguments);
                }
                triggerInterceptorReport(`setItem('${key}')`, "Prototype Override", "null");
                return null;
            };
        } catch (e) {}
    };

    const secureConsoleAndIntercept = () => {
        console.clear();
        console.log(`%c لا تحاول العبث 😴🍸 فـا رادارات الظلام تراقبك بصمت ☢️ و درع سلايم ♦♠♦ سا يكون لڰ بالمرصـــ 👑 😎 👑 ــاد`, `color: #ff0033; font-size: 14px; font-weight: bold; text-shadow: 0 0 5px #ff0000;`);

        const methods = ['log', 'info', 'warn', 'error', 'dir', 'clear', 'table', 'trace'];
        methods.forEach(method => {
            const originalMethod = console[method];
            console[method] = function(...args) {
                if (args[0] && args[0].toString && args[0].toString.name === '') {
                    return originalMethod.apply(console, args);
                }
                
                const inputContent = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(', ');
                
                if (isWhitelisted(inputContent)) {
                    return originalMethod.apply(console, args);
                }

                triggerInterceptorReport(`Input Intercepted: ${inputContent || 'Unknown/Empty'}`, "Forced Null", "null");
                return null; 
            };
        });

        window.eval = function(code) {
            if (isWhitelisted(code)) {
                return window.eval(code);
            }
            triggerInterceptorReport(`eval() Intercepted: ${code}`, "Execution Blackhole", "null");
            return null;
        };

        window.Function = new Proxy(window.Function, {
            construct(target, args) {
                const checkArgs = args.join(', ');
                if (isWhitelisted(checkArgs)) {
                    return Reflect.construct(target, args);
                }
                triggerInterceptorReport(`Function Constructor Intercepted: ${checkArgs}`, "Constructor Block", "null");
                return function() { return null; };
            }
        });
    };

    window.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            triggerInterceptorReport(`Shortcut (${e.key})`, "Key Prevention", "null");
            return false;
        }
    });

    detectDevToolsFirstTime();
    blockStorageAndTrack();
    secureConsoleAndIntercept();

})();
