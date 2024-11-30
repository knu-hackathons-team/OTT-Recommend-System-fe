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
  const [userEmail, setUserEmail] = useState<string>(""); // 사용자 이메일
  const [email, setEmail] = useState<string>(""); // 검색창 입력
  const toast = useToast();

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/api/members/info");
        setUserEmail(response.data.email);
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    };
    fetchUserInfo();
  }, []);

  // 친구 목록 가져오기
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

  // 대기 중인 친구 요청 가져오기
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await api.get("/api/friend/pending");
        const filteredRequests = response.data.filter(
          (request: any) => request.requesterEmail !== userEmail
        ); // 사용자 본인의 요청은 제외
        setPendingRequests(filteredRequests);
      } catch (error) {
        console.error("대기 중인 친구 요청을 가져오는 중 오류 발생:", error);
      }
    };

    // fetchPendingRequests를 실행
    if (userEmail) {
      fetchPendingRequests();
    }
  }, [userEmail]);

  // 친구 요청 보내기
  const sendFriendRequest = async () => {
    if (!email) return;
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
      const errorMessage =
        error.response?.data?.detail || "친구 요청 중 오류가 발생했습니다.";
      toast({
        title: "에러",
        description: errorMessage,
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
    }
  };

  // 친구 요청 수락
  const acceptRequest = async (id: number) => {
    try {
      await api.put(`/api/friend/accept/${id}`);
      toast({
        title: "친구 요청 수락",
        description: "친구 요청을 수락했습니다.",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
      setPendingRequests((prev) =>
        prev.filter((request) => request.friendRequestId !== id)
      );
    } catch (error) {
      console.error("친구 요청 수락 중 오류 발생:", error);
    }
  };

  // 친구 요청 거절 또는 친구 삭제
  const rejectRequestOrDeleteFriend = async (id: number) => {
    try {
      await api.delete(`/api/friend/${id}`);
      toast({
        title: "친구 삭제",
        description: "목록에서 친구를 삭제했습니다.",
        status: "info",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
      setFriends((prev) =>
        prev.filter((friend) => friend.friendRequestId !== id)
      );
      setPendingRequests((prev) =>
        prev.filter((request) => request.friendRequestId !== id)
      );
    } catch (error) {
      console.error("친구 요청 거절/삭제 중 오류 발생:", error);
    }
  };

  // 검색창에서 엔터키를 눌렀을 때
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
                    onKeyPress={handleKeyPress}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Send Friend Request"
                      icon={<ArrowForwardIcon />}
                      onClick={sendFriendRequest}
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
                  display="flex" // flexbox 설정
                  alignItems="center" // 세로 가운데 정렬
                  justifyContent="space-between" // 버튼을 오른쪽으로 이동
                >
                  <Box textAlign="left">
                    {" "}
                    {/* 텍스트를 왼쪽 정렬 */}
                    <Text>{friend.friendName}</Text>
                    <Text fontSize="sm">{friend.friendEmail}</Text>
                  </Box>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() =>
                      rejectRequestOrDeleteFriend(friend.friendRequestId)
                    }
                  >
                    삭제
                  </Button>
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
                      onClick={() =>
                        rejectRequestOrDeleteFriend(request.friendRequestId)
                      }
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
