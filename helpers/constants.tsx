"use client"

const now = new Date();

// 기상청 APi 호출용, 20240902 형식
export const baseDate = now.toISOString().slice(0, 10).replace(/-/g, "");

// 기상청 API 업데이트 때매 30분 기준으로 베이스 시각 정함
const setBaseTime = `${String(now.getHours()).padStart(2, '0')}30`;
export const baseTime = now.getMinutes() < 30 ? String(Number(setBaseTime) - 100).padStart(4, '0') : setBaseTime;

