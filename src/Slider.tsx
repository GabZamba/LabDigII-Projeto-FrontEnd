import axios from 'axios';
import React, { useState } from 'react';
import { Box, Slider } from '@mui/material';
import { headers, urlSend } from './constants';

export const SliderElement = () => {
    const [cubeDistanceSliderValue, setCubeDistanceSliderValue] = useState(370);

    const sendData = async (value: number | number[]) => {
        if (Array.isArray(value)) return;
        const cubeDistance = 440 - value;
        if (isNaN(cubeDistance) || cubeDistance === cubeDistanceSliderValue)
            return;
        setCubeDistanceSliderValue(cubeDistance);

        await axios.post(urlSend, { headers, body: cubeDistance });
        return;
    };
    const numFormatter = (value: number) => 440 - value;

    return (
        <div>
            <h2 style={{ color: '#000000', textAlign: 'left' }}>
                Selecione abaixo a posição do cubo virtual desejada
            </h2>
            <h3 style={{ color: '#000000', textAlign: 'left' }}>
                Posição Atual: {cubeDistanceSliderValue}
            </h3>
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
                    valueLabelFormat={(value) => (
                        <div>{numFormatter(value)}</div>
                    )}
                    onChangeCommitted={(event, value) => sendData(value)}
                />
            </Box>
        </div>
    );
};
