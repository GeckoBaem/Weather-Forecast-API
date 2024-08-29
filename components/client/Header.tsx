"use client"

import Image from 'next/image'

export default function Header() {
    return (
        <div className="w-full h-[5vh] sm:h-[10vh] bg-[#0A0B0D] shadow-lg">
            <div className="h-full p-[0.75vh]">
                <div className='h-full flex flex-row items-center'>
                    <div className='h-full w-auto py-1 sm:py-[2vh] relative mx-2'>
                        <Image src={"/static/images/forecast-project-icon.svg"} alt='' width={1} height={1} style={{objectFit: 'contain', width: "auto", height: '100%'}}></Image>
                    </div>
                    <span className="font-['pretendard'] font-extrabold text-white text-base sm:text-xl">Weather Forecast API</span>
                </div>
            </div>
        </div>
    )
}