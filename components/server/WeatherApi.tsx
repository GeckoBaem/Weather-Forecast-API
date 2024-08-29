"use server"

import CoordinateSysTransform from "./CoordinateSysTransform";
import { SkyFormTranslation, fallingFormTranslation, WeatherTranslation } from "./WeatherTranslation";

const now = new Date();
const baseDate = now.toISOString().slice(0, 10).replace(/-/g, "");
const setBaseTime = `${String(now.getHours()).padStart(2, '0')}30`;
const baseTime = now.getMinutes() < 30 ? String(Number(setBaseTime) - 100).padStart(4, '0') : setBaseTime;

async function GetWeatherData(nx: number, ny: number) {
    try {
        const res = await fetch(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&numOfRows=70&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`)
            .then(res => res.json());
        const data = res.response.body.items.item;
        const throwData = data.map((data: WeatherDataItem) => ({
            fcstValue: data.fcstValue,
            fcstTime: data.fcstTime,
            category: data.category
        }))

        return throwData;
    } catch (error) {
        return `Weather API: 정보를 불러올 수 없습니다. Status: ${error}`;
    }
}

type WeatherDataItem = {
    category: string,
    fcstValue: number,
    fcstTime: number,
    temp: number,
    skyForm: string,
    fallingForm: string,
}

export type WeatherJsonData = {
    temps: [
        {
            temp: number,
            time: number
        }
    ],
    skyForms: [
        {
            skyForm: string,
            time: number
        }
    ],
    fallingForms: [
        {
            fallingForm: string,
            time: number
        }
    ],
    translatedWeathers: string[],
    baseDate: string,
    baseTime: string
}

export default async function WeatherApi() {
    const transformedLocation = await CoordinateSysTransform();
    const nx = transformedLocation.nx;
    const ny = transformedLocation.ny;
    const rawWeatherData = await GetWeatherData(nx, ny);

    if (!rawWeatherData) return null;

    const temps = rawWeatherData
        .filter((weatherData: WeatherDataItem) => weatherData.category == "T1H")
        .map((weatherData: WeatherDataItem) => ({
            temp: weatherData.fcstValue,
            time: weatherData.fcstTime
        }));
    const skyForms = rawWeatherData
        .filter((weatherData: WeatherDataItem) => weatherData.category == "SKY")
        .map((weatherData: WeatherDataItem) => ({
            skyForm: SkyFormTranslation(Number(weatherData.fcstValue)),
            time: weatherData.fcstTime
        }))
    const fallingForms = rawWeatherData
        .filter((weatherData: WeatherDataItem) => weatherData.category == "PTY")
        .map((weatherData: WeatherDataItem) => ({
            fallingForm: fallingFormTranslation(Number(weatherData.fcstValue)),
            time: weatherData.fcstTime
        }))

    const skyCodes = rawWeatherData
    .filter((weatherData: WeatherDataItem) => weatherData.category == "SKY")
    .map((weatherData: WeatherDataItem) => Number(weatherData.fcstValue))
    const fallingCodes = rawWeatherData
    .filter((weatherData: WeatherDataItem) => weatherData.category == "PTY")
    .map((weatherData: WeatherDataItem) => Number(weatherData.fcstValue))

    const translatedWeathers = skyCodes.map((skyCode: number, index: number) => {
        return WeatherTranslation(skyCode, fallingCodes[index]);
    });

    return { temps: temps, skyForms: skyForms, fallingForms: fallingForms, translatedWeathers: translatedWeathers, baseDate: baseDate, baseTime: baseTime };
}






