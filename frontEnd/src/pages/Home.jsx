import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoodForm from "./MoodForm";
import MoodList from "./MoodList";

function Home({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    alert("로그아웃 되었습니다.");
    navigate("/");
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
          <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
            로그아웃
          </button>
        </>
      )}
    </div>
  );
}
export default Home;
