import React from "react";
import { Center, Text, VStack, Box, Image } from "@chakra-ui/react";
import kakaooButtonImage from "./assets/kakaoButton.svg";

const StartPage: React.FC = () => {
  const handleKakaoLogin = () => {
    window.location.href = "http://ott.knu-soft.site/api/auth/oauth/kakao";
  };

  return (
    <Center height="100vh" bg="gray.100">
      <VStack spacing={8}>
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
          Welcome to OTT Recommender
        </Text>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
          Discover the best OTT content tailored for you
        </Text>
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
      </VStack>
    </Center>
  );
};

export default StartPage;
