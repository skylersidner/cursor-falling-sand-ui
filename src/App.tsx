import { useCallback, useState } from 'react';
import './App.scss'
import SandCanvas from './components/SandCanvas/SandCanvas'
import SandToolbar from './components/SandToolbar/SandToolbar';
import { SimulationConfig } from './models/SandSimulation';
import defaultConfig from './configuration/defaultSimulationConfig';

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
