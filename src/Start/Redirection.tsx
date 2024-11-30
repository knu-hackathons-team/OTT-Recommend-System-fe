import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { Box, Spinner, Text } from "@chakra-ui/react";

// Response 타입 정의
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const Redirection: React.FC = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // URL에서 code 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code: string | null = urlParams.get("code");

    if (code) {
      // 백엔드에 GET 요청을 보내서 토큰을 가져옴
      axios
        .get<AuthResponse>(`${BASE_URL}/api/auth/oauth/kakao/callback`, {
          params: { code }, // 쿼리 파라미터로 code 전달
        })
        .then((response: AxiosResponse<AuthResponse>) => {
          // 응답에서 accessToken과 refreshToken을 로컬스토리지에 저장
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          // /main으로 이동
          navigate("/main");
        })
        .catch((error: Error) => {
          console.error("토큰 요청 에러:", error);
        });
    }
  }, [navigate, BASE_URL]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      backgroundColor="gray.100"
    >
      <Spinner size="xl" color="teal.500" />
      <Text fontSize="xl" mt={4}>
        카카오 로그인 중입니다...
      </Text>
    </Box>
  );
};

export default Redirection;
