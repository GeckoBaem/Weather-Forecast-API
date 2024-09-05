"use server"

import { WeatherRawDataItem } from "../helpers/types";
// import { baseTime, baseDate } from "@/app/layout";

/**
 * 
 * @param nx 기상청 좌표 X축
 * @param ny 기상청 좌표 Y축
 * @returns [{fcstValue, fcstTime, category}, ...]
 * @throws Error 출력 상태 존재
 */
export async function getWeatherData(nx: number, ny: number, baseDate: string, baseTime: string) {
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
        return { throwData: throwData, resultCode: resultCode };
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

const headers = new Headers();
headers.append('Authorization', `${process.env.KAKAO_GEOCODER_REST_KEY}`);

export async function addressTransform(latitude: number, longitude: number) {
    try {
        const res = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&type=BOTH`, {
            headers: {
                Authorization: `KakaoAK ${process.env.KAKAO_GEOCODER_REST_KEY}`
            }
        })
            .then((res) => res.json());
            return `${res.documents[0].address.region_2depth_name} ${res.documents[0].address.region_3depth_name}`;
    } catch (error) {
        console.error(`GeoCoder API 에러: ${error}`);
    }
}