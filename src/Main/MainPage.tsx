import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { login } from "../api/auth";
import type { LoginData, TokenResponse } from "../api/type";
const LoginForm = () => {
  const [formData, setFormData] = useState<LoginData>({
    name: "",
    email: "",
  });
  const [tokens, setTokens] = useState<TokenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const maskToken = (token: string) => {
    if (token.length <= 8) return "********";
    return token.slice(0, 4) + "..." + token.slice(-4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await login(formData);
      setTokens(data);

      toast({
        title: "로그인 성공",
        description: "토큰이 발급되었습니다",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "로그인 실패",
        description:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} maxW="400px" mx="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>이름</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>이메일</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            isLoading={isLoading}
          >
            로그인
          </Button>

          {tokens && (
            <Box
              mt={4}
              p={4}
              borderRadius="md"
              bg="gray.50"
              width="100%"
              shadow="sm"
            >
              <VStack align="stretch" spacing={3}>
                <Box>
                  <Badge colorScheme="green" mb={1}>
                    Access Token
                  </Badge>
                  <Text fontSize="sm" fontFamily="mono">
                    {maskToken(tokens.accessToken)}
                  </Text>
                </Box>
                <Box>
                  <Badge colorScheme="purple" mb={1}>
                    Refresh Token
                  </Badge>
                  <Text fontSize="sm" fontFamily="mono">
                    {maskToken(tokens.refreshToken)}
                  </Text>
                </Box>
              </VStack>
            </Box>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default LoginForm;
