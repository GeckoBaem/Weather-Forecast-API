"use server"

//대~단하다 기상청~!!!!! 위~대하다 기상청~~!!!!

import GetClientCoordinate from "./GetClientCoordinate";

interface Coordinate {
    lat: number;
    lng: number;
    x: number;
    y: number;
}

const RE = 6371.00877;
const GRID = 5.0;
const SLAT1 = 30.0;
const SLAT2 = 60.0;
const OLON = 126.0;
const OLAT = 38.0;
const XO = 43;
const YO = 136;

const DEGRAD = Math.PI / 180.0;

const re = RE / GRID;
const slat1 = SLAT1 * DEGRAD;
const slat2 = SLAT2 * DEGRAD;
const olon = OLON * DEGRAD;
const olat = OLAT * DEGRAD;

const sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
const snLog = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
const sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
const sfPow = Math.pow(sf, snLog) * Math.cos(slat1) / snLog;
const ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
const roReSf = re * sfPow / Math.pow(ro, snLog);

async function dfsXyTransform(v1: number, v2: number): Promise<Coordinate> {
    const rs: Coordinate = { lat: 0, lng: 0, x: 0, y: 0 };

    rs.lat = v1;
    rs.lng = v2;

    const ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    const raReSf = re * sfPow / Math.pow(ra, snLog);
    let theta = v2 * DEGRAD - olon;
    theta = theta > Math.PI ? theta - 2.0 * Math.PI : theta < -Math.PI ? theta + 2.0 * Math.PI : theta;
    theta *= snLog;

    rs.x = Math.floor(raReSf * Math.sin(theta) + XO + 0.5);
    rs.y = Math.floor(roReSf - raReSf * Math.cos(theta) + YO + 0.5);

    return rs;
}

export default async function CoordinateSysTransform() {
    const clientLocation = await GetClientCoordinate();
    const clientLatitude = clientLocation.latitude;
    const clientLongitude = clientLocation.longitude;

    const TransformedCoordinate = dfsXyTransform(clientLatitude, clientLongitude);

    return { nx: (await TransformedCoordinate).x, ny: (await TransformedCoordinate).y, clientIp: clientLocation.clientIp }
}