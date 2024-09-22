import { SimulationConfig } from "../models/SandSimulation";

const defaultConfig: SimulationConfig = {
    width: 400,
    height: 400,
    particleSize: 4,
    gravity: 1,
    colorScheme: {
        sandColor: '#dfb330',
        backgroundColor: '#000000',
      },
    particleRate: 50,
    colorMode: 'specific',
    theme: 'light',
};

export default defaultConfig;