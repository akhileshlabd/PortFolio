// Portfolio Website JavaScript - ENHANCED VERSION

document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Hero section elements to hide/show
    const heroContent = document.querySelector('.hero__content');
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    const heroTagline = document.querySelector('.hero__tagline');
    const heroActions = document.querySelector('.hero__actions');

    // Skill cards
    const skillCards = document.querySelectorAll('.skill-card');

    // Contact form
    const contactForm = document.getElementById('contact-form');

    const navOverlay = document.getElementById('nav-overlay');

    // Mobile navigation drawer controls
    function closeMobileMenu() {
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            if (navOverlay) navOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    function openMobileMenu() {
        if (navMenu && navToggle) {
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            if (navOverlay) navOverlay.classList.add('active');
            document.body.classList.add('menu-open');
        }
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close mobile menu when clicking backdrop overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMobileMenu);
        }

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMobileMenu();
        });

        // Close on resize if expanded to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) closeMobileMenu();
        });
    }

    // Header scroll effect
    function handleScroll() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Smooth scrolling for navigation links - FIXED
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId && targetId !== '#') {
                if (targetId === '#home') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }

                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - headerHeight - 10;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active navigation link highlighting on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + (header ? header.offsetHeight : 80) + 80;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink(); // Initial call

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Animate skill bars when they come into view
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCard = entry.target;
                const progressBar = skillCard.querySelector('.skill-card__progress');
                const level = skillCard.getAttribute('data-level');

                skillCard.classList.add('animate');

                // Animate progress bar
                if (progressBar && level) {
                    progressBar.style.setProperty('--progress-width', level + '%');
                    progressBar.style.width = level + '%';
                }

                skillObserver.unobserve(skillCard);
            }
        });
    }, observerOptions);

    skillCards.forEach(card => {
        skillObserver.observe(card);
    });

    // General fade-in animation for other elements
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in animation to project cards, experience cards, cert cards and other elements
    const animatedElements = document.querySelectorAll('.project-card, .about__detail, .contact__item, .experience-card, .cert-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });

    // Contact form handling - sends message directly to Akhilesh's inbox via Formspree
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();

            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                const response = await fetch(contactForm.action || 'https://formspree.io/f/meaobvwb', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showNotification('Thank you, ' + name + '! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data && data.errors && data.errors.length) {
                        const errorMsg = data.errors.map(err => err.message).join(', ');
                        showNotification(errorMsg, 'error');
                    } else {
                        showNotification('Failed to send message. Please reach out to akhileshlabd@gmail.com directly.', 'error');
                    }
                }
            } catch (err) {
                showNotification('Network error. Please email akhileshlabd@gmail.com directly.', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system - FIXED with better styling
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;

        const colors = {
            success: { bg: '#10b981', text: '#ffffff' },
            error: { bg: '#ef4444', text: '#ffffff' },
            info: { bg: '#3b82f6', text: '#ffffff' },
            warning: { bg: '#f59e0b', text: '#ffffff' }
        };

        const color = colors[type] || colors.info;

        notification.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            ">
                <span style="flex: 1;">${message}</span>
                <button onclick="this.closest('.notification').remove()" style="
                    background: none;
                    border: none;
                    color: ${color.text};
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
        `;

        // Apply comprehensive styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '10000',
            padding: '16px 20px',
            borderRadius: '8px',
            backgroundColor: color.bg,
            color: color.text,
            fontWeight: '500',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateX(400px)',
            transition: 'all 0.3s ease',
            maxWidth: '400px',
            minWidth: '300px'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Performance optimization: debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debouncing to scroll handlers
    const debouncedScroll = debounce(() => {
        handleScroll();
        updateActiveNavLink();
    }, 10);

    window.addEventListener('scroll', debouncedScroll);

    // Handle window resize
    window.addEventListener('resize', function() {
        // Close mobile menu on resize
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }

        // Update active nav link and hero visibility
        updateActiveNavLink();
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // --------------------------------------------------------------------------
    // Magic Interactive Cursor & Stardust Trail (Desktop Only)
    // --------------------------------------------------------------------------
    function initMagicCursor() {
        // Strict guard: only enable on devices with fine pointer (mouse/trackpad, not touch)
        if (!window.matchMedia('(pointer: fine)').matches) return;

        // Create DOM elements dynamically
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';

        const ring = document.createElement('div');
        ring.className = 'cursor-ring';

        const canvas = document.createElement('canvas');
        canvas.id = 'cursor-sparkle-canvas';

        document.body.appendChild(canvas);
        document.body.appendChild(ring);
        document.body.appendChild(dot);

        const ctx = canvas.getContext('2d');
        let dpr = window.devicePixelRatio || 1;

        function resizeCanvas() {
            dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Coordinates & tracking
        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        let isVisible = false;
        let lastSpawnX = -100;
        let lastSpawnY = -100;

        // Sparkle particles array
        const particles = [];
        const sparkleColors = ['#21808d', '#32b8c6', '#e68161', '#ffd166', '#ffffff'];

        class SparkleParticle {
            constructor(x, y, vx, vy, size, color, maxLife, shape) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.size = size;
                this.color = color;
                this.maxLife = maxLife || (25 + Math.random() * 20);
                this.life = this.maxLife;
                this.rotation = Math.random() * Math.PI * 2;
                this.vRot = (Math.random() - 0.5) * 0.12;
                this.shape = shape || (Math.random() > 0.35 ? 'star' : 'circle');
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.02; // very gentle gravity/float
                this.vx *= 0.98; // slight drag
                this.rotation += this.vRot;
                this.life -= 1;
            }

            draw(context) {
                const alpha = Math.max(0, this.life / this.maxLife);
                context.save();
                context.translate(this.x, this.y);
                context.rotate(this.rotation);
                context.globalAlpha = alpha;
                context.fillStyle = this.color;
                context.shadowBlur = 6;
                context.shadowColor = this.color;

                const currentSize = this.size * (0.35 + 0.65 * alpha);

                if (this.shape === 'star') {
                    // 4-pointed diamond sparkle
                    context.beginPath();
                    const spikes = 4;
                    const outerRadius = currentSize;
                    const innerRadius = currentSize * 0.22;
                    let rot = (Math.PI / 2) * 3;
                    const step = Math.PI / spikes;

                    context.moveTo(0, -outerRadius);
                    for (let i = 0; i < spikes; i++) {
                        context.lineTo(Math.cos(rot) * outerRadius, Math.sin(rot) * outerRadius);
                        rot += step;
                        context.lineTo(Math.cos(rot) * innerRadius, Math.sin(rot) * innerRadius);
                        rot += step;
                    }
                    context.lineTo(0, -outerRadius);
                    context.closePath();
                    context.fill();
                } else {
                    // Soft glowing circle
                    context.beginPath();
                    context.arc(0, 0, currentSize * 0.6, 0, Math.PI * 2);
                    context.fill();
                }

                context.restore();
            }
        }

        function spawnSparkle(x, y, count = 1, burst = false) {
            for (let i = 0; i < count; i++) {
                const angle = burst ? (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5 : Math.random() * Math.PI * 2;
                const speed = burst ? 1.5 + Math.random() * 3.5 : 0.3 + Math.random() * 1.2;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed - (burst ? 0.4 : 0.15);
                const size = burst ? 3 + Math.random() * 4 : 2 + Math.random() * 3.5;
                const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
                particles.push(new SparkleParticle(x, y, vx, vy, size, color, burst ? 35 + Math.random() * 20 : 25 + Math.random() * 15));
            }
            if (particles.length > 120) {
                particles.splice(0, particles.length - 120);
            }
        }

        // Track mouse position
        window.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) {
                isVisible = true;
                dot.classList.add('is-visible');
                ring.classList.add('is-visible');
                ringX = mouseX;
                ringY = mouseY;
            }

            // Dot follows precisely
            dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

            // Distance-based particle spawn
            const dx = mouseX - lastSpawnX;
            const dy = mouseY - lastSpawnY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 12) {
                spawnSparkle(mouseX + (Math.random() - 0.5) * 6, mouseY + (Math.random() - 0.5) * 6, Math.random() > 0.4 ? 1 : 2);
                lastSpawnX = mouseX;
                lastSpawnY = mouseY;
            }
        });

        // Magical click burst
        window.addEventListener('mousedown', function(e) {
            ring.classList.add('cursor-ring--active');
            spawnSparkle(e.clientX, e.clientY, 8, true);
        });

        window.addEventListener('mouseup', function() {
            ring.classList.remove('cursor-ring--active');
        });

        // Interactive hover detection
        const interactiveSelector = 'a, button, input, textarea, select, .btn, .skill-card, .project-card, .cert-card, .experience-card, .contact__item, [role="button"]';

        document.addEventListener('mouseover', function(e) {
            if (e.target && e.target.closest(interactiveSelector)) {
                ring.classList.add('cursor-ring--hover');
                dot.classList.add('cursor-dot--hover');
            }
        });

        document.addEventListener('mouseout', function(e) {
            if (e.target && e.target.closest(interactiveSelector)) {
                const related = e.relatedTarget;
                if (!related || !related.closest(interactiveSelector)) {
                    ring.classList.remove('cursor-ring--hover');
                    dot.classList.remove('cursor-dot--hover');
                }
            }
        });

        // Window boundary detection
        document.addEventListener('mouseleave', function() {
            isVisible = false;
            dot.classList.remove('is-visible');
            ring.classList.remove('is-visible');
        });

        document.addEventListener('mouseenter', function() {
            isVisible = true;
            dot.classList.add('is-visible');
            ring.classList.add('is-visible');
        });

        // Animation loop for ring smooth lerp and sparkle canvas
        function animate() {
            // Ring smooth trailing lerp
            if (isVisible) {
                ringX += (mouseX - ringX) * 0.18;
                ringY += (mouseY - ringY) * 0.18;
                ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0)`;
            }

            // Render particles
            ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(ctx);
                if (p.life <= 0) {
                    particles.splice(i, 1);
                }
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    // Initialize magic cursor
    initMagicCursor();

    console.log('Akhilesh Lalkumar Portfolio - Enhanced with Magic Cursor! ✨');
});
