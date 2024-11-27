import React from "react";
import { Box, Heading, ChakraProvider } from "@chakra-ui/react";

const Friends: React.FC = () => {
  return (
    <ChakraProvider>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bg="gray.100"
      >
        <Box
          p={8}
          maxWidth="500px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          bg="white"
        >
          <Heading as="h1" size="xl" mb={4} textAlign="center">
            친구 관리 페이지입니다.
          </Heading>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Friends;
