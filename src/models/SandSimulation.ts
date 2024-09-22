import defaultConfig from "../configuration/defaultSimulationConfig";

interface Particle {
    x: number;
    y: number;
    color: string;
  }
  
  export interface ColorScheme {
    sandColor: string;
    backgroundColor: string;
  }

  export interface SimulationConfig {
    width: number;
    height: number;
    particleSize: number;
    gravity: number;
    colorScheme: ColorScheme;
    particleRate: number;
    colorMode: 'specific' | 'random' | 'themed';
    theme: 'light' | 'dark' | 'rainbow';
  }
  
  export class SandSimulation {
    private _config: SimulationConfig;
    private particles: Particle[] = [];
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private animationFrameId: number | null = null;
    private isAnimating = false;
  
    constructor(canvas: HTMLCanvasElement, config: SimulationConfig = defaultConfig) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
  
      // Default configuration
      this._config = config
  
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
  
    private getVariedSandColor(): string {
      const baseColor = this.hexToRgb(this._config.colorScheme.sandColor);
      if (!baseColor) return this._config.colorScheme.sandColor;

      // Apply variation to only 10% of particles
      if (Math.random() < 0.1) {
        const variation = 6;
        const r = this.clamp(baseColor.r + (Math.random() < 0.5 ? -variation : variation), 0, 255);
        const g = this.clamp(baseColor.g + (Math.random() < 0.5 ? -variation : variation), 0, 255);
        const b = this.clamp(baseColor.b + (Math.random() < 0.5 ? -variation : variation), 0, 255);
        return `rgb(${r}, ${g}, ${b})`;
      } else {
        // Return the base color for 90% of particles
        return `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
      }
    }

    private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
  
    private clamp(value: number, min: number, max: number): number {
      return Math.min(Math.max(value, min), max);
    }
  
    addParticle(x: number, y: number) {
      const particle: Particle = {
        x: Math.floor(x / this._config.particleSize) * this._config.particleSize,
        y: Math.floor(y / this._config.particleSize) * this._config.particleSize,
        color: this.getVariedSandColor()
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
      this.ctx.fillStyle = this._config.colorScheme.backgroundColor;
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