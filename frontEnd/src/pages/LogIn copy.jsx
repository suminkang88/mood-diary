import React, { useState } from "react";
import axios from "axios";

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("login/", {
        username,
        password,
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      alert("로그인 성공!");
      window.location.href = "/"; // 홈으로 리디렉션
    } catch (err) {
      console.error(err.response?.data);
      alert("로그인 실패");
      window.location.href = "/";
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>로그인</h2>
      <input
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />
      <input
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default LogIn;
