/**
 * Akhilesh Lalkumar Portfolio - Client Interactions & Enhancements
 * Optimized for Mobile Touch, Smooth Scrolling & Formspree AJAX
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav__link');
    const contactForm = document.getElementById('contact-form');
    const skillCards = document.querySelectorAll('.skill-card');

    // --------------------------------------------------------------------------
    // Mobile Drawer Navigation
    // --------------------------------------------------------------------------
    function openMenu() {
        if (!navMenu || !navToggle) return;
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navMenu && navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // Close on window resize if expanded to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // --------------------------------------------------------------------------
    // Sticky Header Scroll Effect
    // --------------------------------------------------------------------------
    function handleScroll() {
        if (!header) return;
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --------------------------------------------------------------------------
    // Smooth Scrolling with Fixed Header Offset
    // --------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const headerHeight = header ? header.offsetHeight : 72;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 16;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // --------------------------------------------------------------------------
    // Active Nav Link Spy
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollPosition = window.pageYOffset + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // --------------------------------------------------------------------------
    // Skill Bars Animation via Intersection Observer
    // --------------------------------------------------------------------------
    if ('IntersectionObserver' in window) {
        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const level = card.getAttribute('data-level');
                    const bar = card.querySelector('.skill-card__progress');
                    if (bar && level) {
                        bar.style.width = level + '%';
                    }
                    observer.unobserve(card);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -40px 0px'
        });

        skillCards.forEach(card => skillObserver.observe(card));
    } else {
        // Fallback for older browsers
        skillCards.forEach(card => {
            const level = card.getAttribute('data-level');
            const bar = card.querySelector('.skill-card__progress');
            if (bar && level) bar.style.width = level + '%';
        });
    }

    // --------------------------------------------------------------------------
    // Formspree AJAX Form Handling
    // --------------------------------------------------------------------------
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showNotification(message, type = 'success') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `notification notification--${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('active');
        });

        // Auto remove after 5s
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = (formData.get('name') || '').trim();
            const email = (formData.get('email') || '').trim();
            const message = (formData.get('message') || '').trim();

            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action || 'https://formspree.io/f/meaobvwb', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showNotification(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
                    contactForm.reset();
                } else {
                    const data = await response.json().catch(() => ({}));
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
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
