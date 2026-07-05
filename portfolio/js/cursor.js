/* ========================================
   CUSTOM CURSOR SYSTEM
   ======================================== */

class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('customCursor');
        this.cursorDot = document.getElementById('customCursorDot');

        if (!this.cursor || !this.cursorDot) {
            console.warn('Cursor elements not found');
            return;
        }

        this.position = { x: 0, y: 0 };
        this.targetPosition = { x: 0, y: 0 };
        this.speed = 0.3;
        this.isHovering = false;

        this.init();
    }

    init() {
        // Show custom cursor on non-touch devices
        if (!this.isTouchDevice()) {
            document.documentElement.style.cursor = 'none';
            this.cursor.style.display = 'block';
            this.cursorDot.style.display = 'block';

            document.addEventListener('mousemove', (e) => this.onMouseMove(e));
            document.addEventListener('mousedown', () => this.onMouseDown());
            document.addEventListener('mouseup', () => this.onMouseUp());
            document.addEventListener('mouseenter', () => this.onMouseEnter());
            document.addEventListener('mouseleave', () => this.onMouseLeave());

            // Hover on interactive elements
            this.setupInteractiveElements();

            // Animate cursor
            this.animate();
        }
    }

    isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }

    onMouseMove(e) {
        this.targetPosition.x = e.clientX;
        this.targetPosition.y = e.clientY;

        // Dot follows immediately
        this.cursorDot.style.left = (e.clientX - 4) + 'px';
        this.cursorDot.style.top = (e.clientY - 4) + 'px';
    }

    onMouseDown() {
        this.cursor.style.transform = 'scale(0.8)';
        this.cursorDot.style.opacity = '0.5';
    }

    onMouseUp() {
        this.cursor.style.transform = 'scale(1)';
        this.cursorDot.style.opacity = '1';
    }

    onMouseEnter() {
        this.cursor.style.opacity = '1';
        this.cursorDot.style.opacity = '1';
    }

    onMouseLeave() {
        this.cursor.style.opacity = '0';
        this.cursorDot.style.opacity = '0';
    }

    setupInteractiveElements() {
        const interactiveElements = document.querySelectorAll(
            'a, button, .btn, input, textarea, [onclick], .interactive'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => this.onHoverEnter(element));
            element.addEventListener('mouseleave', () => this.onHoverLeave(element));
        });
    }

    onHoverEnter(element) {
        this.isHovering = true;
        this.cursor.style.transform = 'scale(1.5) translateZ(0)';
        this.cursor.style.borderColor = 'rgba(0, 212, 255, 0.8)';
        this.cursor.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6)';
        this.cursorDot.style.transform = 'scale(1.5)';
    }

    onHoverLeave(element) {
        this.isHovering = false;
        this.cursor.style.transform = 'scale(1) translateZ(0)';
        this.cursor.style.borderColor = 'rgba(0, 212, 255, 1)';
        this.cursor.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
        this.cursorDot.style.transform = 'scale(1)';
    }

    animate() {
        // Smooth cursor following
        this.position.x += (this.targetPosition.x - this.position.x) * this.speed;
        this.position.y += (this.targetPosition.y - this.position.y) * this.speed;

        this.cursor.style.left = (this.position.x - 20) + 'px';
        this.cursor.style.top = (this.position.y - 20) + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const cursor = new CustomCursor();
});

// Export for use in other modules
window.CustomCursor = CustomCursor;
