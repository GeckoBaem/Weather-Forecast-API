import { baseTime, baseDate } from "./constants";
import { WeatherRawDataItem, Coordinate } from "./types";
import { getClientLocation, getWeatherData, addressTransform } from "../app/api/api-connecter";



/**
 * 
 * @returns { temps, skyForms, fallingForms, translatedWeathers, baseDate, baseTime }
 */
export async function processWeatherRawData() {
    const transformedLocation = await coordinateSysTransform();
    const nx = transformedLocation.nx;
    const ny = transformedLocation.ny;
    const rawWeatherData = await getWeatherData(nx, ny);
    const WeatherData = rawWeatherData!.throwData;

    if (rawWeatherData?.resultCode !== "00") return "NotFound";

    const temps = WeatherData
        .filter((weatherData: WeatherRawDataItem) => weatherData.category == "T1H")
        .map((weatherData: WeatherRawDataItem) => ({
            temp: weatherData.fcstValue,
            time: weatherData.fcstTime
        }));
    const skyForms = WeatherData
        .filter((weatherData: WeatherRawDataItem) => weatherData.category == "SKY")
        .map((weatherData: WeatherRawDataItem) => ({
            skyForm: skyFormTranslation(Number(weatherData.fcstValue)),
            time: weatherData.fcstTime
        }))
    const fallingForms = WeatherData
        .filter((weatherData: WeatherRawDataItem) => weatherData.category == "PTY")
        .map((weatherData: WeatherRawDataItem) => ({
            fallingForm: fallingFormTranslation(Number(weatherData.fcstValue)),
            time: weatherData.fcstTime
        }))

    const skyCodes = WeatherData
    .filter((weatherData: WeatherRawDataItem) => weatherData.category == "SKY")
    .map((weatherData: WeatherRawDataItem) => Number(weatherData.fcstValue))
    const fallingCodes = WeatherData
    .filter((weatherData: WeatherRawDataItem) => weatherData.category == "PTY")
    .map((weatherData: WeatherRawDataItem) => Number(weatherData.fcstValue))

    // 날씨 코드 변환 <string>
    const translatedWeathers = skyCodes.map((skyCode: number, index: number) => {
        return weatherTranslation(skyCode, fallingCodes[index]);
    });

    return { temps: temps, skyForms: skyForms, fallingForms: fallingForms, translatedWeathers: translatedWeathers, baseDate: baseDate, baseTime: baseTime };
}

// 기상 싱태 코드 변환
function skyFormTranslation(code: number){
    switch (code){
        case 1:
            return "맑음";
        case 3:
            return "구름 많음";
        case 4:
            return "흐림";
    }
}

// 날씨 상태 코드 변환
function fallingFormTranslation(code: number){ 
    switch (code){
        case 0:
            return "없음";
        case 1:
            return "비";
        case 2:
            return "비/눈";
        case 3:
            return "눈";
        case 5:
            return "빗방울";
        case 6:
            return "빗방울/눈날림";
        case 7:
            return "눈날림";
    }
}




// 기상 - 날씨 도합하여 최종 날씨 값 출력
export function weatherTranslation (skyFormCode: number, fallingFormCode: number) {
    const getSkyFormCode = skyFormTranslation(skyFormCode);
    const getFallingCode = fallingFormTranslation(fallingFormCode);
    
    const throwData = fallingFormCode === 0 ? getSkyFormCode : getFallingCode;

    return throwData;
}





// client IP 바탕 위치 탐색
export async function getClientCoordinate() {
    const clientIp = await getClientIp();
    const [latitude, longitude] = await getClientLocation(clientIp)
    return { latitude: latitude, longitude: longitude, clientIp: clientIp }
}





export async function getAddress() {
    const clientLocation = await getClientCoordinate();
    const latitude = clientLocation.latitude;
    const longitude = clientLocation.longitude;
    const clientIp = clientLocation.clientIp;
    console.log(latitude, longitude)

    const throwData = await addressTransform(latitude, longitude);
    return {address: throwData!, clientIp: clientIp};
}

// 좌표 변환 함수
async function dfsXyTransform(v1: number, v2: number): Promise<Coordinate> {
    // 계산 기본 설정 값
    const RE = 6371.00877;
    const GRID = 5.0;
    const SLAT1 = 30.0;
    const SLAT2 = 60.0;
    const OLON = 126.0;
    const OLAT = 38.0;
    const XO = 43;
    const YO = 136;
    
    const DEGRAD = Math.PI / 180.0;
    
    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;
    
    const sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    const snLog = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    const sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    const sfPow = Math.pow(sf, snLog) * Math.cos(slat1) / snLog;
    const ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    const roReSf = re * sfPow / Math.pow(ro, snLog);

    // 계산 시작
    const rs: Coordinate = { lat: 0, lng: 0, x: 0, y: 0 };

    rs.lat = v1;
    rs.lng = v2;

    const ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    const raReSf = re * sfPow / Math.pow(ra, snLog);
    let theta = v2 * DEGRAD - olon;
    theta = theta > Math.PI ? theta - 2.0 * Math.PI : theta < -Math.PI ? theta + 2.0 * Math.PI : theta;
    theta *= snLog;

    rs.x = Math.floor(raReSf * Math.sin(theta) + XO + 0.5);
    rs.y = Math.floor(roReSf - raReSf * Math.cos(theta) + YO + 0.5);

    return rs;
}





/**
 * 좌표 변환에 필요한 데이터 호출 후 계산
 * @returns nx, ny, clientIp(스토리지 저장용 비교 더미 데이터)
 */
export async function coordinateSysTransform() {
    const clientLocation = await getClientCoordinate();
    const clientLatitude = clientLocation.latitude;
    const clientLongitude = clientLocation.longitude;

    const TransformedCoordinate = dfsXyTransform(clientLatitude, clientLongitude);

    return { nx: (await TransformedCoordinate).x, ny: (await TransformedCoordinate).y, clientIp: clientLocation.clientIp }
}





export function isDay(currentTime: number) {

    const throwData = currentTime < 19 && currentTime > 4 ? true : false;

    return throwData;
}





export function weatherIcon(weatherStatus: string, getClientTime: number) {
    switch (weatherStatus) {
        case '맑음':
            if (isDay(getClientTime)) {
                return "/static/images/normal-day.svg";
            } else {
                return "/static/images/normal-night.svg";
            }
        case '구름 많음':
            if (isDay(getClientTime)) {
                return "/static/images/cloudy-day.svg";
            } else {
                return "/static/images/cloudy-night.svg";
            }
        case '흐림':
            return "/static/images/blur-cloud.svg"
        case '비':
            return "/static/images/raining.svg"
        case '비/눈':
            return "/static/images/raining-snowing.svg"
        case '눈':
            return "/static/images/snowing.svg"
        case '빗방울':
            return "/static/images/dew.svg"
        case '빗방울/눈날림':
            return "/static/images/dew-snowstorm.svg"
        case '눈날림':
            return "/static/images/snowstorm.svg"
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
        return rawClientIp;
    } catch (error) {
        console.log(`클라이언트 IP 획득 실패: ${error}`)
        return ""; // 학교~ (임시방편)
    }
}
