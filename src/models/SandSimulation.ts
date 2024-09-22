interface Particle {
    x: number;
    y: number;
    color: string;
  }
  
  export interface SimulationConfig {
    width: number;
    height: number;
    particleSize: number;
    gravity: number;
    sandColorRed: number;
    sandColorGreen: number;
    sandColorBlue: number;
    backgroundColor: string;
    particleRate: number; // New: particles per second
  }
  
  export class SandSimulation {
    private _config: SimulationConfig;
    private particles: Particle[] = [];
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private animationFrameId: number | null = null;
    private isAnimating = false;
  
    constructor(canvas: HTMLCanvasElement, config: Partial<SimulationConfig | null | undefined> = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
  
      // Default configuration
      this._config = {
        width: 400,
        height: 400,
        particleSize: 4,
        gravity: 1,
        sandColorRed: 194,   // Default sand color (194, 178, 128)
        sandColorGreen: 178,
        sandColorBlue: 128,
        backgroundColor: '#87CEEB',
        particleRate: 50,
        ...config
      };
  
      this.resizeCanvas();
    }
  
    // Getter for config
    get config(): Readonly<SimulationConfig> {
      return { ...this._config };
    }
  
    private resizeCanvas() {
      if (this.canvas) {
        this.canvas.width = this._config.width;
        this.canvas.height = this._config.height;
      }
    }
  
    private getSandColor(): string {
      return `rgb(${this._config.sandColorRed}, ${this._config.sandColorGreen}, ${this._config.sandColorBlue})`;
    }
  
    addParticle(x: number, y: number) {
      const particle: Particle = {
        x: Math.floor(x / this._config.particleSize) * this._config.particleSize,
        y: Math.floor(y / this._config.particleSize) * this._config.particleSize,
        color: this.getSandColor(),
      };
      this.particles.push(particle);
      if (!this.isAnimating) {
        this.startAnimation();
      }
    }
  
    private updateParticles() {
      let particlesMoved = false;
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];
        const below = particle.y + this._config.particleSize;
        const belowLeft = particle.x - this._config.particleSize;
        const belowRight = particle.x + this._config.particleSize;

        if (below < this._config.height && !this.isOccupied(particle.x, below)) {
          // Fall straight down
          particle.y = below;
          particlesMoved = true;
        } else if (below < this._config.height) {
          // Try to fall diagonally
          const fallLeft = !this.isOccupied(belowLeft, below);
          const fallRight = !this.isOccupied(belowRight, below);

          if (fallLeft && fallRight) {
            // Randomly choose left or right
            particle.x += Math.random() < 0.5 ? -this._config.particleSize : this._config.particleSize;
            particle.y = below;
            particlesMoved = true;
          } else if (fallLeft) {
            particle.x = belowLeft;
            particle.y = below;
            particlesMoved = true;
          } else if (fallRight) {
            particle.x = belowRight;
            particle.y = below;
            particlesMoved = true;
          }
        }
      }
      return particlesMoved;
    }
  
    private isOccupied(x: number, y: number): boolean {
      return this.particles.some(p => p.x === x && p.y === y);
    }
  
    private drawParticles() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.fillStyle = this._config.backgroundColor;
      this.ctx.fillRect(0, 0, this._config.width, this._config.height);
      this.particles.forEach(particle => {
        this.ctx!.fillStyle = particle.color;
        this.ctx!.fillRect(particle.x, particle.y, this._config.particleSize, this._config.particleSize);
      });
    }
  
    private animate = () => {
      console.log('Animation frame running');
      const particlesMoved = this.updateParticles();
      this.drawParticles();
  
      if (particlesMoved) {
        this.animationFrameId = requestAnimationFrame(this.animate);
      } else {
        console.log('Animation stopped');
        this.isAnimating = false;
        this.animationFrameId = null;
      }
    }
  
    startAnimation() {
      if (!this.isAnimating) {
        console.log('Animation started');
        this.isAnimating = true;
        this.animationFrameId = requestAnimationFrame(this.animate);
      }
    }
  
    stopAnimation() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.isAnimating = false;
        this.animationFrameId = null;
      }
    }
  
    updateConfig(newConfig: Partial<SimulationConfig>) {
      this._config = { ...this._config, ...newConfig };
      this.resizeCanvas();
      this.drawParticles(); // Redraw with new configuration
    }
  
    clearParticles() {
      this.particles = [];
      this.drawParticles(); // Clear the canvas
    }
  }