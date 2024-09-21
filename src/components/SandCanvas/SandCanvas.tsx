import React, { useEffect, useRef, useCallback } from 'react';
import './SandCanvas.scss';

interface Particle {
  x: number;
  y: number;
  color: string;
}

class SandSimulation {
  particles: Particle[] = [];
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  animationFrameId: number | null = null;
  isAnimating = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  addParticle(x: number, y: number) {
    const particle: Particle = {
      x: Math.floor(x / 4) * 4,
      y: Math.floor(y / 4) * 4,
      color: '#c2b280',
    };
    this.particles.push(particle);
    if (!this.isAnimating) {
      this.startAnimation();
    }
  }

  updateParticles() {
    let particlesMoved = false;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      if (particle.y + 4 < this.canvas!.height &&
          !this.particles.some(p => p.x === particle.x && p.y === particle.y + 4)) {
        particle.y += 4;
        particlesMoved = true;
      }
    }
    return particlesMoved;
  }

  drawParticles() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(particle => {
      this.ctx!.fillStyle = particle.color;
      this.ctx!.fillRect(particle.x, particle.y, 4, 4);
    });
  }

  animate = () => {
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
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

const SandCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<SandSimulation | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      simulationRef.current = new SandSimulation(canvas);
    }

    return () => {
      simulationRef.current?.stopAnimation();
    };
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('Mouse down');
    const { offsetX, offsetY } = event.nativeEvent;
    simulationRef.current?.addParticle(offsetX, offsetY);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.buttons !== 1) return; // Only add particles if the left mouse button is pressed
    console.log('Mouse move while drawing');
    const { offsetX, offsetY } = event.nativeEvent;
    simulationRef.current?.addParticle(offsetX, offsetY);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    />
  );
};

export default SandCanvas;
