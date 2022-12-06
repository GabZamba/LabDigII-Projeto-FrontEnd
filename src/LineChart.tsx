import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { intervalTimer, urlGet, X_AXIS_LENGTH } from './constants';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Legend,
    CategoryScale,
} from 'chart.js';
import { max } from 'moment';

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Legend
);

type RequestData = {
    car_distance: number;
    angle: number;
    cube_distance: number;
    time: string;
};

type GraphData = {
    label: string;
    data: number[];
    color: string;
};

type Scales = {
    min: number;
    max: number;
};

type CreateGraphData = {
    title: string;
    data: GraphData[];
    scales?: Scales;
};

const headers = {
    'content-type': 'application/json; charset=UTF-8',
};

export const LineChart = () => {
    const [getValues, setGetValues] = useState(true);
    // define initial state of the graph values
    const [carDistances, setCarDistances] = useState([]);
    const [cubeDistances, setCubeDistances] = useState([]);
    const [errors, setErrors] = useState([]);
    const [angles, setAngles] = useState([]);
    const [errorsCenter, setErrorsCenter] = useState([]);
    const [anglesCenter, setAnglesCenter] = useState([]);
    // const [xAxes, setXAxes] = useState([]);
    const [xAxes, setXAxes] = useState(Array.from(Array(X_AXIS_LENGTH).keys()));

    const [latestDataTime, setLatestDataTime] = useState(
        new Date().toISOString()
    );

    // function which get the data via axios get method
    const getData = async () => {
        try {
            const response = await axios.get(urlGet, { headers });
            treatData(response.data);
            return;
        } catch (e) {}
    };

    // function which treats the data received via getData function
    const treatData = (requestData: RequestData[]) => {
        if (!requestData) return;
        let latestTime = latestDataTime;

        // create copies of the useState arrays
        let newCarDistances = [...carDistances];
        let newCubeDistances = [...cubeDistances];
        let newErrors = [...errors];
        let newAngles = [...angles];
        let newErrorsCenter = [...errorsCenter];
        let newAnglesCenter = [...anglesCenter];
        // let newAxes = [];
        // let numAxes = xAxes[xAxes.length - 1] || -1;

        // sort the data based on time
        const filteredData = requestData
            .filter(({ time }) => time > latestDataTime)
            .sort(({ time: timeA }, { time: timeB }) => {
                // -1 if smaller, 0 if equal, 1 if greater
                return timeA < timeB ? -1 : Number(timeA > timeB);
            });

        filteredData.forEach(({ car_distance, angle, cube_distance, time }) => {
            if (isNaN(car_distance + angle + cube_distance)) return;

            newCarDistances.push(car_distance - 20);
            newCubeDistances.push(cube_distance);
            newErrors.push(car_distance - cube_distance + 20);
            newAngles.push(angle);
            newErrorsCenter.push(0);
            newAnglesCenter.push(90);
            // newAxes.push(++numAxes);
            latestTime = time;
        });
        setLatestDataTime(latestTime);

        // save the X_AXIS_LENGTH most recent values
        const willSlice = newCarDistances.length > X_AXIS_LENGTH;
        const sliceSize = filteredData.length;
        setCarDistances(
            willSlice ? newCarDistances.slice(sliceSize) : newCarDistances
        );
        setCubeDistances(
            willSlice ? newCubeDistances.slice(sliceSize) : newCubeDistances
        );
        setErrors(willSlice ? newErrors.slice(sliceSize) : newErrors);
        setAngles(willSlice ? newAngles.slice(sliceSize) : newAngles);
        setErrorsCenter(
            willSlice ? newErrorsCenter.slice(sliceSize) : newErrorsCenter
        );
        setAnglesCenter(
            willSlice ? newAnglesCenter.slice(sliceSize) : newAnglesCenter
        );
        // setXAxes(willSlice ? newAxes.slice(-X_AXIS_LENGTH) : newAxes);

        return;
    };

    const clearData = () => {
        setCarDistances([]);
        setCubeDistances([]);
        setErrors([]);
        setErrorsCenter([]);
        setAngles([]);
        setAnglesCenter([]);
        // setXAxes([]);
    };

    // will get the data every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (getValues) getData();
            return;
        }, intervalTimer);
        // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
        return () => clearInterval(interval);
    }, [clearData, getValues]);

    const distanceGraphData = {
        title: 'Distâncias ao longo do tempo',
        data: [
            { label: 'Distância Carro', data: carDistances, color: 'blue' },
            { label: 'Distância Cubo', data: cubeDistances, color: 'green' },
        ],
        scales: { min: 0, max: 440 },
    };
    const errorGraphData = {
        title: 'Erro ao longo do tempo',
        data: [
            { label: 'Erro', data: errors, color: '#c45850' },
            { label: 'Zero', data: errorsCenter, color: '#bbbbbb' },
        ],
        // scales: { min: -400, max: 400 },
    };
    const angleGraphData = {
        title: 'Ângulo ao longo do tempo',
        data: [
            { label: 'Ângulo', data: angles, color: '#8e5ea2' },
            { label: '90°', data: anglesCenter, color: '#bbbbbb' },
        ],
        scales: { min: 20, max: 160 },
    };

    return (
        <div className="chart-container">
            <button
                style={{ margin: '20px' }}
                onClick={() => setGetValues(!getValues)}
            >
                {`${getValues ? 'Parar ' : 'Iniciar'} captura de dados`}
            </button>
            <button style={{ margin: '20px' }} onClick={() => clearData()}>
                Limpar dados
            </button>
            {createGraph(xAxes, distanceGraphData)}
            {createGraph(xAxes, errorGraphData)}
            {createGraph(xAxes, angleGraphData)}
        </div>
    );
};

const createGraph = (
    xAxes: number[],
    { title, data, scales }: CreateGraphData
) => {
    return (
        <Line
            style={{ margin: '20px', width: '' }}
            data={{
                labels: xAxes,
                datasets: data.map(({ label, data, color }) => ({
                    label,
                    data,
                    borderColor: color,
                    fill: false,
                })),
            }}
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'center',
                    },
                    title: { display: true, text: title },
                },
                scales: {
                    x: {
                        min: 0,
                        max: X_AXIS_LENGTH,
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: X_AXIS_LENGTH / 20,
                        },
                    },
                    ...(scales && { y: scales }),
                },
            }}
        />
    );
};
