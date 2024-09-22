import { useCallback, useState } from 'react';
import './App.scss'
import SandCanvas from './components/SandCanvas/SandCanvas'
import SandToolbar from './components/SandToolbar/SandToolbar';
import { SimulationConfig } from './models/SandSimulation';

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

function App() {
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);

  const updateConfig = useCallback((newConfig: Partial<SimulationConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  }, []);

  return (
    <>
      <div className="app"> 
        <div className="title">
          <h1>Falling Sand Simulator</h1>
        </div>
        <div className="toolbar">
          <SandToolbar config={config} updateConfig={updateConfig} />
        </div>
        <div className="sandbox">
          <SandCanvas config={config} updateConfig={updateConfig} />
        </div>
      </div>
    </>
  );
}

export default App
