import axios from 'axios';
import React, { useState } from 'react';

import { Box, Slider } from '@mui/material';
import { urlPostGet, urlPost } from './constants';

export const SliderElement = () => {
    // define initial state of the graph values
    const [cubeDistanceSliderValue, setCubeDistanceSliderValue] = useState(70);

    const postData = async (value: number) => {
        console.log(value);
        if (isNaN(value)) return;
        if (value === cubeDistanceSliderValue) return;

        const headers = {
            'content-type': 'application/json; charset=UTF-8',
        };
        const response = await axios.post(urlPost, { headers, body: value });
        console.log(response);
        return;
    };

    const postGetData = async (value: number) => {
        console.log(value);
        if (isNaN(value)) return;
        if (value === cubeDistanceSliderValue) return;

        const headers = {
            'content-type': 'application/json; charset=UTF-8',
        };
        const response = await axios.get(urlPostGet, {
            headers,
            params: { dist: value },
        });
        console.log(response);
        return;
    };

    return (
        <div className="chart-container">
            {
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
                        onChange={(event, value: number) => postGetData(value)}
                    />
                </Box>
            }
        </div>
    );
};
