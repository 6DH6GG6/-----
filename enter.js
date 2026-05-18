/**
 * enter.js - نسخة نجم ديابلوس الدوار والأزرار الثابتة
 * مخصص لطائفة ومملكة الظلال - Kage No Teio
 */

(function() {
    // 1. حقن وتطبيق كود الـ CSS المطور بمظهر نجم ديابلوس الأحمر والأزرار الثابتة
    const style = document.createElement('style');
    style.textContent = `
        /* ══════════════════════════════════════
           SCREEN 3 — واجهة عرش ديابلوس والظلال
        ══════════════════════════════════════ */
        #screen3 {
            position: fixed; inset: 0; z-index: 15;
            background: radial-gradient(circle at 50% 50%, rgba(15, 0, 5, 0.5) 0%, #020005 100%),
                        url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920') no-repeat center center fixed;
            background-size: cover;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1); pointer-events: none;
            overflow: hidden;
        }
        #screen3.show {
            opacity: 1; pointer-events: auto;
        }
        
        /* الحاوية الكونية الرئيسية */
        .s3-universe {
            position: relative; width: min(700px, 95vw); height: min(700px, 95vw);
            display: flex; align-items: center; justify-content: center;
        }

        /* محرك نجم ديابلوس الأحمر الدوار (في الخلفية) */
        .diablos-star-rotor {
            position: absolute; width: 100%; height: 100%;
            animation: diablosRotation 40s linear infinite;
            display: flex; align-items: center; justify-content: center;
            z-index: 1;
            pointer-events: none; /* لضمان عدم إعاقة النقر على الأزرار */
        }
        @keyframes diablosRotation {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* خطوط نجم ديابلوس الشيطاني الحادة باللون الأحمر والنيون */
        .diablos-triangle {
            position: absolute; width: 80%; height: 80%;
            border: 3px solid transparent;
            filter: drop-shadow(0 0 20px rgba(255, 0, 50, 0.75));
        }
        .diablos-triangle.red-up {
            border-bottom: 4px solid #ff0033;
            transform: rotate(0deg) translateY(-16.5%);
        }
        .diablos-triangle.red-down {
            border-bottom: 4px solid #ff0033;
            transform: rotate(180deg) translateY(-16.5%);
        }
        .diablos-triangle.dark-up {
            border-bottom: 3.5px solid #8b0000;
            transform: rotate(60deg) translateY(-16.5%);
            filter: drop-shadow(0 0 15px rgba(139, 0, 0, 0.9));
        }
        .diablos-triangle.dark-down {
            border-bottom: 3.5px solid #8b0000;
            transform: rotate(240deg) translateY(-16.5%);
            filter: drop-shadow(0 0 15px rgba(139, 0, 0, 0.9));
        }

        /* مصفوفة الأزرار الثابتة (فوق النجم الدوار) */
        .fixed-nodes-layer {
            position: absolute; inset: 0;
            z-index: 5;
            pointer-events: none;
        }

        /* أزرار رؤوس النجمة الستة الثابتة والفخمة */
        .vertex-node {
            position: absolute; width: clamp(95px, 14vw, 125px); height: clamp(105px, 15vw, 140px);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            cursor: pointer;
            pointer-events: auto; /* تفعيل النقر للأزرار فقط */
        }

        /* تصميم الكرت السداسي الفخم الزجاجي */
        .hex-card {
            position: relative; width: 100%; height: 100%;
            background: rgba(8, 2, 15, 0.88);
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            border: 1px solid rgba(255, 50, 50, 0.3);
            transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            padding: 8px; overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.7);
        }
        
        /* تأثير الصورة الخلفية الفخمة داخل الكرت */
        .hex-card::before {
            content: ''; position: absolute; inset: 0;
            background-size: cover; background-position: center;
            opacity: 0.3; mix-blend-mode: luminosity;
            transition: all 0.4s ease; z-index: 1;
        }
        
        /* تركيب الصور المخصصة لكل بطاقة سداسية ثابتة */
        .node-games .hex-card::before { background-image: url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400'); }
        .node-cinema .hex-card::before { background-image: url('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400'); }
        .node-hacker .hex-card::before { background-image: url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400'); }
        .node-slime .hex-card::before { background-image: url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400'); }
        .node-market .hex-card::before { background-image: url('https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400'); }
        .node-targets .hex-card::before { background-image: url('https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=400'); }

        /* تأثيرات الـ Hover المضيئة باللون الأحمر النيوني */
        .vertex-node:hover .hex-card {
            transform: translateY(-6px) scale(1.05);
            border-color: #ff0033;
            box-shadow: 0 15px 35px rgba(255, 0, 50, 0.45);
        }
        .vertex-node:hover .hex-card::before {
            opacity: 0.7; mix-blend-mode: normal; transform: scale(1.08);
        }

        /* تفاصيل النصوص والأيقونات */
        .node-icon {
            font-size: clamp(20px, 3vw, 26px); z-index: 2;
            filter: drop-shadow(0 0 8px rgba(255,255,255,0.5));
            margin-bottom: 6px; transition: transform 0.3s;
        }
        .vertex-node:hover .node-icon { transform: scale(1.18); }
        
        .node-label {
            font-family: 'Cairo', sans-serif; font-size: clamp(10px, 1.3vw, 12px); font-weight: 700;
            color: #ffffff; text-shadow: 0 2px 5px #000, 0 0 10px rgba(255,0,50,0.6);
            z-index: 2; text-align: center; pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // 2. بناء هيكل واجهة النجم والخلفية وطبقة الأزرار المنفصلة
    const screen3 = document.createElement('div');
    screen3.id = 'screen3';
    
    screen3.innerHTML = `
        <div class="s3-universe">
            <!-- طبقة خلفية: نجم ديابلوس الشيطاني الدوار باللون الأحمر -->
            <div class="diablos-star-rotor">
                <div class="diablos-triangle red-up"></div>
                <div class="diablos-triangle red-down"></div>
                <div class="diablos-triangle dark-up"></div>
                <div class="diablos-triangle dark-down"></div>
            </div>

            <!-- طبقة أمامية: الأزرار الستة المستقرة والثابتة تماماً -->
            <div class="fixed-nodes-layer">
                <!-- الزر 1: الألعاب -->
                <div class="vertex-node node-games" data-script="games.js" data-index="0">
                    <div class="hex-card">
                        <span class="node-icon">🎮</span>
                        <span class="node-label">قسم الألعاب</span>
                    </div>
                </div>

                <!-- الزر 2: السينما -->
                <div class="vertex-node node-cinema" data-script="cinema.js" data-index="1">
                    <div class="hex-card">
                        <span class="node-icon">🦊</span>
                        <span class="node-label">عالم الانمي</span>
                    </div>
                </div>

                <!-- الزر 3: الهاكر -->
                <div class="vertex-node node-hacker" data-script="hacker.js" data-index="2">
                    <div class="hex-card">
                        <span class="node-icon">👁️‍🗨️</span>
                        <span class="node-label">نظام الاختراق</span>
                    </div>
                </div>

                <!-- الزر 4: نظام سلايم -->
                <div class="vertex-node node-slime" data-script="slime.js" data-index="3">
                    <div class="hex-card">
                        <span class="node-icon">🌀</span>
                        <span class="node-label">نظام سلايم</span>
                    </div>
                </div>

                <!-- الزر 5: نظام بيع وشراء -->
                <div class="vertex-node node-market" data-script="market.js" data-index="4">
                    <div class="hex-card">
                        <span class="node-icon">🪙</span>
                        <span class="node-label">التجارة والبيع</span>
                    </div>
                </div>

                <!-- الزر 6: المستهدفين -->
                <div class="vertex-node node-targets" data-script="targets.js" data-index="5">
                    <div class="hex-card">
                        <span class="node-icon">🎯</span>
                        <span class="node-label">قائمة الأهداف</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(screen3);

    // 3. توزيع الأزرار هندسياً بشكل ثابت ومستقر على الأبعاد المحسوبة لزوايا الرؤوس الستة
    const nodes = document.querySelectorAll('.vertex-node');
    const radius = window.innerWidth < 600 ? 145 : 235; 

    nodes.forEach(node => {
        const idx = parseInt(node.getAttribute('data-index'));
        // زوايا ثابتة لا تتغير (كل 60 درجة) لإنشاء التناظر السداسي المثالي
        const angle = (idx * 60) * (Math.PI / 180) - (Math.PI / 2);
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        // تثبيت إحداثيات الكروت في الطبقة الأمامية المستقرة
        node.style.left = `calc(50% + ${x}px - (${node.clientWidth || 110}px / 2))`;
        node.style.top = `calc(50% + ${y}px - (${node.clientHeight || 125}px / 2))`;
    });

    // 4. عرض الواجهة فوراً وبتأثير التلاشي الناعم المعتمد
    requestAnimationFrame(() => {
        screen3.classList.add('show');
    });

    // 5. ربط الأحداث بالأزرار الثابتة لاستدعاء ملفاتها الخارجية عند النقر
    nodes.forEach(node => {
        node.addEventListener('click', function(e) {
            e.stopPropagation();
            const targetScript = this.getAttribute('data-script');
            
            if (window.SoundManager && typeof window.SoundManager.playClick === 'function') {
                window.SoundManager.playClick();
            }

            console.log(`[Diablos Command] استدعاء مسار القائمة: ${targetScript}`);
            
            // حقن السكريبت الخارجي التابع للزر لتشغيل القائمة فوراً
            const scriptLoader = document.createElement('script');
            scriptLoader.src = targetScript;
            document.head.appendChild(scriptLoader);
        });
    });

})();
