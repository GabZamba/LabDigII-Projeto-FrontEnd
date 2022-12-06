import React from 'react';
import './App.css';
import { LineChart } from './LineChart';
import { SliderElement } from './Slider';

function App() {
    return (
        <div className="App">
            <SliderElement></SliderElement>
            <LineChart></LineChart>
        </div>
    );
}

export default App;
