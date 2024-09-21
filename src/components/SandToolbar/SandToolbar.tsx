import './SandToolbar.scss';
import { useStoreActions, useStoreState } from '../../state/hook-extensions';

const SandToolbar = () => {
    let { width, height, gravity, red, green, blue, theme } = useStoreState((state: any) => state.toolbar);
    let { update } = useStoreActions((actions) => actions.toolbar);

    const setWidth = (value: string) => {
        update({ width: parseInt(value) });
    }

    const setHeight = (value: string) => {
        update({ height: parseInt(value) });
    }

    const setGravity = (value: string) => {
        update({ gravity: parseFloat(value) });
    }

    const setRed = (value: string) => {
        update({ red: parseInt(value) });
    }

    const setGreen = (value: string) => {
        update({ green: parseInt(value) });
    }

    const setBlue = (value: string) => {
        update({ blue: parseInt(value) });
    }

    const setTheme = (value: string) => {
        console.log('setTheme', value);
        // update({ theme: value });
    }

    return (
        <div className="sand-configuration-toolbar">
            <div className="width-input">
                <label htmlFor="width">Width:</label>
                <input type="number" id="width" min="400" max="800" value={width} step="1" onChange={(e) => setWidth(e.target.value)} />
            </div>
            <div className="height-input">
                <label htmlFor="height">Height:</label>
                <input type="number" id="height" min="400" max="800" value={height} step="1" onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div className="gravity-input">
                <label htmlFor="gravity">Gravity:</label>
                <input type="number" id="gravity" min="0.1" max="1.0" value={gravity} step="0.1" onChange={(e) => setGravity(e.target.value)} />
            </div>
            <div className="color-inputs">
                <label htmlFor="red">R:</label>
                <input type="number" id="red" min="0" max="255" value={red} step="1" onChange={(e) => setRed(e.target.value)} />
                <label htmlFor="green">G:</label>
                <input type="number" id="green" min="0" max="255" value={green} step="1" onChange={(e) => setGreen(e.target.value)} />
                <label htmlFor="blue">B:</label>
                <input type="number" id="blue" min="0" max="255" value={blue} step="1" onChange={(e) => setBlue(e.target.value)} />
            </div>
            <div className="theme-selector">
                <label htmlFor="theme">Theme:</label>
                    <select
                        id="theme"
                        value={theme}
                        onChange={(e) => {
                            setTheme(e.target.value);
                        }}
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
            </div>
        </div>
    );
};

export default SandToolbar;