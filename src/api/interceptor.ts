import axios from "axios";

// .env 파일의 API 기본 URL 가져오기
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: apiBaseUrl, // .env에서 지정한 API 기본 URL
});

// 리프레시 토큰 요청 함수
const requestRefreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken"); // 로컬스토리지에서 리프레시 토큰 가져오기
    if (!refreshToken) {
      throw new Error("리프레시 토큰이 없습니다.");
    }

    const response = await axios.post(`${apiBaseUrl}/auth/refresh`, {
      refreshToken,
    });

    // 새로운 액세스 토큰과 리프레시 토큰 저장
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken; // 새로운 액세스 토큰 반환
  } catch (error) {
    console.error("리프레시 토큰 요청 실패:", error);
    localStorage.clear();
    window.location.href = "/login"; // 실패 시 로그아웃 처리
    throw error;
  }
};

// 요청 인터셉터: Authorization 헤더 추가
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`; // 토큰 추가
  }
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 460) {
      // 로그아웃 처리
      localStorage.clear();
      window.location.href = "/login";
    } else if (status === 461) {
      // 리프레시 토큰 요청 후 재시도
      try {
        const newAccessToken = await requestRefreshToken();
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(error.config); // 원래 요청 재시도
      } catch (refreshError) {
        console.error("리프레시 토큰 갱신 중 오류:", refreshError);
        throw refreshError;
      }
    } else {
      // 기타 에러 처리
      console.error("에러가 발생했습니다:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
