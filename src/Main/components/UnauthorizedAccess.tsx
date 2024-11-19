import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Text, keyframes } from "@chakra-ui/react";

const glitchKeyframes = keyframes`
  0% { transform: translate(0, 0); }
  20% { transform: translate(-5px, 5px); }
  40% { transform: translate(15px, -5px); }
  60% { transform: translate(-3px, 30px); }
  80% { transform: translate(3px, -3px); }
  100% { transform: translate(0, 0); }
`;

const UnauthorizedAccess: React.FC = () => {
  const [redirectCountdown, setRedirectCountdown] = useState<number>(10);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
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
  );
};

export default UnauthorizedAccess;
