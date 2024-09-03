interface WeatherData {
    category: string,
    fcstValue: number,
    fcstTime: number,
    temp: number,
    skyForm: string,
    fallingForm: string,
}

export type WeatherRawDataItem = Pick<WeatherData, "category" | "fallingForm" | "fcstTime" | "fcstValue" | "skyForm" | "temp">

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

// 주소명 불러올 때 사용
export type GetAddressItem = {
    address: string,
    clientIp: string
}

// 좌표 변환 계산 시 사용
export type Coordinate = {
    lat: number;
    lng: number;
    x: number;
    y: number;
}
