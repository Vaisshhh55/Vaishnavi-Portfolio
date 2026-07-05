/* ========================================
   MAIN APPLICATION LOGIC
   ======================================== */

// ========== DOM ELEMENTS ==========
const loadingScreen = document.getElementById('loadingScreen');
const navMenu = document.querySelector('.nav-menu');
const navToggle = document.querySelector('.nav-toggle');
const contactForm = document.getElementById('contactForm');
const backToTopBtn = document.getElementById('backToTop');

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2000);

    initializeAnimations();
    initializeNavigation();
    initializeCounters();
    initializeProgressBars();
    initializeScrollEffects();
    initializeContactForm();
    initializeBackToTop();
    initializeTypingAnimation();
});

// ========== TYPING ANIMATION ==========
function initializeTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    const texts = [
        'Data Analyst & AI/ML Enthusiast',
        'Problem Solver & Innovator',
        'Building Intelligent Solutions',
        'Passionate Developer'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentText = texts[textIndex];
        const typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex < currentText.length) {
            typingElement.textContent += currentText[charIndex];
            charIndex++;
            setTimeout(typeText, typingSpeed);
        } else if (isDeleting && charIndex > 0) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeText, typingSpeed);
        } else if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeText, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(typeText, 500);
        }
    }

    typeText();
}

// ========== NAVIGATION TOGGLE ==========
function initializeNavigation() {
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        }
    });
}

// ========== COUNTER ANIMATION ==========
function initializeCounters() {
    const counters = document.querySelectorAll('[data-target]');
    
    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        
        const updateCount = () => {
            if (current < target) {
                current += increment;
                element.textContent = Math.floor(current);
                setTimeout(updateCount, 30);
            } else {
                element.textContent = target;
            }
        };

        updateCount();
    };

    // Intersect Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ========== PROGRESS BARS ==========
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.circular-progress');

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                const progress = parseInt(entry.target.getAttribute('data-progress'));
                
                // Calculate stroke-dashoffset
                const circumference = 282.74;
                const offset = circumference - (progress / 100) * circumference;
                
                entry.target.classList.add('active');
                progressBar.style.strokeDashoffset = offset;
                
                progressObserver.unobserve(entry.target);
            }
        });
    });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// ========== SCROLL REVEAL EFFECTS ==========
function initializeScrollEffects() {
    const revealElements = document.querySelectorAll('section, .project-case-study, .certificate-card, .achievement-item, .education-item');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
                
                // Stagger child animations
                const children = entry.target.querySelectorAll('.skill-item, .concept-tag, .achievement-item');
                children.forEach((child, index) => {
                    child.classList.add('reveal-stagger');
                    child.style.animationDelay = `${index * 0.1}s`;
                    child.classList.add('active');
                });
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// ========== CONTACT FORM HANDLING ==========
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Display success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// ========== NOTIFICATION ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ffa3' : '#00d4ff'};
        color: #0a0e27;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease reverse';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ========== BACK TO TOP BUTTON ==========
function initializeBackToTop() {
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========== ANIMATIONS INITIALIZATION ==========
function initializeAnimations() {
    // Add animation delay to elements
    const animationElements = document.querySelectorAll('.skill-item, .concept-tag, .achievement-item');
    
    animationElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });

    // Parallax effect
    initializeParallax();

    // Tilt effect on cards
    initializeTilt();

    // Magnetic button effect
    initializeMagneticEffect();
}

// ========== PARALLAX EFFECT ==========
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrollPosition = window.scrollY;
            const elementOffset = element.offsetTop;
            const distance = scrollPosition - elementOffset;
            const speed = element.getAttribute('data-parallax') || 0.5;

            element.style.transform = `translateY(${distance * speed}px)`;
        });
    });
}

// ========== TILT EFFECT ==========
function initializeTilt() {
    const tiltElements = document.querySelectorAll('.certificate-card, .virtual-card, .project-case-study');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ========== MAGNETIC BUTTON EFFECT ==========
function initializeMagneticEffect() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const distX = (x - centerX) * 0.1;
            const distY = (y - centerY) * 0.1;

            button.style.transform = `translate(${distX}px, ${distY}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ========== DYNAMIC NAVBAR BACKGROUND ==========
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// ========== ACTIVE NAV LINK ==========
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// ========== SMOOTH SCROLL BEHAVIOR ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== KEYBOARD NAVIGATION ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    }
});

// ========== ACCESSIBILITY - FOCUS VISIBLE ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-focus');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-focus');
});

// ========== PAGE VISIBILITY HANDLER ==========
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        document.body.style.opacity = '1';
    } else {
        // Resume animations
        document.body.style.opacity = '1';
    }
});

// ========== PERFORMANCE OPTIMIZATION ==========
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (mediaQuery.matches) {
    document.documentElement.style.setProperty('--transition-base', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
}

// ========== ERROR HANDLING ==========
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// ========== WINDOW RESIZE HANDLER ==========
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-initialize tilt on resize
        initializeTilt();
    }, 250);
});

// ========== EXPORT FUNCTIONS FOR EXTERNAL USE ==========
window.portfolioApp = {
    showNotification,
    initializeAnimations,
    initializeCounters,
    initializeProgressBars
};

console.log('%c Portfolio Loaded Successfully! ', 'background: linear-gradient(135deg, #00d4ff, #ff006e); color: #0a0e27; padding: 10px; border-radius: 5px; font-weight: bold; font-size: 14px;');
