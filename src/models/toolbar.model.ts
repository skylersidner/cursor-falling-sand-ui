import { Action, action, Thunk, thunk } from "easy-peasy";

export interface ToolbarState {
    width: number;
    height: number;
    gravity: number;
    red: number;
    green: number;
    blue: number;
    pixelSize: number;
    theme: string;
}

interface ToolbarStateUpdate {
    width?: number;
    height?: number;
    gravity?: number;
    red?: number;
    green?: number;
    blue?: number;
    pixelSize?: number;
    theme?: string;
}

interface ToolbarActions {
    initialize: Action<this>;
    update: Action<this, ToolbarStateUpdate>;
}

interface ToolbarThunks {}

const getDefaultToolbarState = (): ToolbarState => {
    return {
        width: 400,
        height: 400,
        gravity: 1.0,
        red: 194,
        green: 178,
        blue: 128,
        pixelSize: 4,
        theme: 'dark',
    };
}

export interface ToolbarModel extends ToolbarState, ToolbarActions, ToolbarThunks {}

export const toolbarModel: ToolbarModel = {
    width: 400,
    height: 400,
    gravity: 1.0,
    red: 194,
    green: 178,
    blue: 128,
    pixelSize: 4,
    theme: 'dark',
    initialize: action((state) => {
        state = { ...getDefaultToolbarState() };
    }),
    update: action((state, payload: ToolbarState) => {
        state = { ...state, ...payload };
    }),
}