class FallingTextEffect {
    constructor() {
        this.canvas = document.getElementById('textCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.letters = [];
        this.stars = [];
        this.mouse = { x: 0, y: 0, isDown: false };
        this.camera = { rotationX: 0, rotationY: 0, zoom: 1 };
        this.lastMouse = { x: 0, y: 0 };
        
        // Cài đặt cố định cho hiệu ứng nhẹ
        this.settings = {
            speed: 1,
            density: 60,
            fontSize: 14
        };

        // Mảng các cụm từ yêu thương và icon có ý nghĩa
        this.loveMessages = [
            { text: 'Anh yêu em', icon: '💕' },
            { text: 'Em yêu anh', icon: '❤️' },
            { text: 'Mãi mãi bên nhau', icon: '💖' },
            { text: 'Tình yêu vĩnh cửu', icon: '💞' },
            { text: 'Tim anh chỉ có em', icon: '💝' },
            { text: 'Em là cả thế giới', icon: '🌍' },
            { text: 'Yêu em nhiều lắm', icon: '💗' },
            { text: 'Một tình yêu đẹp', icon: '🌹' },
            { text: 'Hạnh phúc bên em', icon: '😊' },
            { text: 'Mơ về em mỗi đêm', icon: '🌙' },
            { text: 'Em là ánh sáng', icon: '⭐' },
            { text: 'Yêu em từ cái nhìn đầu', icon: '👀' },
            { text: 'Trái tim chỉ đập cho em', icon: '💓' },
            { text: 'Em là niềm vui', icon: '🎉' },
            { text: 'Cùng nhau già đi', icon: '👫' },
            { text: 'Tương lai có em', icon: '🔮' },
            { text: 'Ngày nào cũng nhớ', icon: '🥰' },
            { text: 'Em là định mệnh', icon: '🍀' },
            { text: 'Yêu em không lý do', icon: '💫' },
            { text: 'Bảo vệ em mãi mãi', icon: '🛡️' },
            { text: 'Cười cùng em mỗi ngày', icon: '😄' },
            { text: 'Em là thiên thần', icon: '😇' },
            { text: 'Yêu em như hơi thở', icon: '🌬️' },
            { text: 'Bình yên bên em', icon: '☮️' },
            { text: 'Nắm tay em đi khắp thế gian', icon: '🤝' },
            { text: 'Em làm anh hạnh phúc', icon: '🌈' },
            { text: 'Yêu em từng giây phút', icon: '⏰' },
            { text: 'Em là màu sắc cuộc đời', icon: '🎨' },
            { text: 'Cảm ơn em đã đến', icon: '🙏' },
            { text: 'Chỉ muốn ôm em thôi', icon: '🤗' }
        ];

        // Màu sắc tươi sáng để tương phản với nền tối
        this.colors = [
            '#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#FFB6C1', '#D7BDE2',
            '#A9DFBF', '#F9E79F', '#FFE4E1', '#AED6F1', '#A3E4D7',
            '#FF69B4', '#00CED1', '#FFD700', '#FF7F50', '#98FB98'
        ];

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.setupEventListeners();
        this.createLetters();
        this.createStars();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Tạo lại sao khi resize
        if (this.stars && this.stars.length > 0) {
            this.createStars();
        }
    }

    setupEventListeners() {
        // Resize
        window.addEventListener('resize', () => this.resizeCanvas());

        // Mouse events cho việc kéo thả
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.isDown = true;
            this.lastMouse.x = e.clientX;
            this.lastMouse.y = e.clientY;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.mouse.isDown) {
                const deltaX = e.clientX - this.lastMouse.x;
                const deltaY = e.clientY - this.lastMouse.y;
                
                this.camera.rotationY += deltaX * 0.01;
                this.camera.rotationX += deltaY * 0.01;
                
                // Giới hạn góc xoay
                this.camera.rotationX = Math.max(-Math.PI/3, Math.min(Math.PI/3, this.camera.rotationX));
                
                this.lastMouse.x = e.clientX;
                this.lastMouse.y = e.clientY;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.isDown = false;
        });

        // Touch events cho mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.mouse.isDown = true;
            this.lastMouse.x = touch.clientX;
            this.lastMouse.y = touch.clientY;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.mouse.isDown && e.touches[0]) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - this.lastMouse.x;
                const deltaY = touch.clientY - this.lastMouse.y;
                
                this.camera.rotationY += deltaX * 0.01;
                this.camera.rotationX += deltaY * 0.01;
                
                this.camera.rotationX = Math.max(-Math.PI/3, Math.min(Math.PI/3, this.camera.rotationX));
                
                this.lastMouse.x = touch.clientX;
                this.lastMouse.y = touch.clientY;
            }
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.mouse.isDown = false;
        });

        // Zoom với scroll
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.1;
            if (e.deltaY < 0) {
                this.camera.zoom = Math.min(3, this.camera.zoom + zoomSpeed);
            } else {
                this.camera.zoom = Math.max(0.3, this.camera.zoom - zoomSpeed);
            }
        });
    }

    createLetters() {
        this.letters = [];
        for (let i = 0; i < this.settings.density; i++) {
            this.letters.push(this.createLetter());
        }
    }

    createStars() {
        this.stars = [];
        // Tạo 200 sao cho hiệu ứng vũ trụ
        for (let i = 0; i < 200; i++) {
            this.stars.push(this.createStar());
        }
    }

    createStar() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            z: Math.random() * 2000 - 1000,
            size: Math.random() * 2 + 0.5,
            brightness: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            twinkle: 0
        };
    }

    createLetter() {
        const message = this.loveMessages[Math.floor(Math.random() * this.loveMessages.length)];
        return {
            text: message.text,
            icon: message.icon,
            x: Math.random() * this.canvas.width,
            y: Math.random() * -this.canvas.height,
            z: Math.random() * 800 - 400,
            speed: Math.random() * 0.8 + 0.5,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.005,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            opacity: Math.random() * 0.4 + 0.3,
            fontSize: Math.random() * 4 + this.settings.fontSize * 0.8
        };
    }

    projectPoint(x, y, z) {
        // Áp dụng rotation camera
        const cosRX = Math.cos(this.camera.rotationX);
        const sinRX = Math.sin(this.camera.rotationX);
        const cosRY = Math.cos(this.camera.rotationY);
        const sinRY = Math.sin(this.camera.rotationY);

        // Rotate around Y axis
        const x1 = x * cosRY + z * sinRY;
        const z1 = -x * sinRY + z * cosRY;

        // Rotate around X axis
        const y1 = y * cosRX - z1 * sinRX;
        const z2 = y * sinRX + z1 * cosRX;

        // Perspective projection
        const perspective = 500;
        const scale = perspective / (perspective + z2) * this.camera.zoom;

        return {
            x: x1 * scale + this.canvas.width / 2,
            y: y1 * scale + this.canvas.height / 2,
            scale: scale
        };
    }

    updateLetter(letter) {
        letter.y += letter.speed * this.settings.speed;
        letter.rotation += letter.rotationSpeed;

        // Reset vị trí khi chữ rơi ra khỏi màn hình
        if (letter.y > this.canvas.height + 100) {
            const message = this.loveMessages[Math.floor(Math.random() * this.loveMessages.length)];
            letter.y = Math.random() * -300 - 100;
            letter.x = Math.random() * this.canvas.width;
            letter.text = message.text;
            letter.icon = message.icon;
            letter.color = this.colors[Math.floor(Math.random() * this.colors.length)];
            letter.fontSize = Math.random() * 4 + this.settings.fontSize * 0.8;
        }
    }

    drawLetter(letter) {
        const projected = this.projectPoint(
            letter.x - this.canvas.width / 2,
            letter.y - this.canvas.height / 2,
            letter.z
        );

        // Chỉ vẽ những chữ trong tầm nhìn
        if (projected.x < -300 || projected.x > this.canvas.width + 300 ||
            projected.y < -100 || projected.y > this.canvas.height + 100) {
            return;
        }

        this.ctx.save();
        
        // Di chuyển đến vị trí của chữ
        this.ctx.translate(projected.x, projected.y);
        this.ctx.rotate(letter.rotation);
        
        // Tính toán kích thước dựa trên perspective
        const size = letter.fontSize * projected.scale;
        
        // Hiệu ứng glow rất nhẹ
        this.ctx.shadowColor = letter.color;
        this.ctx.shadowBlur = 4 * projected.scale;
        this.ctx.fillStyle = letter.color;
        this.ctx.globalAlpha = letter.opacity * Math.max(0.3, projected.scale);
        
        // Vẽ icon trước với khoảng cách đủ xa
        const iconSize = size * 0.8;
        this.ctx.font = `${iconSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Tính độ dài text để đặt icon phù hợp
        this.ctx.font = `500 ${size}px 'Open Sans', sans-serif`;
        const textWidth = this.ctx.measureText(letter.text).width;
        const iconX = -(textWidth / 2) - iconSize * 0.8;
        
        // Vẽ icon
        this.ctx.font = `${iconSize}px Arial`;
        this.ctx.fillText(letter.icon, iconX, 0);
        
        // Vẽ text với font nhẹ hơn
        this.ctx.font = `500 ${size}px 'Open Sans', sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(letter.text, 0, 0);
        
        this.ctx.restore();
    }

    updateStar(star) {
        star.twinkle += star.twinkleSpeed;
        if (star.twinkle > Math.PI * 2) star.twinkle = 0;
    }

    drawStar(star) {
        const projected = this.projectPoint(
            star.x - this.canvas.width / 2,
            star.y - this.canvas.height / 2,
            star.z
        );

        // Chỉ vẽ sao trong tầm nhìn
        if (projected.x < -50 || projected.x > this.canvas.width + 50 ||
            projected.y < -50 || projected.y > this.canvas.height + 50) {
            return;
        }

        this.ctx.save();
        
        // Tính toán độ sáng với hiệu ứng twinkle
        const twinkleBrightness = Math.sin(star.twinkle) * 0.3 + 0.7;
        const brightness = star.brightness * twinkleBrightness * Math.max(0.1, projected.scale);
        
        // Vẽ sao
        this.ctx.globalAlpha = brightness;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#ffffff';
        this.ctx.shadowBlur = 3 * projected.scale;
        
        const starSize = star.size * projected.scale;
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, starSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Thêm hiệu ứng tia sáng cho sao lớn
        if (starSize > 1) {
            this.ctx.globalAlpha = brightness * 0.3;
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(projected.x - starSize * 3, projected.y);
            this.ctx.lineTo(projected.x + starSize * 3, projected.y);
            this.ctx.moveTo(projected.x, projected.y - starSize * 3);
            this.ctx.lineTo(projected.x, projected.y + starSize * 3);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    animate() {
        // Clear canvas hoàn toàn không để lại đuôi
        this.ctx.fillStyle = '#0f0f23';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Vẽ sao trước (background)
        this.stars.forEach(star => {
            this.updateStar(star);
            this.drawStar(star);
        });

        // Cập nhật và vẽ tất cả chữ cái (foreground)
        this.letters.forEach(letter => {
            this.updateLetter(letter);
            this.drawLetter(letter);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Khởi tạo khi trang web load xong
document.addEventListener('DOMContentLoaded', () => {
    new FallingTextEffect();
});
