import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  ChakraProvider,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  Stack,
  Divider,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import api from "../api/interceptor";

const Friends: React.FC = () => {
  const [view, setView] = useState<"list" | "pending">("list");
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [email, setEmail] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get("/api/friend");
        setFriends(response.data);
      } catch (error) {
        console.error("친구 목록을 가져오는 중 오류 발생:", error);
      }
    };
    fetchFriends();
  }, []);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await api.get("/api/friend/pending");
        setPendingRequests(response.data);
      } catch (error) {
        console.error("대기 중인 친구 요청을 가져오는 중 오류 발생:", error);
      }
    };
    fetchPendingRequests();
  }, []);

  const sendFriendRequest = async () => {
    if (!email) return; // 이메일이 없으면 전송 안 함
    try {
      await api.post("/api/friend", { email });
      toast({
        title: "친구 요청 성공!",
        description: `${email}님에게 친구 요청을 보냈습니다.`,
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
      setEmail(""); // 입력창 초기화
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast({
          title: "에러",
          description: "해당 이메일을 가진 사용자를 찾을 수 없습니다.",
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "top",
        });
      } else if (error.response?.status === 400) {
        toast({
          title: "에러",
          description: "본인에게는 친구 요청을 할 수 없습니다.",
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "top",
        });
      } else {
        console.error("친구 요청 중 오류 발생:", error);
      }
    }
  };

  const acceptRequest = async (id: number) => {
    try {
      await api.put(`/api/friend/accept/${id}`);
      toast({
        title: "친구 요청 수락",
        description: "친구 요청을 수락했습니다.",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
      setPendingRequests((prev) =>
        prev.filter((request) => request.friendRequestId !== id)
      );
    } catch (error) {
      console.error("친구 요청 수락 중 오류 발생:", error);
    }
  };

  const rejectRequest = async (id: number) => {
    try {
      await api.delete(`/api/friend/${id}`);
      toast({
        title: "친구 요청 거절",
        description: "친구 요청을 거절했습니다.",
        status: "info",
        duration: 1500,
        isClosable: true,
      });
      setPendingRequests((prev) =>
        prev.filter((request) => request.friendRequestId !== id)
      );
    } catch (error) {
      console.error("친구 요청 거절 중 오류 발생:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendFriendRequest();
    }
  };

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
          width={{ base: "90%", md: "500px" }}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          bg="white"
        >
          <Heading as="h1" size="xl" mb={6} textAlign="center">
            친구 관리 페이지
          </Heading>
          <Stack direction="row" justify="center" mb={4}>
            <Button
              onClick={() => setView("list")}
              colorScheme={view === "list" ? "blue" : "gray"}
            >
              친구 목록
            </Button>
            <Button
              onClick={() => setView("pending")}
              colorScheme={view === "pending" ? "blue" : "gray"}
            >
              대기중인 요청
            </Button>
          </Stack>
          <Divider mb={6} />
          {view === "list" ? (
            <VStack spacing={4}>
              <Box w="100%">
                <InputGroup>
                  <Input
                    placeholder="친구 이메일 입력"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress} // 엔터키 핸들링
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Send Friend Request"
                      icon={<ArrowForwardIcon />}
                      onClick={sendFriendRequest} // 버튼 클릭 시 요청 전송
                      colorScheme="blue"
                    />
                  </InputRightElement>
                </InputGroup>
              </Box>
              <Divider />
              {friends.map((friend) => (
                <Box
                  key={friend.friendRequestId}
                  p={4}
                  borderWidth={1}
                  borderRadius={8}
                  w="100%"
                  textAlign="center"
                >
                  <Text>{friend.friendName}</Text>
                  <Text fontSize="sm">{friend.friendEmail}</Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <VStack spacing={4}>
              {pendingRequests.map((request) => (
                <Box
                  key={request.friendRequestId}
                  p={4}
                  borderWidth={1}
                  borderRadius={8}
                  w="100%"
                  textAlign="center"
                >
                  <Text>{request.requesterName}</Text>
                  <Text fontSize="sm">{request.requesterEmail}</Text>
                  <Stack direction="row" justify="center" mt={2}>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => acceptRequest(request.friendRequestId)}
                    >
                      수락
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => rejectRequest(request.friendRequestId)}
                    >
                      거절
                    </Button>
                  </Stack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Friends;
