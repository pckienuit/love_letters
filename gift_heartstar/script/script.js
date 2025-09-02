const music = document.getElementById("bg-music");
let isPlaying = false;

const playMusicOnce = () => {
  music.play().catch(e => console.log("Music play blocked:", e));
  isPlaying = true;
  document.querySelector('.click-hint').style.display = 'none';
  window.removeEventListener("click", playMusicOnce);
};

window.addEventListener("click", playMusicOnce);

const messages = [
  "Em là vũ trụ của anh ✨",
  "Tình yêu bất tận giữa các vì sao 💫",
  "Em là ngôi sao sáng nhất 🌟",
  "Anh tỏa sáng là vì em 💖",
  "Em thật tỏa sáng trên bầu trời của anh ⭐",
  "Love you to the stars and back 🚀",
  "You are my universe 🌌",
  "Forever and always 💕"
];

const fallingTexts = [];
const explosions = [];
const sparkles = [];

function createFallingText() {
  const text = messages[Math.floor(Math.random() * messages.length)];
  const fontSize = Math.random() * 12 + 14;

  ctx.font = `bold ${fontSize}px Pacifico`;
  const textWidth = ctx.measureText(text).width;

  const x = Math.random() * (width - textWidth); 

  fallingTexts.push({
    text,
    x,
    y: -30,
    speed: Math.random() * 1.5 + 1,
    alpha: 1,
    fontSize,
    hue: Math.random() * 60 + 300,
    rotation: Math.random() * 0.1 - 0.05,
    scale: 1
  });
}

function createExplosion(x, y) {
  for (let i = 0; i < 8; i++) {
    explosions.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      size: Math.random() * 4 + 2,
      life: 1,
      decay: Math.random() * 0.02 + 0.01,
      hue: Math.random() * 60 + 300
    });
  }
}

function createSparkle(x, y) {
  for (let i = 0; i < 4; i++) {
    sparkles.push({
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 3 + 1,
      life: 1,
      decay: Math.random() * 0.03 + 0.02,
      hue: Math.random() * 360
    });
  }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const stars = [];
const heartStars = [];
const meteors = [];

let mouseX = width / 2;
let mouseY = height / 2;
let heartBeat = 1;
let heartScale = Math.min(width, height) * 0.015;

function heartShape(t, scale = 1) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return { x: x * scale, y: y * scale };
}

function createHeartStars(count = 800) {
  const centerX = width / 2;
  const centerY = height / 2 + 20;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const heart = heartShape(t, heartScale);
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;

    const targetX = centerX + heart.x + offsetX;
    const targetY = centerY + heart.y + offsetY;

    heartStars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      targetX,
      targetY,
      originalX: targetX,
      originalY: targetY,
      size: Math.random() * 3 + 1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      brightness: Math.random() * 0.5 + 0.5,
      hue: Math.random() * 80 + 280,
      mode: 'flying',
      trail: []
    });
  }
}

function createBackgroundStars() {
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      brightness: Math.random() * 0.4 + 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.01
    });
  }
}

function createMeteor() {
  meteors.push({
    x: Math.random() * width + 100,
    y: -50,
    length: Math.random() * 120 + 80,
    speed: Math.random() * 8 + 8,
    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
    alpha: 1,
    hue: Math.random() * 60 + 200
  });
}

setInterval(() => {
  if (Math.random() < 0.4 && isPlaying) createFallingText();
}, 4000);

function animate() {
  ctx.clearRect(0, 0, width, height);
  heartBeat += 0.08;

  // Enhanced background stars with reduced flicker frequency
  stars.forEach(star => {
    star.twinkle += star.twinkleSpeed;

    const flicker = Math.random() < 0.003 ? 1 : 0; // Reduced flicker frequency
    const pulse = Math.sin(Date.now() * star.pulseSpeed) * 0.2 + 0.8;
    const baseOpacity = star.brightness * (0.4 + 0.6 * Math.sin(star.twinkle)) * pulse;
    const opacity = Math.min(1, baseOpacity + flicker);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = flicker ? '#ffdddd' : '#ffffff';
    ctx.shadowBlur = flicker ? 15 : 3; // Reduced shadow blur
    ctx.shadowColor = flicker ? '#fff' : 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * (flicker ? 1.3 : 1), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Enhanced meteors with colorful trails
  meteors.forEach((m, i) => {
    const dx = Math.cos(m.angle) * m.length;
    const dy = Math.sin(m.angle) * m.length;
    
    ctx.save();
    ctx.globalAlpha = m.alpha;
    
    // Create gradient trail
    const gradient = ctx.createLinearGradient(m.x, m.y, m.x - dx, m.y - dy);
    gradient.addColorStop(0, `hsla(${m.hue}, 100%, 80%, ${m.alpha})`);
    gradient.addColorStop(0.5, `hsla(${m.hue + 20}, 100%, 70%, ${m.alpha * 0.6})`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsla(${m.hue}, 100%, 70%, ${m.alpha})`;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - dx, m.y - dy);
    ctx.stroke();
    ctx.restore();
    
    m.x += Math.cos(m.angle) * m.speed;
    m.y += Math.sin(m.angle) * m.speed;
    m.alpha -= 0.008;
    
    if (m.alpha <= 0 || m.y > height + 100) {
      createExplosion(m.x, m.y);
      meteors.splice(i, 1);
    }
  });

  // Enhanced falling texts with rotation and scaling
  fallingTexts.forEach((t, i) => {
    ctx.save();
    ctx.translate(t.x + ctx.measureText(t.text).width / 2, t.y);
    ctx.rotate(t.rotation * t.y * 0.01);
    ctx.scale(t.scale, t.scale);
    ctx.font = `bold ${t.fontSize}px Pacifico`;
    ctx.fillStyle = `hsla(${t.hue}, 100%, 85%, ${t.alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `hsla(${t.hue}, 100%, 70%, ${t.alpha})`;
    ctx.fillText(t.text, -ctx.measureText(t.text).width / 2, 0);
    ctx.restore();

    t.y += t.speed;
    t.alpha -= 0.003;
    t.scale = Math.max(0.5, t.scale - 0.002);

    if (t.y > height + 50 || t.alpha <= 0) {
      fallingTexts.splice(i, 1);
    }
  });

  // Draw explosions
  explosions.forEach((exp, i) => {
    ctx.save();
    ctx.globalAlpha = exp.life;
    ctx.fillStyle = `hsl(${exp.hue}, 100%, 70%)`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsl(${exp.hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(exp.x, exp.y, exp.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    exp.x += exp.vx;
    exp.y += exp.vy;
    exp.vx *= 0.98;
    exp.vy *= 0.98;
    exp.life -= exp.decay;

    if (exp.life <= 0) {
      explosions.splice(i, 1);
    }
  });

  // Draw sparkles
  sparkles.forEach((spark, i) => {
    ctx.save();
    ctx.globalAlpha = spark.life;
    ctx.fillStyle = `hsl(${spark.hue}, 100%, 80%)`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsl(${spark.hue}, 100%, 60%)`;
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.life -= spark.decay;

    if (spark.life <= 0) {
      sparkles.splice(i, 1);
    }
  });

  // Enhanced heart stars with optimized trails
  heartStars.forEach((star, i) => {
    star.twinkle += star.twinkleSpeed;
    const centerX = width / 2;
    const centerY = height / 2 + 20;

    // Simplified trail effect - only keep 3 points
    if (star.trail.length > 3) star.trail.shift();
    if (i % 4 === 0) { // Only add trail for every 4th star
      star.trail.push({ x: star.x, y: star.y, alpha: 0.3 });
    }

    // Draw trail only for selected stars
    if (i % 4 === 0) {
      star.trail.forEach((point, j) => {
        ctx.save();
        ctx.globalAlpha = point.alpha * (j / star.trail.length) * 0.5;
        ctx.fillStyle = `hsl(${star.hue}, 70%, 80%)`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, star.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    if (star.mode === 'flying') {
      const dx = star.targetX - star.x;
      const dy = star.targetY - star.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.1;
      if (dist > 1) {
        star.x += dx * speed;
        star.y += dy * speed;
      } else {
        star.mode = 'heart';
        if (Math.random() < 0.3) createSparkle(star.x, star.y); // Reduce sparkle frequency
      }
    } else {
      const deltaX = star.originalX - centerX;
      const deltaY = star.originalY - centerY;
      const beatScale = 1 + Math.sin(heartBeat) * 0.06;
      star.x = centerX + deltaX * beatScale;
      star.y = centerY + deltaY * beatScale;

      const distanceToMouse = Math.hypot(mouseX - star.x, mouseY - star.y);
      let interactionForce = 0;
      if (distanceToMouse < 100) {
        interactionForce = (100 - distanceToMouse) / 100;
        const angle = Math.atan2(star.y - mouseY, star.x - mouseX);
        star.x += Math.cos(angle) * interactionForce * 12;
        star.y += Math.sin(angle) * interactionForce * 12;
      }
    }

    const twinkleOpacity = star.brightness * (0.4 + 0.6 * Math.sin(star.twinkle));
    ctx.save();
    ctx.globalAlpha = twinkleOpacity;
    ctx.fillStyle = `hsl(${star.hue}, 80%, 85%)`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `hsl(${star.hue}, 80%, 70%)`;
    
    // Simplified star shape - just a circle for better performance
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Reduce sparkle frequency on mouse move
  if (Math.random() < 0.1) {
    createSparkle(mouseX, mouseY);
  }
});

canvas.addEventListener('click', (e) => {
  const centerX = width / 2;
  const centerY = height / 2 + 20;
  heartScale *= 1.02;
  
  // Create explosion at click
  createExplosion(e.clientX, e.clientY);
  
  heartStars.forEach((star, i) => {
    if (star.mode === 'heart') {
      const t = (i / heartStars.length) * Math.PI * 2;
      const heart = heartShape(t, heartScale);
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      star.originalX = centerX + heart.x + offsetX;
      star.originalY = centerY + heart.y + offsetY;
    }
  });

  // Add new stars with each click - reduced amount
  for (let i = 0; i < 8; i++) {
    const t = Math.random() * Math.PI * 2;
    const heart = heartShape(t, heartScale);
    const targetX = centerX + heart.x;
    const targetY = centerY + heart.y;

    heartStars.push({
      x: e.clientX + (Math.random() - 0.5) * 60,
      y: e.clientY + (Math.random() - 0.5) * 60,
      targetX,
      targetY,
      originalX: targetX,
      originalY: targetY,
      size: Math.random() * 3 + 2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.04 + 0.02,
      brightness: Math.random() * 0.8 + 0.6,
      hue: Math.random() * 80 + 280,
      mode: 'flying',
      trail: []
    });
  }
});

// Add keyboard interactions
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    // Create moderate sparkle explosion
    for (let i = 0; i < 20; i++) {
      createSparkle(
        Math.random() * width,
        Math.random() * height
      );
    }
  }
});

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  heartScale = Math.min(width, height) * 0.015;
  heartStars.length = 0;
  stars.length = 0;
  createHeartStars();
  createBackgroundStars();
});

setInterval(() => { 
  if (Math.random() < 0.5) createMeteor(); 
}, 4000);

createHeartStars();
createBackgroundStars();
animate();