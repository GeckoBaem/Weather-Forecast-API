export function isDay(currentTime: number) {

    const throwData = currentTime < 19 && currentTime > 4 ? true : false;

    return throwData;
}


export function WeatherIcon(weatherStatus: string, getClientTime: number) {
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