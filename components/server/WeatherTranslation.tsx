export function SkyFormTranslation(code: number){
    switch (code){
        case 1:
            return "맑음";
        case 3:
            return "구름 많음";
        case 4:
            return "흐림";
    }
}

export function fallingFormTranslation(code: number){ 
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

export function WeatherTranslation (skyFormCode: number, fallingFormCode: number) {
    const getSkyFormCode = SkyFormTranslation(skyFormCode);
    const getFallingCode = fallingFormTranslation(fallingFormCode);
    
    const throwData = fallingFormCode === 0 ? getSkyFormCode : getFallingCode;

    return throwData;
}