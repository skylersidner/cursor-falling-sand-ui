import { Action, action } from "easy-peasy";
import { ToolbarModel, ToolbarState } from "./toolbar.model";

export interface Particle {
    x: number;
    y: number;
    color: string;
};

export interface SandState {
    particles: Particle[];
    grid: Grid;
}

export type Grid = boolean[][];

interface SandStateUpdate {
    particles?: Particle[];
    grid?: Grid;
}

interface SandActions {
    initialize: Action<this, ToolbarState>;
    update: Action<this, SandStateUpdate>;
}

interface SandThunks {}


const getInitialGrid = (width: number, height: number, pixelSize: number) => {
    return Array(Math.floor(height / pixelSize))
      .fill(null)
      .map(() => Array(Math.floor(width / pixelSize)).fill(false));
}

export interface SandModel extends SandState, SandActions, SandThunks {}

export const sandModel: SandModel = {
    particles: [],
    grid: [[false]],
    initialize: action((state, payload: ToolbarState) => {
        console.log("initialize", payload);
        state = {
            grid: getInitialGrid(payload.width, payload.height, payload.pixelSize),
            particles: []
        };
    }),
    update: action((state, payload: SandStateUpdate) => {
        state = { ...state, ...payload };
    }),
}
  