/* ========================================
   PARTICLE SYSTEM ANIMATION
   ======================================== */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn('Canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };

        this.setCanvasSize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.setCanvasSize());
        document.addEventListener('mousemove', (e) => this.updateMouse(e));
        document.addEventListener('touchmove', (e) => this.updateTouch(e));
    }

    setCanvasSize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.min(Math.floor(this.canvas.width / 100), 50);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: this.getRandomColor(),
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(0, 212, 255, ',
            'rgba(161, 0, 242, ',
            'rgba(255, 0, 110, ',
            'rgba(0, 255, 163, '
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateMouse(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    updateTouch(e) {
        if (e.touches.length > 0) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }
    }

    update() {
        for (let particle of this.particles) {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if (particle.x - particle.radius < 0 || particle.x + particle.radius > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(particle.radius, Math.min(this.canvas.width - particle.radius, particle.x));
            }

            if (particle.y - particle.radius < 0 || particle.y + particle.radius > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(particle.radius, Math.min(this.canvas.height - particle.radius, particle.y));
            }

            // Add some gravity-like effect
            particle.vy += 0.05;

            // Slow down slightly (friction)
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        }
    }

    draw() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];

            // Calculate distance to mouse
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 150;

            // Mouse interaction
            if (distance < maxDistance) {
                const angle = Math.atan2(dy, dx);
                const force = (maxDistance - distance) / maxDistance * 2;
                particle.vx += Math.cos(angle) * force;
                particle.vy += Math.sin(angle) * force;
            }

            // Draw particle
            this.ctx.fillStyle = particle.color + particle.opacity + ')';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx2 = other.x - particle.x;
                const dy2 = other.y - particle.y;
                const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                const maxConnectionDistance = 150;

                if (distance2 < maxConnectionDistance) {
                    const opacity = (1 - distance2 / maxConnectionDistance) * 0.3;
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate = () => {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem('particlesCanvas');
});

// Export for use in other modules
window.ParticleSystem = ParticleSystem;
