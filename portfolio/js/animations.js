/* ========================================
   ANIMATIONS MODULE
   ======================================== */

class AnimationController {
    constructor() {
        this.animationQueue = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupMutationObserver();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: [0.1, 0.5],
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerElementAnimation(entry.target);
                }
            });
        }, options);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll(
            '[data-animate], .reveal, section, .project-case-study, ' +
            '.certificate-card, .achievement-item, .skill-item'
        );

        animatableElements.forEach(element => observer.observe(element));
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            this.setupIntersectionObserver();
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    triggerElementAnimation(element) {
        const animationType = element.getAttribute('data-animate') || 'fadeInUp';
        const delay = element.getAttribute('data-delay') || 0;
        const duration = element.getAttribute('data-duration') || 600;

        setTimeout(() => {
            this.animate(element, animationType, duration);
        }, delay);
    }

    animate(element, animationType, duration) {
        element.classList.add('reveal', 'active');
        element.style.animationDuration = duration + 'ms';

        if (animationType === 'pulse') {
            this.createPulseAnimation(element);
        } else if (animationType === 'bounce') {
            this.createBounceAnimation(element);
        } else if (animationType === 'flip') {
            this.createFlipAnimation(element);
        } else if (animationType === 'swing') {
            this.createSwingAnimation(element);
        }
    }

    createPulseAnimation(element) {
        element.style.animation = 'scalePulse 2s ease-in-out infinite';
    }

    createBounceAnimation(element) {
        element.style.animation = 'bounce 1s ease-in-out';
    }

    createFlipAnimation(element) {
        element.style.animation = 'flip 0.6s ease-in-out';
    }

    createSwingAnimation(element) {
        element.style.transformOrigin = 'top center';
        element.style.animation = 'swing 0.8s ease-in-out';
    }

    queueAnimation(element, callback, delay = 0) {
        setTimeout(() => {
            callback();
        }, delay);
    }

    staggerAnimation(elements, delay = 100) {
        elements.forEach((element, index) => {
            element.style.animationDelay = (index * delay) + 'ms';
        });
    }
}

// Scroll animation on hover
class HoverAnimationController {
    constructor() {
        this.init();
    }

    init() {
        const hoverElements = document.querySelectorAll(
            '.btn, .card, .project-case-study, .certificate-card, .virtual-card'
        );

        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => this.onHover(element));
            element.addEventListener('mouseleave', () => this.onHoverLeave(element));
        });
    }

    onHover(element) {
        element.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        element.style.transform = 'translateY(-5px)';
        element.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.2)';
    }

    onHoverLeave(element) {
        element.style.transform = 'translateY(0)';
    }
}

// Text animation controller
class TextAnimationController {
    constructor() {
        this.init();
    }

    init() {
        const textElements = document.querySelectorAll('[data-text-animate]');
        textElements.forEach(element => {
            this.setupTextAnimation(element);
        });
    }

    setupTextAnimation(element) {
        const text = element.textContent;
        const animationType = element.getAttribute('data-text-animate');

        if (animationType === 'split') {
            this.splitTextAnimation(element, text);
        } else if (animationType === 'wave') {
            this.waveTextAnimation(element, text);
        }
    }

    splitTextAnimation(element, text) {
        const chars = text.split('');
        element.textContent = '';

        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.animation = `slideUp 0.6s ease ${index * 0.05}s both`;
            element.appendChild(span);
        });
    }

    waveTextAnimation(element, text) {
        const chars = text.split('');
        element.textContent = '';

        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.animation = `float 0.8s ease-in-out ${index * 0.08}s infinite`;
            element.appendChild(span);
        });
    }
}

// Gradient animation controller
class GradientAnimationController {
    constructor() {
        this.init();
    }

    init() {
        const gradientElements = document.querySelectorAll('[data-gradient-animate]');
        
        gradientElements.forEach(element => {
            element.style.backgroundSize = '400% 400%';
            element.style.animation = 'gradient 15s ease infinite';
        });
    }

    updateGradient(element, colors) {
        const gradient = `linear-gradient(45deg, ${colors.join(', ')})`;
        element.style.background = gradient;
    }
}

// Scroll triggered animations
class ScrollTriggerAnimation {
    constructor() {
        this.init();
    }

    init() {
        const triggerElements = document.querySelectorAll('[data-scroll-trigger]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const event = entry.target.getAttribute('data-scroll-trigger');
                    this.triggerAnimation(entry.target, event);
                    observer.unobserve(entry.target);
                }
            });
        });

        triggerElements.forEach(element => observer.observe(element));
    }

    triggerAnimation(element, eventType) {
        if (eventType === 'counter') {
            this.startCounter(element);
        } else if (eventType === 'progress') {
            this.startProgress(element);
        }
    }

    startCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;

        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }

    startProgress(element) {
        const progress = parseInt(element.getAttribute('data-progress'));
        const progressBar = element.querySelector('.progress-bar');
        
        if (progressBar) {
            const circumference = 282.74;
            const offset = circumference - (progress / 100) * circumference;
            progressBar.style.strokeDashoffset = offset;
        }
    }
}

// Initialize all animation controllers
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
    new HoverAnimationController();
    new TextAnimationController();
    new GradientAnimationController();
    new ScrollTriggerAnimation();

    console.log('%c Animations Initialized! ', 'background: #00d4ff; color: #0a0e27; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
});

// Export controllers
window.AnimationController = AnimationController;
window.HoverAnimationController = HoverAnimationController;
window.TextAnimationController = TextAnimationController;
