import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
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
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import api from "../api/interceptor";

const Friends: React.FC = () => {
  const [view, setView] = useState<"list" | "pending">("list");
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string>(""); // 사용자 이메일
  const [email, setEmail] = useState<string>(""); // 검색창 입력
  const toast = useToast();
  const navigate = useNavigate();

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
  const fetchFriends = async () => {
    try {
      const response = await api.get("/api/friend");
      setFriends(response.data);
    } catch (error) {
      console.error("친구 목록을 가져오는 중 오류 발생:", error);
    }
  };

  // 대기 중인 친구 요청 가져오기
  const fetchPendingRequests = async () => {
    try {
      const response = await api.get("/api/friend/pending");
      setPendingRequests(response.data);
    } catch (error) {
      console.error("대기 중인 친구 요청을 가져오는 중 오류 발생:", error);
    }
  };

  // 초기 로드 시 친구 목록 가져오기
  useEffect(() => {
    if (view === "list") {
      fetchFriends();
    } else if (view === "pending") {
      fetchPendingRequests();
    }
  }, [view]);

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
      fetchPendingRequests(); // 새로고침
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
      if (view === "list") {
        fetchFriends(); // 새로고침
      } else {
        fetchPendingRequests(); // 새로고침
      }
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
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="white"
    >
      <IconButton
        aria-label="뒤로가기"
        icon={<ArrowBackIcon />}
        position="absolute"
        top="15px"
        left="15px"
        onClick={() => navigate("/main")}
      />
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
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box textAlign="left">
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
            {pendingRequests.map((request) =>
              request.requesterEmail === userEmail ? ( // 사용자 본인의 요청 처리
                <Box
                  key={request.friendRequestId}
                  p={4}
                  borderWidth={1}
                  borderRadius={8}
                  w="100%"
                  textAlign="center"
                >
                  <Text fontSize="md" fontWeight={"bold"} mb={3}>
                    내가 보낸 요청
                  </Text>
                  <Text fontSize="sm">{request.accepterName}</Text>
                  <Text fontSize="sm">{request.accepterEmail}</Text>
                  <Button size="sm" mt={2} colorScheme="gray" isDisabled>
                    수락 대기중
                  </Button>
                </Box>
              ) : (
                <Box
                  key={request.friendRequestId}
                  p={4}
                  borderWidth={1}
                  borderRadius={8}
                  w="100%"
                  textAlign="center"
                >
                  <Text fontSize="md" fontWeight={"bold"} mb={3}>
                    내가 받은 요청
                  </Text>
                  <Text fontSize="sm">{request.requesterName}</Text>
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
              )
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default Friends;
