import { WeatherJsonData } from "@/components/server/WeatherApi";
import Image from 'next/image'
import { WeatherIcon } from "@/components/client/WeatherIcon";

interface TempsItem {
    time: number,
    temp: number
}

function WeatherDisplay(time: number, weather: string, temp: number) {
    function formatTime(number: number) {
        const numberStr = number.toString();
        const hours = numberStr.slice(0, -2);
        const minutes = numberStr.slice(-2);
        return `${hours}:${minutes}`;
    }
    const stringedTime = formatTime(time);

    return (
        <div className="w-full h-auto grid grid-cols-[20%_30%_30%_20%] px-3">
            <span className="text-[#6C7989] font-semibold text-base sm:text-2xl self-center">{stringedTime}</span>
            <div className="h-auto flex flex-row justify-center items-center">
                <div className="h-[5vh] sm:h-[10vh] w-auto relative mr-1 sm:mr-2 my-5 sm:my-8">
                    <Image src={WeatherIcon(weather, Number(time.toString().slice(0, -2)))!} alt="" width={1} height={1} style={{ objectFit: 'contain', width: "auto", height: '100%' }} className="min-w-[40px]" />
                </div>
            </div>
            <span className="text-white font-semibold text-base sm:text-2xl ml-2 sm:ml-4 self-center">{weather}</span>
            <span className="text-white font-semibold text-base sm:text-2xl self-center text-right">{`${temp}°`}</span>
        </div>
    )
}

export default function TodaySection(weatherData: WeatherJsonData) {
    const getTime = weatherData.temps.map((data: TempsItem) => data.time);
    const getWeather = weatherData.translatedWeathers;
    const getTemp = weatherData.temps.map((data: TempsItem) => data.temp);

    return (
        <div className="overflow-x-hidden mb-2 sm:mb-4 w-full h-full sm:absolute left-0 top-0 scrollbar-hide">
            {weatherData ?
                (
                    <div className="p-4 sm:p-6">
                        <span className="text-[#6C7989] font-semibold text-sm sm:text-xl w-full">Today’s Weather Forecast</span>
                        {getTime.map((timeData, index) => (WeatherDisplay(timeData, getWeather[index], getTemp[index])))}
                        <div className="h-[50vh] w-full bg-gray flex justify-center items-center text-[#6C7989] font-semibold text-sm sm:text-xl">
                            To be Added in v2..
                        </div>
                    </div>
                )
                :
                (
                    <div className="h-[25vh] sm:h-[40vh] w-full flex">
                        <div className="h-full w-full bg-[#25282b] rounded-3xl"></div>
                    </div>
                )
            }
        </div>
    )
}