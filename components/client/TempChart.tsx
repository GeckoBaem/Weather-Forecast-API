"use client"

import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { WeatherJsonData } from '@/helpers/types';

interface TempsItem {
    time: number,
    temp: number
}

export default function TempChart(props: WeatherJsonData) {
    const getTemp = props.temps.map((data: TempsItem) => data.temp);
    const getTime = props.temps.map((data: TempsItem) => (Number(String(data.time).slice(0, 2))) + "시");

    Chart.register(ChartDataLabels);

    const data = {
        labels: getTime,
        datasets: [{
            label: 'Temp',
            data: getTemp,
            tension: 0.2,
            fill: true,
        }],
    };

    const option = {
        plugins: {
            legend: {
                display: false,
                labels: {
                    font: {
                        family: "pretendard",
                    }
                }
            },
            tooltip: {
                enabled: false,
            },
            animation: {
                duration: 0,
            },
            datalabels: {
                color: 'white',
                font: {
                    size: 10
                },
                align: -90,
                // formatter: function (value: any) {
                //     const values = value
                //     return values + "°C";
                // }
            },
            Response: true,
            responsive: true,
            maintainAspectRatio: false,
        },

        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "white",
                }
            },
            y: {
                display: false,
                min: Math.min(...getTemp) - 1,
                max: Math.max(...getTemp) + 1,
                grid: {
                    display: false,
                }
            },
        },
    }
    return (
        <Line data={data} options={option}/>
    )
}