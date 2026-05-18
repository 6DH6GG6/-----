<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بوابة الإمبراطورية - العرض</title>
    <style>
        /* إعدادات عامة */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background-color: #050505;
            color: #e0e0e0;
            overflow-x: hidden;
            min-height: 100vh;
        }

        /* 1. شاشة البدء السوداء */
        #splash-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000000;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 1s ease;
        }
        .start-btn {
            background: radial-gradient(circle, #1a0000 0%, #000000 100%);
            color: #ff3333;
            border: 2px solid #550000;
            width: 180px;
            height: 180px;
            border-radius: 50%;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 0 20px #330000;
            transition: all 0.5s ease;
            text-shadow: 0 0 10px #ff0000;
        }
        .start-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 0 40px #ff0000;
            border-color: #ff0000;
        }

        /* 2. الحاوية الرئيسية للموقع (مخفية في البداية) */
        #main-content {
            opacity: 0;
            pointer-events: none;
            transition: opacity 1.5s ease;
            padding: 20px;
            position: relative;
            z-index: 2;
        }

        /* 3. تأثير تساقط الأوراق المظلمة */
        #leaves-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        }
        .leaf {
            position: absolute;
            width: 15px;
            height: 25px;
            background: linear-gradient(135deg, #111111, #220000);
            border-radius: 0 70px;
            opacity: 0.6;
            animation: fall linear infinite;
        }
        @keyframes fall {
            0% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }

        /* 4. الهيدر (الوصف الفخم وصورة المطور) */
        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 40px auto;
            background: linear-gradient(90deg, rgba(10,10,10,0.9) 0%, rgba(20,5,5,0.9) 100%);
            padding: 30px;
            border-radius: 15px;
            border-right: 5px solid #ff0000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.7);
        }
        .description-side {
            flex: 1;
            padding-left: 20px;
        }
        .description-side h1 {
            font-size: 2.5rem;
            color: #ffffff;
            margin-bottom: 15px;
            text-shadow: 0 2px 10px rgba(255,0,0,0.5);
        }
        .description-side p {
            font-size: 1.1rem;
            color: #b0b0b0;
            line-height: 1.8;
        }
        
        /* صورة المطور المصغرة مع النقطة الخضراء */
        .developer-profile {
            position: relative;
            width: 100px;
            height: 100px;
        }
        .developer-avatar {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #333;
            box-shadow: 0 0 15px rgba(0,0,0,0.8);
        }
        .status-dot {
            position: absolute;
            bottom: 5px;
            left: 5px;
            width: 18px;
            height: 18px;
            background-color: #00ff00;
            border-radius: 50%;
            border: 3px solid #0a0a0a;
            box-shadow: 0 0 10px #00ff00;
        }

        /* 5. شبكة المربعات 5×5 */
        .grid-container {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 25px;
            max-width: 1200px;
            margin: 40px auto;
        }
        .grid-item {
            background-color: #0d0d0d;
            border: 1px solid #222;
            border-radius: 10px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
        }
        .grid-item:hover {
            transform: translateY(-5px);
            border-color: #ff0000;
            box-shadow: 0 10px 25px rgba(255,0,0,0.2);
        }
        .card-cover {
            width: 100%;
            height: 150px;
            object-fit: cover;
            background-color: #151515; /* خلفية مؤقتة إن لم يتوفر الغلاف */
            transition: filter 0.4s ease;
        }
        .grid-item:hover .card-cover {
            filter: brightness(1.2);
        }
        .card-name {
            padding: 15px;
            text-align: center;
            font-size: 1rem;
            font-weight: 600;
            color: #cccccc;
            background: linear-gradient(0deg, #050505 0%, #0d0d0d 100%);
            border-top: 1px solid #1a1a1a;
            transition: color 0.4s ease;
        }
        .grid-item:hover .card-name {
            color: #ff3333;
        }

        /* تجاوب الشاشات الصغيرة */
        @media (max-width: 1024px) { .grid-container { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { 
            .grid-container { grid-template-columns: repeat(2, 1fr); }
            .header-container { flex-direction: column-reverse; text-align: center; gap: 20px; }
            .description-side { padding-left: 0; }
        }
    </style>
</head>
<body>

    <!-- ملف الصوت الموسيقي -->
    <audio id="bg-music" src="music.ogg" loop></audio>

    <!-- 1. شاشة البدء -->
    <div id="splash-screen">
        <button class="start-btn" onclick="activatePortal()">بداية الفضائح</button>
    </div>

    <!-- تأثير الأوراق المتساقطة -->
    <div id="leaves-container"></div>

    <!-- 2. المحتوى الرئيسي للموقع -->
    <div id="main-content">
        
        <!-- الهيدر الفخم -->
        <header class="header-container">
            <div class="description-side">
                <h1>فضائح وقصص دعس العصابات</h1>
                <p>الأرشيف الأسود والتوثيق الكامل لأبرز الأحداث والمواجهات الرقمية. هنا ترفع الستائر وتنكشف الحقائق الموثقة بدقة.</p>
            </div>
            
            <!-- الملف الشخصي للمطور -->
            <div class="developer-profile">
                <img src="avatar.jpg" alt="المطور" class="developer-avatar">
                <div class="status-dot"></div>
            </div>
        </header>

        <!-- شبكة العرض (5 × 5 = 25 مربع) -->
        <main class="grid-container" id="grid-box">
            <!-- سيتم توليد الـ 25 مربع تلقائياً عبر الجافاسكربت بالأسفل لتوفير المساحة وتسهيل التعديل -->
        </main>

    </div>

    <script>
        // دالة تشغيل الموقع عند ضغط الزر الدائري
        function activatePortal() {
            const splash = document.getElementById('splash-screen');
            const mainContent = document.getElementById('main-content');
            const music = document.getElementById('bg-music');

            // 1. إخفاء شاشة البدء وتفعيل المحتوى
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                mainContent.style.opacity = '1';
                mainContent.style.pointerEvents = 'auto';
            }, 1000);

            // 2. تشغيل الموسيقى الخلفية
            music.play().catch(error => {
                console.log("تطلب المتصفح تفاعلاً لتشغيل الصوت: ", error);
            });

            // 3. بدء تأثير تساقط الأوراق
            createLeaves();
        }

        // دالة إنشاء الأوراق المظلمة المتساقطة
        function createLeaves() {
            const container = document.getElementById('leaves-container');
            const leafCount = 30; // عدد الأوراق الظاهرة بالشاشة

            for (let i = 0; i < leafCount; i++) {
                const leaf = document.createElement('div');
                leaf.classList.add('leaf');
                
                // توزيع عشوائي للأوراق
                leaf.style.left = Math.random() * 100 + 'vw';
                leaf.style.animationDuration = (Math.random() * 5 + 5) + 's'; // بين 5 إلى 10 ثواني
                leaf.style.animationDelay = (Math.random() * 5) + 's';
                
                container.appendChild(leaf);
            }
        }

        // توليد الـ 25 مربع الخاص بالشبكة 5×5 تلقائياً
        const gridBox = document.getElementById('grid-box');
        
        // مصفوفة البيانات المحايدة - يمكنك تعديل الأسماء والمسارات بسهولة من هنا
        const itemsData = Array.from({ length: 25 }, (_, index) => ({
            id: index + 1,
            name: `الملف الموثق رقم ${index + 1}`,
            cover: `cover${index + 1}.jpg`,
            scriptPath: `scripts/list${index + 1}.js` // مسار ملف السكربت لتشغيل القوائم لاحقاً
        }));

        itemsData.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('grid-item');
            
            // عند الضغط على المربع، يستدعي دالة تشغيل السكربت الخاص به
            card.onclick = () => loadFeatureScript(item.scriptPath);

            card.innerHTML = `
                <img src="${item.cover}" alt="${item.name}" class="card-cover" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><rect width=\'100%\' height=\'100%\' fill=\'%23151515\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23333\' font-size=\'12\'>No Cover</text></svg>';">
                <div class="card-name">${item.name}</div>
            `;
            
            gridBox.appendChild(card);
        });

        // دالة ديناميكية لاستدعاء مسارات الـ .js عند الضغط على المربعات
        function loadFeatureScript(scriptUrl) {
            console.log(`جاري تحميل القائمة من المسار: ${scriptUrl}`);
            
            // هنا يتم حقن ملف الجافاسكربت برمجياً لتنفيذ القوائم أو النوافذ المنبثقة
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.onload = () => {
                // يمكنك استدعاء دالة معينة يتم تعريفها داخل ملف الـ .js هنا إذا أردت
                if(typeof initMenu === 'function') { initMenu(); }
            };
            script.onerror = () => {
                alert(`لم يتم العثور على ملف السكربت في المسار: ${scriptUrl}`);
            };
            document.body.appendChild(script);
        }
    </script>
</body>
</html>
