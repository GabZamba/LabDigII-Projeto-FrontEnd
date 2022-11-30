import React from 'react';
import { useState } from 'react';
import './App.css';
import { LineChart } from './LineChart';
import { SliderElement } from './Slider';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="App">
            <SliderElement></SliderElement>
            <LineChart></LineChart>
        </div>
    );
}

export default App;
