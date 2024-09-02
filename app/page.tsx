"use client"

import { useEffect, useState } from "react";
import WeatherApi, { WeatherJsonData } from "@/components/server/WeatherApi";
import MainSection from "@/components/client/MainSection";
import ChartSection from "@/components/client/ChartSection";
import TodaySection from "@/components/client/TodaySection";

export default function Page() {
  const [weatherData, setWeatherData] = useState<WeatherJsonData | null>(null);

  useEffect(() => {
    async function FetchClientData() {
      const baseDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const setBaseTime = `${String(new Date().getHours()).padStart(2, '0')}30`;
      const baseTime = new Date().getMinutes() < 30 ? String(Number(setBaseTime) - 100).padStart(4, '0') : setBaseTime;

      const getLocalWeatherData = await JSON.parse(localStorage.getItem('localWeatherData')!);
      try {
        if (typeof window !== 'undefined') {
          if (getLocalWeatherData && baseDate === getLocalWeatherData.baseDate && baseTime === getLocalWeatherData.baseTime) {
            setWeatherData(await getLocalWeatherData);
          } else {
            const weatherApiData = await WeatherApi();
            setWeatherData(weatherApiData);
            localStorage.setItem('localWeatherData', JSON.stringify(weatherApiData));
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    FetchClientData();
  }, []);

  return (
    <div>
      <br />
      {weatherData ?
        (
          <div>
            <div className='w-full grid grid-cols-1 sm:grid-cols-[55%_45%]'>
              <div className="flex flex-col sm:mx-3 h-auto">
                <MainSection {...weatherData} />
                <ChartSection {...weatherData} />
                <div className="animate-fade-in h-[25vh] sm:h-[40vh] min-w-[335px] max-w-full bg-[#1E2836] rounded-3xl p-4 sm:p-6 relative overflow-hidden sm:mb-4">
                  <span className="text-[#6C7989] font-semibold text-sm sm:text-xl w-full">Air conditions</span>
                  <div className="flex flex-row justify-center items-center h-full w-full">
                    <span className="text-[#6C7989] font-semibold text-base sm:text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">To be Added in v2..</span>
                  </div>
                </div>
              </div>
              <div className='sm:mx-3 sm:relative my-2 sm:my-4'>
                <div className="animate-fade-in min-w-[335px] max-w-full bg-[#1E2836] rounded-3xl flex flex-col h-full">
                  <div className="overflow-y-auto h-full">
                    <TodaySection {...weatherData} />
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-fade-in h-[25vh] sm:h-[40vh] min-w-[335px] max-w-full bg-gradient-to-b from-[#1d2735] to-[#2f3030] rounded-3xl p-4 sm:p-6 relative overflow-hidden mb-2 sm:mb-4 sm:mx-3">
              <div className="flex flex-row justify-center items-center h-full w-full">
                <span className="text-[#6C7989] font-semibold text-base sm:text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">To be Added in v2..</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[125vh]">

          </div>
        )}
    </div>
  );
};
