"use client"

import Image from 'next/image'

export default function Footer() {
    return (
        <div className="w-full h-[20vh] sm:h-[25vh] bg-[#0A0B0D] mt-[5vh] grid grid-rows-[80%_20%]">
            <div className='h-full flex flex-col justify-end'>
                <div className='h-1/2 w-full'>
                    <div className='h-1/2 flex flex-row items-center'>
                        <div className='h-full w-auto py-1 relative ml-5 sm:ml-7 mr-2'>
                            <Image src={"/static/images/forecast-project-icon.svg"} alt='' width={1} height={1} style={{ objectFit: 'contain', width: "auto", height: '100%' }}></Image>
                        </div>
                        <span className="font-['pretendard'] font-extrabold text-white text-base sm:text-xl">Weather Forecast API</span>
                    </div>
                    <span className='font-normal text-white text-xs sm:text-base mx-5 sm:mx-7'><b>Mail : </b>geckobaem@gmail.com</span>
                </div>
                <hr className='bg-white px-4 my-2' />
            </div>
            <div className='h-full w-full flex flex-row justify-end items-start'>
                <span className='font-normal text-white text-xs sm:text-base mx-5 sm:mx-7'>Copyright 2024. GeckoBaem. All right reserved.</span>
            </div>
        </div>
    )
}