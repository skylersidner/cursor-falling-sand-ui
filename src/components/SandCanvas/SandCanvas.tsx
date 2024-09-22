import React, { useEffect, useRef, useCallback } from 'react';
import { SandSimulation, SimulationConfig } from '../../models/SandSimulation';
import './SandCanvas.scss';

interface SandCanvasProps {
  config: SimulationConfig;
  updateConfig: (newConfig: Partial<SimulationConfig>) => void;
}

const SandCanvas: React.FC<SandCanvasProps> = ({ config, updateConfig }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<SandSimulation | null>(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const particleIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      simulationRef.current = new SandSimulation(canvasRef.current, config);
    }

    return () => {
      simulationRef.current?.stopAnimation();
    };
  }, [config, simulationRef, canvasRef]);

  useEffect(() => {
    simulationRef.current?.updateConfig(config ?? {});
  }, [config, simulationRef]);

  const addParticle = useCallback(() => {
    if (lastPositionRef.current && simulationRef.current) {
      const { x, y } = lastPositionRef.current;
      simulationRef.current.addParticle(x, y);
    }
  }, []);

  const startDrawing = useCallback((x: number, y: number) => {
    isDrawingRef.current = true;
    lastPositionRef.current = { x, y };
    addParticle();

    if (particleIntervalRef.current) {
      clearInterval(particleIntervalRef.current);
    }

    const intervalTime = 1000 / simulationRef.current!.config.particleRate;
    particleIntervalRef.current = window.setInterval(addParticle, intervalTime);
  }, [addParticle]);

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
    lastPositionRef.current = null;
    if (particleIntervalRef.current) {
      clearInterval(particleIntervalRef.current);
      particleIntervalRef.current = null;
    }
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    startDrawing(offsetX, offsetY);
  }, [startDrawing]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const { offsetX, offsetY } = event.nativeEvent;
    lastPositionRef.current = { x: offsetX, y: offsetY };
  }, []);

  const handleMouseUp = useCallback(() => {
    stopDrawing();
  }, [stopDrawing]);

  const handleMouseLeave = useCallback(() => {
    stopDrawing();
  }, [stopDrawing]);

  return (
    <div className="sand-simulation">
      {/* {config && updateConfig && (
        <SandToolbar config={config} updateConfig={updateConfig} />
      )} */}
      <canvas
        ref={canvasRef}
        width={config?.width}
        height={config?.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default SandCanvas;
