'use client'

import { useEffect, useState } from "react"
import { GetAddressItem, WeatherJsonData } from "@/helpers/types";
import { getClientCoordinate, isDay, weatherIcon, getClientIp } from "@/helpers/data-processing";
import { addressTransform } from "@/app/api/api-connecter";
import Image from 'next/image'

interface TempsItem {
    time: number,
    temp: number
}

export default function MainSection(weatherData: WeatherJsonData) {
    const [addressData, setAddressData] = useState<GetAddressItem | null>(null);
    const [clientTime, setClientTime] = useState(GetTime());
    const getTemp = weatherData.temps.map((data: TempsItem) => data.temp);
    const getWeather = weatherData.translatedWeathers
    const clientHour = new Date().getHours();

    function GetTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setClientTime(GetTime());
        }, 10000);
        return () => clearInterval(intervalId);
    }, [])

    async function getAddress() {
        const clientLocation = await getClientCoordinate();
        const latitude = clientLocation.latitude;
        const longitude = clientLocation.longitude;
        const clientIp = clientLocation.clientIp;
        console.log("fheld")

        const throwData = await addressTransform(latitude, longitude);
        return ({ address: throwData!, clientIp: clientIp });
    }


    useEffect(() => {
        async function FetchClientData() {
            const clientIp = await getClientIp();

            const getLocalAddressData = await JSON.parse(localStorage.getItem('localAddressData')!);
            try {
                if (await typeof window !== 'undefined') {
                    if (getLocalAddressData && clientIp == getLocalAddressData.clientIp) {
                        setAddressData(getLocalAddressData);
                    } else {
                        const catchAddress = await getAddress();
                        setAddressData(catchAddress);
                        localStorage.setItem('localAddressData', JSON.stringify(catchAddress));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        FetchClientData();
        console.log(addressData)
    }, [])
    
    return (
        <div className="overflow-hidden mb-2 sm:mb-4">
            {weatherData && addressData ?
                (isDay(clientHour) ?
                    <div className="animate-fade-in h-full min-w-[335px] max-w-full bg-gradient-to-b from-[#181818] via-[#171b21] to-[#302d21] rounded-3xl p-4 sm:p-6 flex flex-row justify-between">
                        <div className="h-auto relative">
                            <div className="">
                                <div className="text-white font-bold text-base sm:text-3xl">{addressData?.address}</div>
                                <div className="text-white font-regular text-base sm:text-2xl my-1">{clientTime}</div>
                                <div className="h-3 sm:h-5 flex flex-row items-center mb-5">
                                    <div className="h-full w-auto relative mr-1 sm:mr-2">
                                        <Image src={"/static/images/government-logo.svg"} alt="" width={1} height={1} style={{ objectFit: 'contain', width: "auto", height: '100%' }} />
                                    </div>
                                    <span className="text-[#6C7989] font-extrabold text-[0.5rem] sm:text-base">기상청 정보 제공</span>
                                </div>
                            </div>
                            <div className="absolute bottom-0">
                                <div className="flex flex-row items-end">
                                    <span className="text-white font-bold text-3xl sm:text-5xl max drop-shadow-lg whitespace-nowrap">{getWeather[0]}</span>
                                    <span className="text-white font-light text-2xl sm:text-4xl ml-2 sm:ml-5 drop-shadow-lg">{`${getTemp[0]}°C`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[15vh] sm:h-[30vh] w-auto relative py-[3vh] sm:py-[6vh] px-[5%]">
                            <Image src={weatherIcon(weatherData.translatedWeathers[0], clientHour)!} alt="" width={1} height={1} style={{ objectFit: 'contain', width: "auto", height: '100%' }} className="min-w-[80px] animate-float" />
                        </div>
                    </div>
                    :
                    <div className="animate-fade-in h-full min-w-[335px] max-w-full bg-gradient-to-b from-[#181818] via-[#171b21] to-[#342D48] rounded-3xl p-4 sm:p-6 flex flex-row justify-between">
                        <div className="h-auto relative">
                            <div className="">
                                <div className="text-white font-bold text-base sm:text-3xl">{addressData?.address}</div>
                                <div className="text-white font-regular text-base sm:text-2xl my-1">{clientTime}</div>
                                <div className="h-3 sm:h-5 flex flex-row items-center mb-5">
                                    <div className="h-full w-auto relative mr-1 sm:mr-2">
                                        <Image src={"/static/images/government-logo.svg"} alt="" width={1} height={1} style={{ objectFit: 'contain', width: "auto", height: '100%' }} />
                                    </div>
                                    <span className="text-[#6C7989] font-extrabold text-[0.5rem] sm:text-base">기상청 정보 제공</span>
                                </div>
                            </div>
                            <div className="absolute bottom-0">
                                <div className="flex flex-row items-end">
                                    <span className="text-white font-bold text-3xl sm:text-5xl max drop-shadow-lg whitespace-nowrap">{getWeather[0]}</span>
                                    <span className="text-white font-light text-2xl sm:text-4xl ml-2 sm:ml-5 drop-shadow-lg">{`${getTemp[0]}°C`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[15vh] sm:h-[30vh] w-auto relative py-[3vh] sm:py-[6vh] px-[5%]">
                            <Image src={weatherIcon(weatherData.translatedWeathers[0], clientHour)!} alt="" width={1} height={1} style={{ objectFit: 'contain', width: "auto", height: '100%' }} className="min-w-[80px] animate-float" />
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