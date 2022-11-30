import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
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
import dadosJSON from './dados.json';
import moment from 'moment';

const urlGet = 'https://labdigi-nodered.rj.r.appspot.com/data';
const urlPost = 'https://labdigi-nodered.rj.r.appspot.com/distance';

type Data = {
    car_distance: number;
    angle: number;
    cube_distance: number;
    time: Date;
};

export const LineChart = () => {
    // define initial state of the graph values
    const [angles, setAngles] = useState([]);
    const [carDistances, setCarDistances] = useState([]);
    const [cubeDistances, setCubeDistances] = useState([]);
    const [errors, setErrors] = useState([]);
    const [times, setTimes] = useState([]);

    // function which get the data via axios get method
    const getData = () => {
        const headers = {
            'Access-Control-Allow-Origin': urlGet,
            'content-type': 'application/json; charset=UTF-8',
        };
        // TODO: TROCAR O CORS DO SERVIDOR PARA DEIXAR LOCALHOST ACESSAR
        // const response = await axios.get(urlGet, { headers });
        // const data = response.data;
        // treatData(data);
        treatData(dadosJSON);
        return;
    };

    // function which treats the data received via getData function
    const treatData = (data: Data[]) => {
        const anglesArray: number[] = [];
        const distancesArray: number[] = [];
        const cubeDistanceArray: number[] = [];
        const errorArray: number[] = [];
        // const timeArray: Date[] = [];
        const timeArray: number[] = [];
        let num = times.length;

        data.map(({ car_distance, angle, cube_distance, time }) => {
            if (isNaN(car_distance) || isNaN(angle) || isNaN(cube_distance))
                return;
            distancesArray.push(car_distance);
            anglesArray.push(angle);
            errorArray.push(car_distance - cube_distance);
            cubeDistanceArray.push(cube_distance);
            // const date = moment(time).format('mm:ss');
            // timeArray.push(date);
            timeArray.push(num++);
        });

        setAngles([...angles, ...anglesArray]);
        setCarDistances([...carDistances, ...distancesArray]);
        setCubeDistances([...cubeDistances, ...cubeDistanceArray]);
        setErrors([...errors, ...errorArray]);
        setTimes([...times, ...timeArray]);
    };

    const clearData = () => {
        setAngles([]);
        setCarDistances([]);
        setCubeDistances([]);
        setErrors([]);
        setTimes([]);
    };

    // will get the data every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => getData(), 3000);

        // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
        return () => clearInterval(interval);
    }, [clearData]);

    return (
        <div className="chart-container">
            <button onClick={() => clearData()}>Limpar dados</button>
            <button onClick={() => getData()}>Puxar dados</button>
            {/* <h2 style={{ textAlign: 'center' }}>Pie Chart</h2> */}
            <Line
                data={{
                    labels: times,
                    datasets: [
                        {
                            label: 'Ângulos',
                            data: angles,
                            borderColor: '#8e5ea2',
                            fill: false,
                        },
                        {
                            label: 'Distância Carro',
                            data: carDistances,
                            borderColor: '#3cba9f',
                            fill: false,
                        },
                        {
                            label: 'Distância Cubo',
                            data: cubeDistances,
                            borderColor: '#3e95cd',
                            fill: false,
                        },
                        {
                            label: 'Erro',
                            data: errors,
                            borderColor: '#c45850',
                            fill: false,
                        },
                    ],
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
                            text: 'Gráfico da Evolução do controle ao longo do tempo',
                        },
                    },
                }}
            />
        </div>
    );
};
