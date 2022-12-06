import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { headers, INTERVAL_TIMER, urlGet } from './constants';
import { RequestData, CreateGraphData } from './types';

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

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Legend
);

export const LineChart = () => {
    const [getValues, setGetValues] = useState(true);
    const [latestDataTime, setLatestDataTime] = useState(
        new Date().toISOString()
    );
    // define initial state of the graph values
    const [graphData, setGraphData] = useState({
        carDist: [0],
        cubeDist: [0],
        errors: [0],
        angles: [90],
        errorsCenter: [0],
        anglesCenter: [90],
        xAxes: [0],
    });

    const clearData = () => {
        setGraphData({
            carDist: [0],
            cubeDist: [0],
            errors: [0],
            angles: [90],
            errorsCenter: [0],
            anglesCenter: [90],
            xAxes: [0],
        });
    };

    // function which treats the data received via getData function
    const treatData = useCallback(
        (requestData: RequestData[]) => {
            if (!requestData) return;
            let latestTime = latestDataTime;

            // create copies of the graphData arrays
            let newCarDist = [...graphData.carDist];
            let newCubeDist = [...graphData.cubeDist];
            let newErrors = [...graphData.errors];
            let newAngles = [...graphData.angles];
            let newErrorsCenter = [...graphData.errorsCenter];
            let newAnglesCenter = [...graphData.anglesCenter];
            let newAxes = [...graphData.xAxes];
            let numAxes = graphData.xAxes.length - 1;

            // sort the data based on time
            const filteredData = requestData
                .filter(({ time }) => time > latestDataTime)
                .sort(({ time: timeA }, { time: timeB }) => {
                    // -1 if smaller, 0 if equal, 1 if greater
                    return timeA < timeB ? -1 : Number(timeA > timeB);
                });
            filteredData.forEach(
                ({ car_distance, angle, cube_distance, time }) => {
                    if (isNaN(car_distance + angle + cube_distance)) return;

                    newCarDist.push(car_distance - 20);
                    newCubeDist.push(cube_distance);
                    newErrors.push(car_distance - cube_distance - 20);
                    newAngles.push(angle);
                    newErrorsCenter.push(0);
                    newAnglesCenter.push(90);
                    newAxes.push(++numAxes);
                    latestTime = time;
                }
            );

            setLatestDataTime(latestTime);
            setGraphData({
                carDist: newCarDist,
                cubeDist: newCubeDist,
                errors: newErrors,
                angles: newAngles,
                errorsCenter: newErrorsCenter,
                anglesCenter: newAnglesCenter,
                xAxes: newAxes,
            });

            return;
        },
        [graphData, latestDataTime]
    );

    // will get the data every interval_timer seconds
    useEffect(() => {
        // function which get the data via axios get method
        const getData = async () => {
            try {
                const response = await axios.get(urlGet, { headers });
                treatData(response.data);
                return;
            } catch (e) {}
        };

        const interval = setInterval(() => {
            if (getValues) getData();
            return;
        }, INTERVAL_TIMER);
        // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
        return () => clearInterval(interval);
    }, [getValues, latestDataTime, treatData]);

    const distanceGraphData = {
        title: 'Distâncias ao longo do tempo',
        data: [
            { label: 'Carro', data: graphData.carDist, color: '#0099ff' },
            { label: 'Cubo', data: graphData.cubeDist, color: '#53ff00' },
        ],
        scales: { min: 0, suggestedMax: 440 },
    };
    const errorGraphData = {
        title: 'Erro ao longo do tempo',
        data: [
            { label: 'Erro', data: graphData.errors, color: '#c45850' },
            { label: 'Zero', data: graphData.errorsCenter, color: '#bbbbbb' },
        ],
    };
    const angleGraphData = {
        title: 'Ângulo ao longo do tempo',
        data: [
            { label: 'Ângulo', data: graphData.angles, color: '#8e5ea2' },
            { label: '90°', data: graphData.anglesCenter, color: '#bbbbbb' },
        ],
        scales: { min: 20, max: 160 },
    };

    return (
        <div className="chart-container">
            <button
                style={{ margin: '20px', whiteSpace: 'pre' }}
                onClick={() => setGetValues(!getValues)}
            >
                {`${getValues ? ' Parar' : 'Iniciar'} captura de dados`}
            </button>
            <button style={{ margin: '20px' }} onClick={() => clearData()}>
                Limpar dados
            </button>
            {createGraph(graphData.xAxes, distanceGraphData)}
            {createGraph(graphData.xAxes, errorGraphData)}
            {createGraph(graphData.xAxes, angleGraphData)}
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
                    legend: { display: true, position: 'top', align: 'center' },
                    title: { display: true, text: title },
                },
                scales: {
                    x: { min: 0, ticks: { autoSkip: true } },
                    ...(scales && { y: scales }),
                },
            }}
        />
    );
};
