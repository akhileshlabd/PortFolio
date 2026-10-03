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

    // Skill progress bar animation on view
    skillCards.forEach(card => {
        skillObserver.observe(card);
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


    // --------------------------------------------------------------------------
    // Modern Feature 1b: Classic Stable Section Reveal (Zero Dimming While Reading)
    // --------------------------------------------------------------------------
    const contentSections = document.querySelectorAll('section:not(.hero)');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                entry.target.classList.add('is-active');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    contentSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --------------------------------------------------------------------------
    // Modern Feature 2: Scroll Progress Bar
    // --------------------------------------------------------------------------
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    function updateScrollProgressBar() {
        if (!scrollProgressBar) return;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) {
            scrollProgressBar.style.width = '0%';
            return;
        }
        const pct = Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100));
        scrollProgressBar.style.width = pct.toFixed(1) + '%';
    }

    // --------------------------------------------------------------------------
    // Modern Feature 3: Floating Back-To-Top Button
    // --------------------------------------------------------------------------
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function updateBackToTopButton() {
        if (!backToTopBtn) return;
        if (window.scrollY > 380) {
            backToTopBtn.classList.add('is-visible');
        } else {
            backToTopBtn.classList.remove('is-visible');
        }
    }

    // --------------------------------------------------------------------------
    // High-Performance Unified RAF Scroll Engine
    // --------------------------------------------------------------------------
    let isScrollTicking = false;
    function onUnifiedScroll() {
        if (!isScrollTicking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                updateActiveNavLink();
                updateScrollProgressBar();
                updateBackToTopButton();
                isScrollTicking = false;
            });
            isScrollTicking = true;
        }
    }

    window.addEventListener('scroll', onUnifiedScroll, { passive: true });
    onUnifiedScroll(); // Run immediately on load

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
        onUnifiedScroll();
    });

    // --------------------------------------------------------------------------
    // Easter Eggs System: Toast Helper & Interactive Triggers
    // --------------------------------------------------------------------------
    function showEasterEggToast(icon, title, desc, duration = 6500) {
        const toast = document.getElementById('easter-egg-toast');
        const toastIcon = document.getElementById('easter-egg-toast-icon');
        const toastTitle = document.getElementById('easter-egg-toast-title');
        const toastDesc = document.getElementById('easter-egg-toast-desc');
        const toastClose = document.getElementById('easter-egg-toast-close');

        if (!toast) return;

        if (toastIcon) toastIcon.textContent = icon;
        if (toastTitle) toastTitle.textContent = title;
        if (toastDesc) toastDesc.textContent = desc;

        toast.classList.add('is-active');

        if (toastClose) {
            toastClose.onclick = () => {
                toast.classList.remove('is-active');
            };
        }

        clearTimeout(window._easterEggTimeout);
        window._easterEggTimeout = setTimeout(() => {
            toast.classList.remove('is-active');
        }, duration);
    }

    // Easter Egg 1: The Konami Code ("Super Trailblazer Mode")
    // Keys: ↑ ↑ ↓ ↓ ← → ← → B A
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    function activateSuperTrailblazerMode() {
        document.body.classList.add('super-trailblazer-mode');
        showEasterEggToast(
            '⚡',
            'SUPER TRAILBLAZER DEV MODE! 🚀',
            'Salesforce Flows, LWC, and Apex running at 1000% overclock! Cosmic aura active on cards for 10s.'
        );

        clearTimeout(window._superModeTimeout);
        window._superModeTimeout = setTimeout(() => {
            document.body.classList.remove('super-trailblazer-mode');
        }, 10000);
    }

    document.addEventListener('keydown', function(e) {
        // Escape closes mobile menu
        if (e.key === 'Escape') {
            closeMobileMenu();
        }

        // Konami detection
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        const expectedKey = konamiCode[konamiIndex].length === 1 ? konamiCode[konamiIndex].toLowerCase() : konamiCode[konamiIndex];

        if (key === expectedKey) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                activateSuperTrailblazerMode();
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Easter Egg 2: Clicking Akhilesh's Name 5 Times Rapidly
    const heroTitleElement = document.getElementById('hero-title') || document.querySelector('.hero__title');
    if (heroTitleElement) {
        let nameClickCount = 0;
        let nameClickTimer = null;

        heroTitleElement.addEventListener('click', function(e) {
            nameClickCount++;
            clearTimeout(nameClickTimer);

            // Tactile feedback
            heroTitleElement.style.transform = 'scale(0.97)';
            setTimeout(() => { heroTitleElement.style.transform = ''; }, 120);

            if (nameClickCount >= 5) {
                nameClickCount = 0;
                heroTitleElement.classList.add('gold-shimmer');

                showEasterEggToast(
                    '🏆',
                    'Code Detective Achievement Unlocked!',
                    'You clicked Akhilesh 5 times! Certified Salesforce Mastermind aura unlocked.'
                );

                setTimeout(() => {
                    heroTitleElement.classList.remove('gold-shimmer');
                }, 6000);
            } else {
                nameClickTimer = setTimeout(() => {
                    nameClickCount = 0;
                }, 2200);
            }
        });
    }

    // Easter Egg 3: Interactive Developer Console API
    window.akhilesh = {
        help: function() {
            console.log(
                '%c⚡ Akhilesh Developer Console Commands:\n' +
                ' • akhilesh.superMode()   - Toggle Super Trailblazer cosmic card auras\n' +
                ' • akhilesh.skills()      - Inspect full architectural skill matrix\n' +
                ' • akhilesh.contact()     - Quick direct channels',
                'color: #21808d; font-weight: bold; font-size: 13px;'
            );
            return 'Ready for input. Try one of the commands above!';
        },
        superMode: function() {
            activateSuperTrailblazerMode();
            return '⚡ Super Trailblazer Mode toggled!';
        },
        skills: function() {
            console.table([
                { 'Domain': 'Salesforce Core', 'Focus': 'Apex, Triggers, Batch/Queueable, Asynchronous Apex, Governor Limits' },
                { 'Domain': 'Modern Frontend', 'Focus': 'Lightning Web Components (LWC), Experience Cloud, Aura, Responsive UI' },
                { 'Domain': 'Platform Automation', 'Focus': 'Advanced Flow Architectures, Field Service Lightning (FSL), Integration' },
                { 'Domain': 'Enterprise Governance', 'Focus': 'Large Data Volumes, Security Matrix, Code Quality, CI/CD pipelines' }
            ]);
            return '5+ Years of Proven Architecture.';
        },
        contact: function() {
            console.log(
                '%c📬 Get In Touch With Akhilesh:\nEmail: akhileshlabd@gmail.com\nLinkedIn: https://linkedin.com/in/akhilesh-lalkumar\nLocation: Kochi, India (EY GDS)',
                'color: #21808d; font-weight: bold;'
            );
            return 'Looking forward to connecting!';
        }
    };

    console.log(
        '%c⚡ AKHILESH LALKUMAR | Senior Salesforce Consultant & Developer\n' +
        '%cLooking under the hood? Try these interactive console commands:\n' +
        ' 👉 akhilesh.help()        - List secret commands\n' +
        ' 👉 akhilesh.superMode()   - Toggle cosmic card aura\n' +
        ' 👉 akhilesh.skills()      - Inspect architectural matrix\n' +
        ' 👉 akhilesh.contact()     - Direct contact info',
        'color: #21808d; font-size: 15px; font-weight: bold; padding: 4px 0;',
        'color: #13343b; font-size: 12px; font-family: monospace; line-height: 1.6;'
    );

    console.log('Akhilesh Lalkumar Portfolio loaded successfully.');
});
