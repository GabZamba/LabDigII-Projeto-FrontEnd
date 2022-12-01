import axios from 'axios';
import React, { useState } from 'react';
import { Box, Slider } from '@mui/material';
import { urlSend } from './constants';

const headers = {
    'content-type': 'application/json; charset=UTF-8',
};

export const SliderElement = () => {
    // define initial state of the graph values
    const [cubeDistanceSliderValue, setCubeDistanceSliderValue] = useState(70);

    const sendData = async (value: number) => {
        if (isNaN(value) || value === cubeDistanceSliderValue) return;
        setCubeDistanceSliderValue(value);

        await axios.post(
            urlSend, 
            { headers, body: value }
        );
        return;
    };
    const numFormatter = (value: number) => 440 - value;

    return (
        <Box width={'600px'} style={{ margin: 'auto' }}>
            <Slider
                // size="small"
                defaultValue={70}
                aria-label="Small"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={430}
                valueLabelFormat={(value) => <div>{numFormatter(value)}</div>}
                onChange={(event, value: number) => sendData(value)}
            />
        </Box>
    );
};
