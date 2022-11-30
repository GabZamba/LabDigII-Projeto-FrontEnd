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
    color: string;
};

const headers = {
    'content-type': 'application/json; charset=UTF-8',
};

export const LineChart = () => {
    // define initial state of the graph values
    const [carDistances, setCarDistances] = useState([]);
    const [cubeDistances, setCubeDistances] = useState([]);
    const [errors, setErrors] = useState([]);
    const [angles, setAngles] = useState([]);
    const [errorsCenter, setErrorsCenter] = useState([]);
    const [anglesCenter, setAnglesCenter] = useState([]);
    // const [xAxes, setXAxes] = useState([]);
    const [xAxes, setXAxes] = useState(Array.from(Array(500).keys()));

    const [getValues, setGetValues] = useState(false);

    // function which get the data via axios get method
    const getData = async () => {
        try {
            const response = await axios.get(urlGet, { headers });
            treatData(response.data);
            return;
        } catch (e) {}
    };

    // function which treats the data received via getData function
    const treatData = (data: RequestData[]) => {
        if (!data) return;

        // create the arrays which will be used
        let newCarDistances: number[] = [];
        let newCubeDistances: number[] = [];
        let newErrors: number[] = [];
        let newAngles: number[] = [];
        let newErrorsCenter: number[] = [];
        let newAnglesCenter: number[] = [];
        // let newAxes: number[] = [];
        // let numAxes = xAxes.length;

        // fill the arrays with the new values
        data.forEach(({ car_distance, angle, cube_distance }) => {
            if (isNaN(car_distance + angle + cube_distance)) return;

            newCarDistances.push(car_distance);
            newCubeDistances.push(cube_distance - 20);
            newErrors.push(car_distance - cube_distance + 20);
            newAngles.push(angle);
            newErrorsCenter.push(0);
            newAnglesCenter.push(90);
            // newAxes.push(numAxes++);
        });
        // concat the previous arrays to the newest ones
        newCarDistances = carDistances.concat(newCarDistances);
        newCubeDistances = cubeDistances.concat(newCubeDistances);
        newErrors = errors.concat(newErrors);
        newAngles = angles.concat(newAngles);
        newErrorsCenter = errorsCenter.concat(newErrorsCenter);
        newAnglesCenter = anglesCenter.concat(newAnglesCenter);
        // newAxes = xAxes.concat(newAxes);

        // save the 1000 most recent values
        const passedMaxRange = newCarDistances.length > 510;
        setCarDistances(
            passedMaxRange ? newCarDistances.splice(10) : newCarDistances
        );
        setCubeDistances(
            passedMaxRange ? newCubeDistances.splice(10) : newCubeDistances
        );
        setErrors(passedMaxRange ? newErrors.splice(10) : newErrors);
        setAngles(passedMaxRange ? newAngles.splice(10) : newAngles);
        setErrorsCenter(
            passedMaxRange ? newErrorsCenter.splice(10) : newErrorsCenter
        );
        setAnglesCenter(
            passedMaxRange ? newAnglesCenter.splice(10) : newAnglesCenter
        );
        // setXAxes(passedMaxRange ? newAxes.splice(10) : newAxes);

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

    const createGraph = (title: string, dataset: GraphData[]) => (
        <Line
            style={{ margin: '20px' }}
            data={{
                labels: xAxes,
                datasets: dataset.map(({ label, data, color }) => ({
                    label,
                    data,
                    borderColor: color,
                    fill: false,
                })),
            }}
            options={{
                responsive: true,
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: { display: true, text: title },
                },
            }}
        />
    );

    const distanceGraphData = [
        { label: 'Distância Carro', data: carDistances, color: '#3cba9f' },
        { label: 'Distância Cubo', data: cubeDistances, color: '#3e95cd' },
    ];
    const errorGraphData = [
        { label: 'Erro', data: errors, color: '#c45850' },
        { label: 'Zero', data: errorsCenter, color: '#ffffff' },
    ];
    const angleGraphData = [
        { label: 'Ângulo', data: angles, color: '#8e5ea2' },
        { label: '90°', data: anglesCenter, color: '#ffffff' },
    ];

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
            {createGraph('Distâncias ao longo do tempo', distanceGraphData)}
            {createGraph('Erro ao longo do tempo', errorGraphData)}
            {createGraph('Ângulo ao longo do tempo', angleGraphData)}
        </div>
    );
};
