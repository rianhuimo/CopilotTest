// ==================== Particle System ====================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const PIXELS_PER_PARTICLE = 15000; // Density: one particle per 15000 pixels
        const particleCount = Math.min(100, Math.floor((this.canvas.width * this.canvas.height) / PIXELS_PER_PARTICLE));
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        this.ctx.strokeStyle = isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)';
        this.ctx.fillStyle = isDark ? 'rgba(102, 126, 234, 0.6)' : 'rgba(102, 126, 234, 0.4)';
        
        this.particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    particle.x -= dx / distance * 1;
                    particle.y -= dy / distance * 1;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ==================== Theme Toggle ====================
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const icon = this.themeToggle.querySelector('.theme-icon');
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ==================== Smooth Scrolling ====================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ==================== Navbar Scroll Effect ====================
class NavbarScroll {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }
}

// ==================== Mobile Menu ====================
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileMenuToggle');
        this.menu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        this.toggle.addEventListener('click', () => {
            this.menu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.menu.classList.remove('active');
            });
        });
    }
}

// ==================== Scroll Animations ====================
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-card, .ai-card, .gallery-item').forEach(el => {
            observer.observe(el);
        });
    }
}

// ==================== Stats Counter ====================
class StatsCounter {
    constructor() {
        this.animated = false;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateCounters();
                    this.animated = true;
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const originalText = counter.textContent;
            const hasPercent = originalText.includes('%');
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString() + (hasPercent ? '%' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString() + (hasPercent ? '%' : '');
                }
            };

            updateCounter();
        });
    }
}

// ==================== Neural Network Visualization ====================
class NeuralNetworkViz {
    constructor() {
        this.canvas = document.getElementById('neuralCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.init();
    }

    init() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.createNetwork();
        this.animate();

        document.getElementById('trainNetworkBtn')?.addEventListener('click', () => {
            this.train();
        });
    }

    createNetwork() {
        const layers = [4, 6, 6, 3];
        const spacing = this.canvas.width / (layers.length + 1);
        
        layers.forEach((nodeCount, layerIndex) => {
            const layerNodes = [];
            const verticalSpacing = this.canvas.height / (nodeCount + 1);
            
            for (let i = 0; i < nodeCount; i++) {
                layerNodes.push({
                    x: spacing * (layerIndex + 1),
                    y: verticalSpacing * (i + 1),
                    activation: Math.random()
                });
            }
            this.nodes.push(layerNodes);
        });

        // Create connections
        for (let i = 0; i < this.nodes.length - 1; i++) {
            this.nodes[i].forEach(node => {
                this.nodes[i + 1].forEach(nextNode => {
                    this.connections.push({
                        from: node,
                        to: nextNode,
                        weight: Math.random()
                    });
                });
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        // Draw connections
        this.connections.forEach(conn => {
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.x, conn.from.y);
            this.ctx.lineTo(conn.to.x, conn.to.y);
            this.ctx.strokeStyle = isDark 
                ? `rgba(102, 126, 234, ${conn.weight * 0.5})` 
                : `rgba(102, 126, 234, ${conn.weight * 0.3})`;
            this.ctx.lineWidth = conn.weight * 2;
            this.ctx.stroke();
        });

        // Draw nodes
        this.nodes.forEach(layer => {
            layer.forEach(node => {
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(102, 126, 234, ${node.activation})`;
                this.ctx.fill();
                this.ctx.strokeStyle = isDark ? '#667eea' : '#764ba2';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            });
        });

        requestAnimationFrame(() => this.animate());
    }

    train() {
        // Simulate training with random weight updates
        this.connections.forEach(conn => {
            conn.weight = Math.max(0.2, Math.min(1, conn.weight + (Math.random() - 0.5) * 0.3));
        });
        this.nodes.forEach(layer => {
            layer.forEach(node => {
                node.activation = Math.random();
            });
        });
    }
}

// ==================== Sentiment Analyzer ====================
class SentimentAnalyzer {
    constructor() {
        this.input = document.getElementById('sentimentInput');
        this.bar = document.getElementById('sentimentBar');
        this.text = document.getElementById('sentimentText');
        
        // Define sentiment word lists as class properties
        this.positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 
                             'love', 'happy', 'joy', 'perfect', 'best', 'awesome', 'brilliant'];
        this.negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'sad', 'angry', 
                             'worst', 'poor', 'disappointing', 'frustrating', 'annoying'];
        
        if (!this.input) return;
        this.init();
    }

    init() {
        this.input.addEventListener('input', () => this.analyze());
    }

    analyze() {
        const text = this.input.value.toLowerCase();
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        this.positiveWords.forEach(word => {
            if (text.includes(word)) positiveCount++;
        });
        
        this.negativeWords.forEach(word => {
            if (text.includes(word)) negativeCount++;
        });
        
        const total = positiveCount + negativeCount;
        let sentiment = 0.5; // Neutral
        
        if (total > 0) {
            sentiment = positiveCount / total;
        }
        
        // Update UI
        this.bar.style.width = (sentiment * 100) + '%';
        
        if (sentiment > 0.6) {
            this.text.textContent = '😊 Positive Sentiment';
            this.bar.style.background = 'linear-gradient(90deg, #43e97b, #38f9d7)';
        } else if (sentiment < 0.4) {
            this.text.textContent = '😞 Negative Sentiment';
            this.bar.style.background = 'linear-gradient(90deg, #fa709a, #fee140)';
        } else {
            this.text.textContent = '😐 Neutral Sentiment';
            this.bar.style.background = 'linear-gradient(90deg, #f093fb, #667eea)';
        }
    }
}

// ==================== Pattern Recognition Canvas ====================
class PatternRecognition {
    constructor() {
        this.canvas = document.getElementById('patternCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.drawing = false;
        this.patterns = ['Circle', 'Square', 'Triangle', 'Star', 'Heart'];
        this.init();
    }

    init() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
        
        // Touch support
        this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e.touches[0]));
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
        
        this.clearCanvas();
    }

    startDrawing(e) {
        this.drawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    }

    draw(e) {
        if (!this.drawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        
        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing() {
        if (this.drawing) {
            this.drawing = false;
            this.recognizePattern();
        }
    }

    recognizePattern() {
        // Simple pattern recognition simulation
        setTimeout(() => {
            const recognized = this.patterns[Math.floor(Math.random() * this.patterns.length)];
            
            this.ctx.fillStyle = 'rgba(102, 126, 234, 0.9)';
            this.ctx.font = 'bold 24px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`Detected: ${recognized}`, this.canvas.width / 2, 30);
            
            setTimeout(() => this.clearCanvas(), 2000);
        }, 500);
    }

    clearCanvas() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        this.ctx.fillStyle = isDark ? '#2d3748' : '#f7fafc';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
        this.ctx.font = '16px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Draw a pattern here', this.canvas.width / 2, this.canvas.height / 2);
    }
}

// ==================== Contact Form ====================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.status = document.getElementById('formStatus');
        
        if (!this.form) return;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simulate form submission
        this.status.className = 'form-status';
        this.status.textContent = 'Sending message...';
        this.status.style.display = 'block';
        
        setTimeout(() => {
            this.status.className = 'form-status success';
            this.status.textContent = `✓ Thank you ${name}! Your message has been sent successfully.`;
            this.form.reset();
            
            setTimeout(() => {
                this.status.style.display = 'none';
            }, 5000);
        }, 1500);
    }
}

// ==================== 3D Tilt Effect ====================
class TiltEffect {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
            card.addEventListener('mouseleave', () => this.resetTilt(card));
        });
    }

    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }

    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

// ==================== Initialize All Features ====================
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
    new ThemeManager();
    new SmoothScroll();
    new NavbarScroll();
    new MobileMenu();
    new ScrollAnimations();
    new StatsCounter();
    new NeuralNetworkViz();
    new SentimentAnalyzer();
    new PatternRecognition();
    new ContactForm();
    new TiltEffect();
    
    // Button click handlers
    document.getElementById('exploreBtn')?.addEventListener('click', () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('demoBtn')?.addEventListener('click', () => {
        document.getElementById('ai-showcase')?.scrollIntoView({ behavior: 'smooth' });
    });
});

// ==================== Service Worker Registration (PWA) ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            registration => console.log('ServiceWorker registered:', registration.scope),
            err => console.log('ServiceWorker registration failed:', err)
        ).catch(err => console.log('ServiceWorker error:', err));
    });
}
