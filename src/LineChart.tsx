import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { intervalTimer, urlGet } from './constants';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
} from 'chart.js';

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale
);

type RequestData = {
    car_distance: number;
    angle: number;
    cube_distance: number;
    time: Date;
};

type GraphData = {
    label: string;
    data: number[];
    borderColor: string;
};

export const LineChart = () => {
    // define initial state of the graph values
    const [angles, setAngles] = useState([]);
    const [carDistances, setCarDistances] = useState([]);
    const [cubeDistances, setCubeDistances] = useState([]);
    const [errors, setErrors] = useState([]);
    const [times, setTimes] = useState([]);
    const [erroCenter, setErroCenter] = useState([]);
    const [angleCenter, setAngleCenter] = useState([]);

    // function which get the data via axios get method
    const getData = async () => {
        const headers = {
            'content-type': 'application/json; charset=UTF-8',
        };
        const response = await axios.get(urlGet, { headers });
        const data = response.data;
        treatData(data);
        return;
    };

    // function which treats the data received via getData function
    const treatData = (data: RequestData[]) => {
        const anglesArray: number[] = [];
        const distancesArray: number[] = [];
        const cubeDistanceArray: number[] = [];
        const errorArray: number[] = [];
        const timeArray: number[] = [];
        const erroCenterArray: number[] = [];
        const angleCenterArray: number[] = [];
        let num = times.length;

        data.map(({ car_distance, angle, cube_distance }) => {
            if (isNaN(car_distance) || isNaN(angle) || isNaN(cube_distance))
                return;
            distancesArray.push(car_distance);
            anglesArray.push(angle);
            errorArray.push(car_distance - cube_distance + 20);
            cubeDistanceArray.push(cube_distance - 20);
            erroCenterArray.push(0);
            angleCenterArray.push(90);
            timeArray.push(num++);
        });

        setAngles([...angles, ...anglesArray]);
        setCarDistances([...carDistances, ...distancesArray]);
        setCubeDistances([...cubeDistances, ...cubeDistanceArray]);
        setErrors([...errors, ...errorArray]);
        setTimes([...times, ...timeArray]);
        setErroCenter([...erroCenter, ...erroCenterArray]);
        setAngleCenter([...angleCenter, ...angleCenterArray]);
    };

    const clearData = () => {
        setAngles([]);
        setCarDistances([]);
        setCubeDistances([]);
        setErrors([]);
        setTimes([]);
        setErroCenter([]);
        setAngleCenter([]);
    };

    // will get the data every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => getData(), intervalTimer);

        // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
        return () => clearInterval(interval);
    }, [clearData]);

    const createGraph = (title: string, dataset: GraphData[]) => {
        return (
            <Line
                style={{ margin: '20px' }}
                data={{
                    labels: times,
                    datasets: dataset.map(({ label, data, borderColor }) => {
                        return {
                            label,
                            data,
                            borderColor,
                            fill: false,
                        };
                    }),
                }}
                options={{
                    responsive: true,

                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: title,
                        },
                    },
                }}
            />
        );
    };

    const distanceGraphData = [
        {
            label: 'Distância Carro',
            data: carDistances,
            borderColor: '#3cba9f',
        },
        {
            label: 'Distância Cubo',
            data: cubeDistances,
            borderColor: '#3e95cd',
        },
    ];
    const errorGraphData = [
        {
            label: 'Erro',
            data: errors,
            borderColor: '#c45850',
        },
        {
            label: 'Zero',
            data: erroCenter,
            borderColor: '#ffffff',
        },
    ];
    const angleGraphData = [
        {
            label: 'Ângulos',
            data: angles,
            borderColor: '#8e5ea2',
        },
        {
            label: 'Zero',
            data: angleCenter,
            borderColor: '#ffffff',
        },
    ];

    return (
        <div className="chart-container">
            <button onClick={() => clearData()}>Limpar dados</button>

            {createGraph('DISTANCIA', distanceGraphData)}
            {createGraph('ERRO', errorGraphData)}
            {createGraph('ANGULO', angleGraphData)}
        </div>
    );
};
