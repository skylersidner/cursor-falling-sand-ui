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
    updateConfig({ backgroundColor: event.target.value });
  };

  const handleSandColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ sandColor: event.target.value });
  };

  return (
    <div className="sand-toolbar">
      <div className="toolbar-section">
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
      <div className="toolbar-section">
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
      <div className="toolbar-section">
        <label htmlFor="backgroundColor">Background Color:</label>
        <input
          type="color"
          id="backgroundColor"
          value={config.backgroundColor}
          onChange={handleBackgroundColorChange}
        />
      </div>
      <div className="toolbar-section">
        <label htmlFor="sandColor">Sand Color:</label>
        <input
          type="color"
          id="sandColor"
          value={config.sandColor}
          onChange={handleSandColorChange}
        />
      </div>
      {/* Add other controls here */}
    </div>
  );
};

export default SandToolbar;