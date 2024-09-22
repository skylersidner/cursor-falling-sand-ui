import React from 'react';
import { SimulationConfig } from '../../models/SandSimulation';
import './SandToolbar.scss';

interface SandToolbarProps {
  config: SimulationConfig;
  updateConfig: (newConfig: Partial<SimulationConfig>) => void;
}

const SandToolbar: React.FC<SandToolbarProps> = ({ config, updateConfig }) => {
  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(event.target.value, 10);
    updateConfig({ width });
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(event.target.value, 10);
    updateConfig({ height });
  };

  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ 
      colorScheme: { 
        ...config.colorScheme, 
        backgroundColor: event.target.value 
      } 
    });
  };

  const handleSandColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ 
      colorScheme: { 
        ...config.colorScheme, 
        sandColor: event.target.value 
      } 
    });
  };

  const handleColorModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ colorMode: event.target.value as 'specific' | 'random' | 'themed' });
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateConfig({ theme: event.target.value as 'light' | 'dark' | 'rainbow' });
  };

  return (
    <div className="sand-toolbar">
      <div className="color-section">
        <h3>Color</h3>
        <div className="color-inputs">
          <div className="input-group">
            <label htmlFor="backgroundColor">Background</label>
            <input
              type="color"
              id="backgroundColor"
              value={config.colorScheme.backgroundColor}
              onChange={handleBackgroundColorChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="sandColor">Sand</label>
            <input
              type="color"
              id="sandColor"
              value={config.colorScheme.sandColor}
              onChange={handleSandColorChange}
            />
          </div>
        </div>
        <div className="color-mode">
          <div className="radio-group">
            <input
              type="radio"
              id="specific"
              name="colorMode"
              value="specific"
              checked={config.colorMode === 'specific'}
              onChange={handleColorModeChange}
            />
            <label htmlFor="specific">Specific</label>
          </div>
          <div className="radio-group">
            <input
              type="radio"
              id="random"
              name="colorMode"
              value="random"
              checked={config.colorMode === 'random'}
              onChange={handleColorModeChange}
            />
            <label htmlFor="random">Random</label>
          </div>
          <div className="radio-group">
            <input
              type="radio"
              id="themed"
              name="colorMode"
              value="themed"
              checked={config.colorMode === 'themed'}
              onChange={handleColorModeChange}
            />
            <label htmlFor="themed">Themed</label>
            <select
              value={config.theme}
              onChange={handleThemeChange}
              disabled={config.colorMode !== 'themed'}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="rainbow">Rainbow</option>
            </select>
          </div>
        </div>
      </div>
      <div className="size-section">
        <h3>Size</h3>
        <div className="size-inputs">
          <div className="input-group">
            <label htmlFor="width">Width:</label>
            <input
              type="number"
              id="width"
              value={config.width}
              onChange={handleWidthChange}
              min="100"
              max="1000"
            />
          </div>
          <div className="input-group">
            <label htmlFor="height">Height:</label>
            <input
              type="number"
              id="height"
              value={config.height}
              onChange={handleHeightChange}
              min="100"
              max="1000"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SandToolbar;