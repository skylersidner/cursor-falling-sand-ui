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
      {/* Add other controls here */}
    </div>
  );
};

export default SandToolbar;