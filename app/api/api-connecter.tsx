"use server"

import { WeatherRawDataItem } from "../../helpers/types";
// import { baseTime, baseDate } from "@/app/layout";

const now = new Date();
const baseDate = now.toISOString().slice(0, 10).replace(/-/g, "");

// 기상청 API 업데이트 때매 30분 기준으로 베이스 시각 정함
const setBaseTime = `${String(now.getHours()).padStart(2, '0')}30`;
const baseTime = now.getMinutes() < 30 ? String(Number(setBaseTime) - 100).padStart(4, '0') : setBaseTime;

/**
 * 
 * @param nx 기상청 좌표 X축
 * @param ny 기상청 좌표 Y축
 * @returns [{fcstValue, fcstTime, category}, ...]
 * @throws Error 출력 상태 존재
 */
export async function getWeatherData(nx: number, ny: number) {
    try {
        const res = await fetch(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.WEATHER_API_KEY}&pageNo=1&numOfRows=70&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`)
            .then(res => res.json());
        const data = res.response.body.items.item;
        const throwData = data.map((data: WeatherRawDataItem) => ({
            fcstValue: data.fcstValue,
            fcstTime: data.fcstTime,
            category: data.category
        }))
        const resultCode = res.response.header.resultCode;
        return {throwData: throwData, resultCode: resultCode};
    } catch (error) {
        console.error(`Weather API: 정보를 불러올 수 없습니다. Status: ${error}`);
    }
}

/**
 * 
 * @param clientIp 
 * @returns [latitude, longitude]
 */
export async function getClientLocation(clientIp: string) { // 눈찢계 <- 이거 누가 씀???;;
    const res = await fetch(`https://api.ip2location.io/?key=${process.env.GEOLOCATION_API_KEY}&ip=${clientIp}`)
        .then(res => res.json())
    const latitude: number = Number(res.latitude);
    const longitude: number = Number(res.longitude);
    return [latitude, longitude]
}

/**
 * 
 * @param latitude 
 * @param longitude 
 * @returns 지역명 출력 (용인시 처인구 김량장동)
 * @throws Error 출력 상태 존재
 */
export async function addressTransform(latitude: number, longitude: number) {
    console.log(latitude, longitude)
    try {
        const res = await fetch(`https://api.vworld.kr/req/address?service=address&request=GetAddress&key=${process.env.GEOCODER_API_KEY}&point=${longitude},${latitude}&type=BOTH`)
            .then((res) => res.json());
        console.log(res);
        switch (res.response.status) {
            case "OK":
                JSON.stringify(res);
                return `${res.response.result[0].structure.level2} ${res.response.result[0].structure.level4L}`;
            case "NOT_FOUND":
                return "정보를 찾을 수 없는 지역입니다.";
            case "ERROR":
                throw res.response.error.text;
        }
    } catch (error) {
        console.error( `GeoCoder API 에러: ${error}`);
    }
}