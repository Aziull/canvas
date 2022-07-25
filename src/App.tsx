import React from 'react';
import './App.css';
import CanvasComponent from './components/CanvasComponent';

function App() {
  return (
    <div className="app">
      <CanvasComponent width={700} height={500} />
    </div>

  );
}

export default App;
