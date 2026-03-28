// ===== FADE-IN ON SCROLL (Intersection Observer) =====
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));

// ===== NAVBAR SCROLL EFFECT =====
const nav = document.querySelector('.site-nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

// ===== SPARKLE EFFECT =====
const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas.getContext('2d');
let sparkles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Sparkle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        // Gold and warm tones
        const colors = [
            'rgba(201, 169, 110,',  // gold
            'rgba(224, 207, 166,',  // light gold
            'rgba(196, 134, 107,',  // terracotta
            'rgba(255, 255, 255,',  // white
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        if (this.life <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.life;

        // Draw a 4-point star
        ctx.beginPath();
        const s = this.size;
        ctx.moveTo(0, -s * 2);
        ctx.lineTo(s * 0.5, -s * 0.5);
        ctx.lineTo(s * 2, 0);
        ctx.lineTo(s * 0.5, s * 0.5);
        ctx.lineTo(0, s * 2);
        ctx.lineTo(-s * 0.5, s * 0.5);
        ctx.lineTo(-s * 2, 0);
        ctx.lineTo(-s * 0.5, -s * 0.5);
        ctx.closePath();

        ctx.fillStyle = this.color + this.life + ')';
        ctx.fill();
        ctx.restore();
    }
}

let mouseX = 0, mouseY = 0;
let sparkleCounter = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    sparkleCounter++;
    // Only spawn every 3rd move event for subtlety
    if (sparkleCounter % 3 === 0) {
        sparkles.push(new Sparkle(mouseX, mouseY));
    }
});

function animateSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparkles = sparkles.filter(s => s.life > 0);
    sparkles.forEach(s => {
        s.update();
        s.draw();
    });
    requestAnimationFrame(animateSparkles);
}

animateSparkles();
