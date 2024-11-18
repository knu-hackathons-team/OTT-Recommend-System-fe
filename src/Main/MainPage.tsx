import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  VStack,
  Center,
  Text,
  Spinner,
  keyframes,
} from "@chakra-ui/react";
import api from "../api/interceptor"; // interceptor.ts에서 설정한 API 인스턴스 가져오기

type Content = {
  id: number;
  showId: string;
  type: string;
  title: string;
  director: string;
  cast: string;
  country: string;
  dateAdded: string;
  releaseYear: string;
  rating: string;
  duration: string;
  listedIn: string;
  description: string;
};

const glitchKeyframes = keyframes`
  0% { transform: translate(0, 0); }
  20% { transform: translate(-5px, 5px); }
  40% { transform: translate(5px, -5px); }
  60% { transform: translate(-3px, 3px); }
  80% { transform: translate(3px, -3px); }
  100% { transform: translate(0, 0); }
`;

function MainPage(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [randomContents, setRandomContents] = useState<Content[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(10); // 10초 카운트다운
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
      fetchRandomContents(); // 랜덤 콘텐츠를 가져옴
    } else {
      setIsLoggedIn(false);

      // 10초 카운트다운 설정
      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval); // 카운트다운 종료
            navigate("/"); // 로그인 페이지로 이동
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 클리어
    }
  }, [navigate]);

  const fetchRandomContents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/random/3"); // interceptor에서 Authorization 헤더 자동 추가
      const contents = response.data.map(
        (item: { content: Content }) => item.content
      ); // content만 추출
      setRandomContents(contents);
    } catch (error) {
      console.error("랜덤 콘텐츠를 가져오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = (): void => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <Center
      minHeight="100vh"
      bg={isLoggedIn ? "gray.50" : "black"}
      padding={4}
      animation={isLoggedIn ? undefined : `${glitchKeyframes} 0.1s infinite`}
    >
      {isLoggedIn ? (
        <VStack
          spacing={6}
          boxShadow="lg"
          p={8}
          rounded="md"
          bg="white"
          maxWidth="800px"
          textAlign="center"
        >
          <Heading size="lg" color="teal.500">
            환영합니다! 메인 페이지입니다.
          </Heading>
          <Button colorScheme="teal" onClick={handleLogout}>
            로그아웃
          </Button>
          <Box width="100%">
            <Heading size="md" mb={4}>
              랜덤 콘텐츠
            </Heading>
            {isLoading ? (
              <Center>
                <Spinner size="lg" />
              </Center>
            ) : randomContents ? (
              randomContents.map((content) => (
                <Box
                  key={content.id}
                  p={4}
                  mb={4}
                  boxShadow="md"
                  rounded="lg"
                  bg="gray.100"
                  textAlign="left"
                >
                  <Text fontWeight="bold" mb={2}>
                    {content.title} ({content.releaseYear})
                  </Text>
                  <Text>감독: {content.director || "정보 없음"}</Text>
                  <Text>출연진: {content.cast || "정보 없음"}</Text>
                  <Text>국가: {content.country || "정보 없음"}</Text>
                  <Text>장르: {content.listedIn || "정보 없음"}</Text>
                  <Text fontSize="sm" mt={2}>
                    {content.description || "설명이 없습니다."}
                  </Text>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    추가 날짜: {content.dateAdded}
                  </Text>
                </Box>
              ))
            ) : (
              <Text>표시할 콘텐츠가 없습니다.</Text>
            )}
          </Box>
        </VStack>
      ) : (
        <Box
          textAlign="center"
          animation={`${glitchKeyframes} 0.1s infinite`}
          color="white"
        >
          <Text fontSize={["lg", "xl", "3xl"]} fontWeight="bold" mb={2}>
            🤬올바른 경로로 접속하지 않았습니다.
          </Text>
          <Text fontSize={["md", "lg", "2xl"]} color="red.500">
            {redirectCountdown}초 뒤 당신은 사망합니다.
          </Text>
        </Box>
      )}
    </Center>
  );
}

export default MainPage;
