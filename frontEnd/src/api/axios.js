// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

// 요청마다 access token을 헤더에 자동으로 추가
api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답에서 access token이 만료됐을 경우 자동으로 refresh token을 사용해 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(
          "http://localhost:8000/api/token/refresh/",
          {
            refresh: localStorage.getItem("refresh"),
          }
        );
        const newAccess = refreshRes.data.access;
        localStorage.setItem("access", newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axios(originalRequest); // 원래 요청 재전송
      } catch (err) {
        // refresh도 실패하면 강제 로그아웃
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
