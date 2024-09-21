import React, { useEffect, useRef, useCallback, useState } from 'react';
import { SandSimulation, SimulationConfig } from '../../models/SandSimulation';
import './SandCanvas.scss';
import SandToolbar from '../SandToolbar/SandToolbar';

const defaultConfig: SimulationConfig = {
  width: 400,
  height: 400,
  particleSize: 4,
  gravity: 1,
  sandColorRed: 194,
  sandColorGreen: 178,
  sandColorBlue: 128,
  backgroundColor: '#87CEEB',
  particleRate: 50
};

const SandCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<SandSimulation | null>(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const particleIntervalRef = useRef<number | null>(null);
  const [config, setConfig] = useState<SimulationConfig | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      simulationRef.current = new SandSimulation(canvasRef.current, defaultConfig);
      setConfig(simulationRef.current.config);
    }

    return () => {
      simulationRef.current?.stopAnimation();
    };
  }, []);

  const updateConfig = useCallback((newConfig: Partial<SimulationConfig>) => {
    setConfig(prevConfig => {
      if (prevConfig) {
        const updatedConfig = { ...prevConfig, ...newConfig };
        simulationRef.current?.updateConfig(updatedConfig);
        return updatedConfig;
      }
      return prevConfig;
    });
  }, []);

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
      {config && updateConfig && (
        <SandToolbar config={config} updateConfig={updateConfig} />
      )}
      <canvas
        ref={canvasRef}
        width={config?.width || defaultConfig.width}
        height={config?.height || defaultConfig.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default SandCanvas;
