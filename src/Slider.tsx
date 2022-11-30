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

        await axios.get(urlSend, {
            headers,
            params: { dist: value },
        });
        return;
    };

    return (
        <Box width={'100%'}>
            <Slider
                // size="small"
                defaultValue={70}
                aria-label="Small"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={430}
                onChange={(event, value: number) => sendData(value)}
            />
        </Box>
    );
};
