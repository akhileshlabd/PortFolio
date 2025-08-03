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

    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Smooth scrolling for navigation links - FIXED
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ENHANCED: Hide hero content when About Me section is visible
    function handleHeroVisibility() {
        const aboutSection = document.getElementById('about');
        const heroSection = document.querySelector('.hero');

        if (aboutSection && heroSection) {
            const aboutRect = aboutSection.getBoundingClientRect();
            const heroRect = heroSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Check if About section is entering the viewport
            const aboutIsVisible = aboutRect.top < viewportHeight * 0.8;

            // Hide hero content when about section becomes visible
            if (aboutIsVisible && heroContent) {
                heroContent.style.opacity = '0';
                heroContent.style.transform = 'translateY(-30px)';
                heroContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            } else if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
                heroContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        }
    }

    // Active navigation link highlighting with hero content management
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + (header ? header.offsetHeight : 80) + 100;

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

        // Also handle hero visibility
        handleHeroVisibility();
    }

    window.addEventListener('scroll', updateActiveNavLink);
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

    // Apply fade-in animation to project cards and other elements
    const animatedElements = document.querySelectorAll('.project-card, .about__detail, .contact__item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });

    // Contact form handling - FIXED
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
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

            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate API call delay
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                contactForm.reset();

                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
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

    console.log('Akhilesh Lalkumar Portfolio - Enhanced with Hero Content Management! 🚀');
});
