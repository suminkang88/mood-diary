import React, { useState } from "react";
//axios: HTTP 요청을 보낼 수 있는 라이브러리
import api from "../api/axios";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //async(비동기 처리): ui전체를 멈추지 않고 네트워크 요청 처리.
  const handleSignup = async () => {
    try {
      //await: 응답이 올 때까지 그 줄만 잠깐 멈춤.
      const res = await api.post("signup/", {
        username,
        password,
      });
      //localStorage: 브라우저나 탭을 닫아도 유지. 로그인 상태 유지에 적합.
      //sessionStorage: 탭을 닫으면 사라짐.
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      alert("회원가입 성공! 로그인 상태 유지됩니다.");
      window.location.href = "/";
    } catch (err) {
      console.error(err.response?.data);
      alert("회원가입 실패");
      window.location.href = "/";
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>회원가입</h2>
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
      <button onClick={handleSignup}>회원가입</button>
    </div>
  );
}

export default SignUp;
