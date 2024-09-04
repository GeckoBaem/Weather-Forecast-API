"use server"

import { WeatherRawDataItem } from "../../helpers/types";
import { baseTime, baseDate } from "../../helpers/constants";

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
        console.log("API 잘 작동 1")
        return throwData;
    } catch (error) {
        return `Weather API: 정보를 불러올 수 없습니다. Status: ${error}`;
    }
}

/**
 * 
 * @returns client IP <string>
 */
export async function getClientIp() {
    try {
        const res = await fetch("https://ifconfig.me/ip");
        const rawClientIp = res.text();
        console.log("API 잘 작동 2")
        console.log("가져온 아이피 : " + rawClientIp)
        return rawClientIp;
    } catch (error) {
        console.log(`클라이언트 IP 획득 실패: ${error}`)
        return ""; // 학교~ (임시방편)
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
    const latitude: number = res.latitude;
    const longitude: number = res.longitude;
    console.log("API 잘 작동 3")
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
    try {
        const res = await fetch(`https://api.vworld.kr/req/address?service=address&request=GetAddress&key=${process.env.GEOCODER_API_KEY}&point=${longitude},${latitude}&type=BOTH`)
            .then(res => res.json());

        switch (res.response.status) {
            case "OK":
                JSON.stringify(res);
                return `${res.response.result[0].structure.level2} ${res.response.result[0].structure.level4L}`;
            case "NOT_FOUND":
                return "정보를 찾을 수 없는 지역입니다.";
            case "ERROR":
                throw res.response.error.text;
        }
        console.log("API 잘 작동 4")
    } catch (error) {
        return `GeoCoder API 에러: ${error}`
    }
}