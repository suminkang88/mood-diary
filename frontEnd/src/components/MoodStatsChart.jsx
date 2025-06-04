import React, { useEffect, useState } from "react";
import api from "../api/axios"; // 사용자 설정 axios 인스턴스
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#FFCC00", "#00C49F", "#FF8042", "#8884D8", "#FF6666"]; // 감정별 색

const MoodStatsChart = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    api
      .get("mood/stats/last7days/") // baseURL이 '/api'라면 '/api/stats/last7days/'까지 자동 처리됨
      .then((res) => {
        const result = res.data;
        const stats = result.data || [];
        setStartDate(result.start);
        setEndDate(result.end);
        const allEmotions = ["happy", "sad", "neutral", "angry", "tired"];

        //API 응답 결과에서 allEmotions 배열을 기준으로 누락된 감정도 count: 0으로 채워서 항상 5개의 감정 데이터를 만들기 위한 처리
        const completeData = allEmotions.map((emoti) => {
          const found = result.data.find((r) => r.emoticon === emo);
          return { emoticon: emoti, count: found ? found.count : 0 };
        });

        setData(completeData);
      })
      .catch((err) => {
        console.error("감정 통계 불러오기 실패:", err);
      });
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">가장 최근 연속 7일 감정 통계</h2>
      {startDate && endDate && (
        <p className="text-gray-700 mb-4 text-sm">
          분석 기간: {startDate} ~ {endDate}
        </p>
      )}
      <PieChart width={360} height={360}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="emoticon"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default MoodStatsChart;
