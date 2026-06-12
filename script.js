document.addEventListener('DOMContentLoaded', () => {
    const startOverlay = document.getElementById('start-overlay');
    const startBtn = document.getElementById('start-btn');
    const bgMusic = document.getElementById('bg-music');

    // Confetti Setup
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const colors = ['#ff718d', '#fdff6a', '#74ff73', '#71c0ff', '#b471ff'];

    class Confetti {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 1 + 0.5; // slow speed
            this.speedX = Math.random() * 1 - 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > height) {
                this.y = -this.size;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    for (let i = 0; i < 70; i++) {
        particles.push(new Confetti());
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateConfetti);
    }

    // Bouncing Elements Setup
    class Bouncer {
        constructor(element, speedMultiplier = 1, isText = false) {
            this.element = element;
            this.isText = isText;
            this.x = Math.random() * (window.innerWidth - 300);
            this.y = Math.random() * (window.innerHeight - 200);
            
            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const baseSpeed = 3 * speedMultiplier;
            this.dx = Math.cos(angle) * baseSpeed;
            this.dy = Math.sin(angle) * baseSpeed;

            // Ensure not too vertical or horizontal
            if (Math.abs(this.dx) < 1) this.dx = this.dx > 0 ? 1 : -1;
            if (Math.abs(this.dy) < 1) this.dy = this.dy > 0 ? 1 : -1;

            if (this.isText) {
                this.changeColor();
            }
        }

        changeColor() {
            const h = Math.floor(Math.random() * 360);
            this.element.style.color = `hsl(${h}, 80%, 70%)`;
        }

        update() {
            const rect = this.element.getBoundingClientRect();
            let hit = false;

            // Check boundaries
            if (this.x + rect.width >= window.innerWidth) {
                this.dx = -Math.abs(this.dx);
                this.x = window.innerWidth - rect.width;
                hit = true;
            } else if (this.x <= 0) {
                this.dx = Math.abs(this.dx);
                this.x = 0;
                hit = true;
            }

            if (this.y + rect.height >= window.innerHeight) {
                this.dy = -Math.abs(this.dy);
                this.y = window.innerHeight - rect.height;
                hit = true;
            } else if (this.y <= 0) {
                this.dy = Math.abs(this.dy);
                this.y = 0;
                hit = true;
            }

            if (hit && this.isText) {
                this.changeColor();
            }

            this.x += this.dx;
            this.y += this.dy;

            this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        }
    }

    let bouncers = [];
    let animationId;

    function animateBouncers() {
        bouncers.forEach(b => b.update());
        animationId = requestAnimationFrame(animateBouncers);
    }

    // Wait for the start button click
    startBtn.addEventListener('click', () => {
        // Play music
        bgMusic.play().catch(e => console.log('Audio playback failed:', e));
        
        // Hide overlay
        startOverlay.style.opacity = '0';
        startOverlay.style.visibility = 'hidden';

        // Initialize bouncers
        const imgElement = document.getElementById('bounce-img');
        const textElement = document.getElementById('bounce-text');
        
        // Make sure elements start at top left for translation
        imgElement.style.top = '0';
        imgElement.style.left = '0';
        textElement.style.top = '0';
        textElement.style.left = '0';

        bouncers.push(new Bouncer(imgElement, 1.2, false));
        bouncers.push(new Bouncer(textElement, 1.5, true));

        // Start loops
        animateConfetti();
        animateBouncers();
    });
});
