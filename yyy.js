/* ═══════════════════════════════════════════════
   yyy.js — صواعق الواجهة الرئيسية
   - بنفسجية : عند الضغط على البوابة  → YYY.startPurple()
   - حمراء   : عند دخول الواجهة الرئيسية → YYY.start()
   - إيقاف   : YYY.stop()
═══════════════════════════════════════════════ */
const YYY = (function(){

  let cv, ctx, W, H, active = false, lastStrike = 0;
  const bolts = [];

  /* لون الصاعقة الحالي */
  let boltColor  = '255,0,0';       /* أحمر افتراضي */
  let glowColor  = 'rgba(255,0,0,1)';

  function init(){
    cv  = document.getElementById('lightning-canvas');
    ctx = cv.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize(){
    W = cv.width  = innerWidth;
    H = cv.height = innerHeight;
  }

  function spawnLightning(startX, startY, endX, endY){
    const points = [{ x: startX, y: startY }];
    let cx = startX, cy = startY;
    const steps = 10;
    for(let i = 1; i < steps; i++){
      const p  = i / steps;
      const tx = startX + (endX - startX) * p;
      const ty = startY + (endY - startY) * p;
      cx = tx + (Math.random() - 0.5) * 60;
      cy = ty + (Math.random() - 0.5) * 60;
      points.push({ x: cx, y: cy });
    }
    points.push({ x: endX, y: endY });
    /* نحفظ اللون مع كل صاعقة لحظة إنشائها */
    return { points, life: 1, color: boltColor, glow: glowColor };
  }

  function drawBolts(){
    for(let i = bolts.length - 1; i >= 0; i--){
      const bolt = bolts[i];
      ctx.beginPath();
      ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
      for(let j = 1; j < bolt.points.length; j++){
        ctx.lineTo(bolt.points[j].x, bolt.points[j].y);
      }
      ctx.strokeStyle = `rgba(${bolt.color},${bolt.life})`;
      ctx.lineWidth   = 3;
      ctx.shadowColor = bolt.glow;
      ctx.shadowBlur  = 28;
      ctx.stroke();
      ctx.shadowBlur  = 0;
      bolt.life -= 0.05;
      if(bolt.life <= 0) bolts.splice(i, 1);
    }
  }

  function loop(now){
    if(!active) return;
    ctx.clearRect(0, 0, W, H);

    if(now - lastStrike >= 1000){
      const sX = Math.random() * W;
      const sY = Math.random() * H * 0.3;
      const eX = Math.random() * W;
      const eY = H * 0.5 + Math.random() * H * 0.5;
      bolts.push(spawnLightning(sX, sY, eX, eY));
      lastStrike = now;
    }

    drawBolts();
    requestAnimationFrame(loop);
  }

  function startWithColor(rgb, glow){
    if(!cv) init();
    boltColor = rgb;
    glowColor = glow;
    if(active) return;   /* لو شغّال فقط غيّر اللون */
    active    = true;
    lastStrike = 0;
    requestAnimationFrame(loop);
  }

  return {

    /* ── صواعق بنفسجية — عند الضغط على البوابة ── */
    startPurple(){
      startWithColor('180,0,255', 'rgba(180,0,255,1)');
    },

    /* ── صواعق حمراء — عند دخول الواجهة الرئيسية ── */
    start(){
      startWithColor('255,0,0', 'rgba(255,0,0,1)');
    },

    /* ── إيقاف ── */
    stop(){
      active = false;
      if(ctx) ctx.clearRect(0, 0, W, H);
      bolts.length = 0;
    }
  };

})();