"use server"

//국토교통부는 신이야!!!!!

import GetClientCoordinate from "./GetClientCoordinate"

async function AddressTransform(latitude: number, longitude: number) {
    try {
        const res = await fetch(`https://api.vworld.kr/req/address?service=address&request=GetAddress&key=${process.env.GEOCODER_API_KEY}&point=${longitude},${latitude}&type=BOTH`)
            .then(res => res.json());

        switch (res.response.status) {
            case "OK":
                JSON.stringify(res);
                return `${res.response.result[0].structure.level2} ${res.response.result[0].structure.level4L}`;
            case "NOT_FOUND":
                return "정보를 찾을 수 없는 지역입니다.";
            case "ERROR":
                throw res.response.error.text;
        }
    } catch (error) {
        return `GeoCoder API 에러: ${error}`
    }

}

export default async function GetAddress() {
    const clientLocation = await GetClientCoordinate();
    const latitude = clientLocation.latitude;
    const longitude = clientLocation.longitude;
    const clientIp = clientLocation.clientIp;

    const throwData = await AddressTransform(latitude, longitude);
    return {address: throwData!, clientIp: clientIp};
}

export type GetAddressItem = {
    address: string,
    clientIp: string
}