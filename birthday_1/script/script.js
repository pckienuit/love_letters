const musicBtn = document.getElementById("music-btn");
const music = document.getElementById("bg-music");
let isPlaying = false;

window.addEventListener("load", () => {
  music.volume = 0.2;
  const tryPlay = () => {
    music.play().then(() => {
      musicBtn.textContent = "🔊";
      isPlaying = true;
    }).catch(() => {
      musicBtn.textContent = "🔇";
      isPlaying = false;
    });
  };

  tryPlay();

  document.body.addEventListener("click", function once() {
    if (!isPlaying) tryPlay();
    document.body.removeEventListener("click", once);
  });
});

musicBtn.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    musicBtn.textContent = "🔇";
  } else {
    music.play();
    musicBtn.textContent = "🔊";
  }
  isPlaying = !isPlaying;
});

  const messages = [
    "Sinh nhật dui dẻ nha bà, quý lắm mới chúc á nha bà! 💝🎂.",
    "Mong sao tuổi mới bà sẽ mang đến thật nhiều hạnh phúc và sức khỏe dồi dào! 🎉✨.",
    "Chúc sao cho bà luôn thành công nữa nè, làm gì cũng thuận lợi 🥰🍀.",
    "Thêm một tuổi mới, chúc sao cho bà luôn dui dẻ bên bạn bè, gia đình và người bà luôn yêu thương 🤗💞.",
    "Hãy tận hưởng ngày đặc biệt này với thật nhiều niềm vui và tiếng cười nhé! ❤️🎈"
  ];
  const typingTextElem = document.getElementById("typing-text");
  let msgIndex = 0;
  let charIndex = 0;
  let typingTimeout;

  function typeMessage() {
    if (msgIndex >= messages.length) {
      return; 
    }
    const currentMsg = messages[msgIndex];
    if (charIndex < currentMsg.length) {
      typingTextElem.textContent += currentMsg.charAt(charIndex);
      charIndex++;
      typingTimeout = setTimeout(typeMessage, 50);
    } else {

      typingTimeout = setTimeout(() => {
        typingTextElem.textContent += "\n\n";
        msgIndex++;
        charIndex = 0;
        typeMessage();
      }, 1000);
    }
  }

  function startTyping() {
    clearTimeout(typingTimeout);
    typingTextElem.textContent = "";
    msgIndex = 0;
    charIndex = 0;
    typeMessage();
  }

  function createFallingEmoji() {
    const emojiList = ["🌸", "🎉", "🍰", "💖","🥰", "🎂", "🍀"];
    const emoji = document.createElement("div");
    emoji.className = "falling-emoji";
    emoji.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
    emoji.style.left = Math.random() * 100 + "vw";
    emoji.style.fontSize = (Math.random() * 20 + 24) + "px";
    emoji.style.animationDuration = (Math.random() * 5 + 4) + "s";
    emoji.style.opacity = Math.random() * 0.6 + 0.4;
    document.body.appendChild(emoji);

    emoji.addEventListener("animationend", () => {
      emoji.remove();
    });
  }
  setInterval(createFallingEmoji, 350);

  const popup = document.getElementById("popup");
  const openGiftBtn = document.getElementById("open-gift-btn");
  const closePopupBtn = document.getElementById("close-popup-btn");

  openGiftBtn.addEventListener("click", openPopupAndFireworks);
  closePopupBtn.addEventListener("click", () => {
    popup.classList.remove("show");
    stopFireworks();
  });

  function openPopupAndFireworks() {
    popup.classList.add("show");
    openGiftBtn.setAttribute("aria-expanded", "true");
    startTyping(); 
    startFireworks();
  }

  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let fireworks = [];
  let particles = [];
  let animationFrameId;

  class Firework {
    constructor(sx, sy, tx, ty) {
      this.x = sx;
      this.y = sy;
      this.sx = sx;
      this.sy = sy;
      this.tx = tx;
      this.ty = ty;
      this.distanceToTarget = distance(sx, sy, tx, ty);
      this.distanceTraveled = 0;
      this.coordinates = [];
      this.coordinateCount = 3;
      while(this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.speed = 5;
      this.acceleration = 1.05;
      this.brightness = random(50, 70);
      this.targetRadius = 8;
    }
    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      if(this.targetRadius < 8) this.targetRadius += 0.3;
      this.speed *= this.acceleration;

      let vx = Math.cos(this.angle) * this.speed;
      let vy = Math.sin(this.angle) * this.speed;
      this.distanceTraveled = distance(this.sx, this.sy, this.x + vx, this.y + vy);

      if(this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
      } else {
        this.x += vx;
        this.y += vy;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsl(${random(0, 360)}, 100%, ${this.brightness}%)`;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.coordinates = [];
      this.coordinateCount = 5;
      while(this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = random(0, Math.PI * 2);
      this.speed = random(1, 10);
      this.friction = 0.95;
      this.gravity = 0.7;
      this.hue = random(0, 360);
      this.brightness = random(50, 80);
      this.alpha = 1;
      this.decay = random(0.015, 0.03);
    }
    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.alpha -= this.decay;

      if(this.alpha <= 0) {
        particles.splice(index, 1);
      }
    }
    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
      ctx.stroke();
    }
  }

  function createParticles(x, y) {
    let particleCount = 30;
    while(particleCount--) {
      particles.push(new Particle(x, y));
    }
  }

  function distance(aX, aY, bX, bY) {
    let x = bX - aX;
    let y = bY - aY;
    return Math.sqrt(x * x + y * y);
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function loop() {
    animationFrameId = requestAnimationFrame(loop);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    let i = fireworks.length;
    while(i--) {
      fireworks[i].draw();
      fireworks[i].update(i);
    }

    i = particles.length;
    while(i--) {
      particles[i].draw();
      particles[i].update(i);
    }

    if(fireworks.length < 5) {
      fireworks.push(new Firework(
        canvas.width / 2,
        canvas.height,
        random(100, canvas.width - 100),
        random(50, canvas.height / 2)
      ));
    }
  }

  function startFireworks() {
    if(!animationFrameId) {
      loop();
    }
  }
  function stopFireworks() {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    fireworks = [];
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

const exitBtn = document.getElementById("exit-btn");
const exitPopup = document.getElementById("exit-popup");
const closeExitBtn = document.getElementById("close-exit-btn");

exitBtn.addEventListener("click", () => {
  exitPopup.classList.add("show");
});

closeExitBtn.addEventListener("click", () => {
  exitPopup.classList.remove("show");
});

// Function để di chuyển nút
function moveExitButton() {
  const x = Math.floor(Math.random() * (window.innerWidth - 150));
  const y = Math.floor(Math.random() * (window.innerHeight - 100));
  exitBtn.style.position = "absolute";
  exitBtn.style.left = `${x}px`;
  exitBtn.style.top = `${y}px`;
  exitBtn.style.transition = "all 0.05s ease";
}

// Di chuyển nút khi hover
exitBtn.addEventListener("mouseover", moveExitButton);

// Di chuyển nút khi cố gắng click
exitBtn.addEventListener("mousedown", moveExitButton);

// Di chuyển nút khi focus
exitBtn.addEventListener("focus", moveExitButton);

// Di chuyển nút khi touch (cho mobile)
exitBtn.addEventListener("touchstart", moveExitButton);

// Di chuyển nút liên tục với interval
setInterval(() => {
  // Chỉ di chuyển nếu popup chưa mở
  if (!exitPopup.classList.contains("show")) {
    moveExitButton();
  }
}, 1500); // Di chuyển mỗi 1.5 giây

// Di chuyển nút khi chuột gần
document.addEventListener("mousemove", (e) => {
  if (!exitPopup.classList.contains("show")) {
    const btnRect = exitBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(e.clientX - btnCenterX, 2) + 
      Math.pow(e.clientY - btnCenterY, 2)
    );
    
    // Nếu chuột gần nút (trong vòng 100px), di chuyển nút
    if (distance < 100) {
      moveExitButton();
    }
  }
});

closePopupBtn.addEventListener("click", () => {
  popup.classList.remove("show");
  stopFireworks();
});