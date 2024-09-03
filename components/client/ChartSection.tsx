"use client"

import { WeatherJsonData } from "@/helpers/types";
import TempChart from "@/components/client/TempChart";

export default function ChartSection(weatherData: WeatherJsonData) {

    return (
        <div className="overflow-hidden mb-2 sm:mb-4">
            {weatherData ?
                (
                    <div className="animate-fade-in h-auto min-w-[335px] max-w-full bg-[#1E2836] rounded-3xl p-4 sm:p-6 flex flex-col justify-between" >
                        <span className="text-[#6C7989] font-semibold text-sm sm:text-xl w-full">Temperature Graph</span>
                        <TempChart {...weatherData} />
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