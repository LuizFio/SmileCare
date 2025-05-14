import React from 'react';
import Home from './pages/Home';
import QuemCuida from './components/QuemCuida';
import AreasDeAtuacao from './components/AreasDeAtuacao';
import './App.css';

function App() {
  return (
    <div className="app">
      <Home />
      <QuemCuida />
      <AreasDeAtuacao/>

    </div>
  );
}

export default App;
