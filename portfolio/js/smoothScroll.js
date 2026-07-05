/* ========================================
   SMOOTH SCROLL SYSTEM
   ======================================== */

class SmoothScroller {
    constructor() {
        this.isScrolling = false;
        this.scrollVelocity = 0;
        this.scrollSpeed = 0.1;
        this.init();
    }

    init() {
        // Use native smooth scroll for most browsers
        document.documentElement.style.scrollBehavior = 'smooth';

        // Add smooth scroll indicator
        this.createScrollProgressBar();
        this.setupScrollListeners();
    }

    createScrollProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.id = 'scrollProgress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #00d4ff, #a100f2, #ff006e);
            z-index: 999;
            width: 0%;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
    }

    setupScrollListeners() {
        window.addEventListener('scroll', () => this.updateScrollProgress(), { passive: true });
        window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: true });
    }

    updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        const progressBar = document.getElementById('scrollProgress');
        
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    }

    handleWheel(e) {
        // Prevent default smooth scroll for custom implementation
        // This can be enhanced with inertial scrolling if needed
    }

    smoothScrollTo(target, duration = 1000) {
        const targetPosition = typeof target === 'number' 
            ? target 
            : target.offsetTop;

        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-in-out-cubic)
            const easeProgress = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startPosition + distance * easeProgress);

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    // Parallax scrolling effect
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        window.addEventListener('scroll', () => {
            parallaxElements.forEach(element => {
                const scrollPosition = window.scrollY;
                const elementOffset = element.offsetTop;
                const windowHeight = window.innerHeight;

                if (scrollPosition + windowHeight > elementOffset) {
                    const distance = scrollPosition - elementOffset + windowHeight;
                    const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                    element.style.transform = `translateY(${distance * speed * 0.1}px)`;
                }
            });
        }, { passive: true });
    }

    // Scroll snap sections
    setupScrollSnap() {
        const sections = document.querySelectorAll('section');
        let isScrolling = false;
        let scrollTimeout;

        window.addEventListener('wheel', (e) => {
            if (isScrolling) {
                e.preventDefault();
                return;
            }

            isScrolling = true;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }, { passive: false });
    }
}

// Initialize smooth scroller
document.addEventListener('DOMContentLoaded', () => {
    const scroller = new SmoothScroller();
    scroller.setupParallax();

    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                scroller.smoothScrollTo(target.offsetTop - 80, 800);
            }
        });
    });
});

// Export for use in other modules
window.SmoothScroller = SmoothScroller;

/* ========== SCROLL PHYSICS ENGINE ========== */
class ScrollPhysics {
    constructor() {
        this.velocity = 0;
        this.position = window.scrollY;
        this.targetPosition = window.scrollY;
        this.friction = 0.92;
        this.acceleration = 0.08;

        this.init();
    }

    init() {
        window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
        this.animate();
    }

    onWheel(e) {
        e.preventDefault();
        this.velocity += e.deltaY * this.acceleration;
    }

    onTouchMove(e) {
        // Handle touch scrolling
    }

    animate() {
        this.velocity *= this.friction;
        this.position += this.velocity;

        // Clamp position
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        this.position = Math.max(0, Math.min(this.position, maxScroll));

        window.scrollTo(0, this.position);
        requestAnimationFrame(() => this.animate());
    }
}

// Optional: Uncomment to enable physics-based scrolling
// document.addEventListener('DOMContentLoaded', () => {
//     const scrollPhysics = new ScrollPhysics();
// });
