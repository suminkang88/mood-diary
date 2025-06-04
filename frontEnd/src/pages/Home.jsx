import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoodForm from "../components/MoodForm";
import MoodList from "../components/MoodList";
import api from "../api/axios";
import { subDays, format } from "date-fns";

function Home({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleAnalyzeClick = async () => {
    try {
      const res = await api.get("mood/entries/list/");
      //const today = new Date();
      //테스트용:
      const today = new Date("2025-06-10");
      const last7days = Array.from({ length: 7 }, (_, i) =>
        format(subDays(today, i), "yyyy-MM-dd")
      );

      // 🔧 7일 이내 기록만 필터링
      const recordedDates = res.data
        .map((entry) => entry.created_at.slice(0, 10))
        .filter((date) => last7days.includes(date));

      // 날짜 겹치는지 확인
      const isFullWeek = last7days.every((date) =>
        recordedDates.includes(date)
      );

      console.log("last7days:", last7days);
      console.log("recordedDates:", recordedDates);

      if (!isFullWeek) {
        setError("최근 7일 동안 매일 감정이 기록되어야 분석이 가능해요!");
      } else {
        setError("");
        navigate("/stats");
      }
    } catch (err) {
      setError("데이터를 불러오지 못했어요. 다시 시도해주세요.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>감정일기 홈 📝</h1>
      {!isAuthenticated ? (
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => navigate("/login")}>로그인</button>
          <button onClick={() => navigate("/signup")}>회원가입</button>
        </div>
      ) : (
        <>
          <div
            style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}
          >
            <div style={{ flex: 1 }}>
              <MoodForm setRefresh={setRefresh} />
            </div>
            <div style={{ flex: 1 }}>
              <MoodList refresh={refresh} setRefresh={setRefresh} />
            </div>
          </div>
          <div className="p-4 flex flex-col gap-4 items-center">
            <button
              onClick={handleAnalyzeClick}
              className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600"
            >
              일주일간 감정분석
            </button>
            {error && <p className="text-red-500 font-medium">{error}</p>}
          </div>
          <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
            로그아웃
          </button>
        </>
      )}
    </div>
  );
}
export default Home;
