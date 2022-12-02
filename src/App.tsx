import React from 'react';
import './App.css';
import { Drawing } from './Drawing';
import { LineChart } from './LineChart';
import { SliderElement } from './Slider';

function App() {
    return (
        <div className="App">
            {/* <Drawing></Drawing> */}
            <SliderElement></SliderElement>
            <LineChart></LineChart>
        </div>
    );
}

export default App;
