import React from "react";
import { Center, Text, VStack, Box, Image } from "@chakra-ui/react";
import kakaooButtonImage from "./assets/kakaoButton.svg";

const StartPage: React.FC = () => {
  const handleKakaoLogin = () => {
    window.location.href = "http://ott.knu-soft.site/api/auth/oauth/kakao";
  };

  return (
    <Center height="100vh" bg="gray.100">
      <VStack spacing={8} position="relative">
        {/* 메인 텍스트 */}
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
          Welcome to OTT Recommender
        </Text>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" mt={-5}>
          Discover the best OTT content tailored for you
        </Text>

        {/* 카카오 로그인 버튼 */}
        <Box
          as="button"
          onClick={handleKakaoLogin}
          transition="transform 0.2s"
          _hover={{
            transform: "scale(1.05)",
          }}
          _active={{
            transform: "scale(0.95)",
          }}
        >
          <Image
            src={kakaooButtonImage}
            alt="Login with Kakao"
            height="48px"
            cursor="pointer"
          />
        </Box>
        {/* 책갈피 스타일 */}
        <Box
          color="gray.500"
          px={4}
          py={2}
          fontSize="sm"
          fontWeight="light"
          textAlign={"center"}
        >
          <Text>Software Design Course in Kyungpook National University</Text>
          <Text>Copyright(c) 2024, Lee Jiho, Choi Kiyeong</Text>
        </Box>
      </VStack>
    </Center>
  );
};

export default StartPage;
