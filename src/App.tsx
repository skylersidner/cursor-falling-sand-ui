import './App.scss'
import SandCanvas from './components/SandCanvas/SandCanvas'
import SandToolbar from './components/SandToolbar/SandToolbar';

function App() {

  return (
    <>
      <div className="app"> 
        <div className="title">
          <h1>Falling Sand Simulator</h1>
        </div>
        <div className="toolbar">
          {/* <SandToolbar /> */}
        </div>
        <div className="sandbox">
          <SandCanvas />
        </div>
      </div>
    </>
  );
}

export default App
