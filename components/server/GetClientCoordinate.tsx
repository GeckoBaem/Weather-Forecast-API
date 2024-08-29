"use server"

export async function GetClientIp() {
    try {
        const res = await fetch("https://ifconfig.me/ip");
        const rawClientIp = res.text();
        return rawClientIp;
    } catch (error) {
        console.log(`클라이언트 IP 획득 실패: ${error}`)
        return ""; // 학교~ (임시방편)
    }
}

async function GetClientLocation(clientIp: string) {
    const res = await fetch(`https://api.ip2location.io/?key=${process.env.GEOLOCATION_API_KEY}&ip=${clientIp}`)
        .then(res => res.json())
    const latitude: number = res.latitude;
    const longitude: number = res.longitude;
    return [latitude, longitude]
}

export default async function GetClientCoordinate() {
    const clientIp = await GetClientIp();
    const [latitude, longitude] = await GetClientLocation(clientIp)
    return { latitude: latitude, longitude: longitude, clientIp: clientIp }
}