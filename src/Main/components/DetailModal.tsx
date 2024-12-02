import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  useBreakpointValue,
  useToast,
  Divider,
  Select,
  Textarea,
  Center,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import api from "../../api/interceptor";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
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
  } | null;
}

const DetailModal = ({ isOpen, onClose, content }: DetailModalProps) => {
  const toast = useToast();

  // 훅 설정
  const textFontSize = useBreakpointValue({ base: "sm", md: "md" });
  const headerFontSize = useBreakpointValue({ base: "lg", md: "xl" });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const modalWidth = useBreakpointValue({ base: "90%", md: "500px" });

  const [friends, setFriends] = useState<any[]>([]); // 친구 목록
  const [selectedFriend, setSelectedFriend] = useState<string>(""); // 선택된 친구 이메일
  const [recommendReason, setRecommendReason] = useState<string>(""); // 추천 이유
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태 관리

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen]);

  // 친구 목록 가져오기
  const fetchFriends = async () => {
    try {
      const response = await api.get("/api/friend");
      setFriends(response.data);
    } catch (error) {
      console.error("친구 목록 가져오기 중 오류 발생:", error);
    }
  };

  // 콘텐츠 추천 API 요청
  const handleRecommend = async () => {
    if (!selectedFriend || !recommendReason) {
      toast({
        title: "추천 실패",
        description: "친구를 선택하고 추천 이유를 입력해주세요.",
        status: "warning",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setIsLoading(true); // 로딩 상태 시작

      const selectedFriendObj = friends.find(
        (friend) => friend.friendEmail === selectedFriend
      );
      if (!selectedFriendObj) throw new Error("친구 정보를 찾을 수 없습니다.");

      await api.post(
        `/api/friend/recommend/${selectedFriendObj.friendRequestId}`,
        {
          contentId: content?.id,
          reason: recommendReason,
        }
      );

      toast({
        position: "top",
        duration: 1500,
        isClosable: true,
        render: () => (
          <Box
            color="black"
            bg="yellow.400"
            borderRadius="8px"
            p="10px"
            textAlign="left"
            fontWeight="bold"
          >
            추천 성공🎉<br />
            {`${selectedFriendObj.friendName}님에게 추천 카톡메세지를 보냈어요!`}
          </Box>
        ),
      });

      // 초기화
      setSelectedFriend("");
      setRecommendReason("");
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("추천 요청 중 오류 발생:", error);
      toast({
        title: "추천 실패",
        description: "추천 요청 중 오류가 발생했습니다.",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  const handleLikeDislike = async (isLike: boolean) => {
    try {
      await api.post(`/api/like/${content?.id}/${isLike}`);
      toast({
        title: isLike ? "좋아요를 눌렀어요!" : "싫어요를 눌렀어요!",
        description: "이제 추천 콘텐츠 결과에 반영됩니다.",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("좋아요/싫어요 요청 중 오류 발생:", error);
    }
  };

  const handleWatchAndNavigate = async () => {
    try {
      await api.post(`/api/watch/${content?.id}`);
      toast({
        title: "시청 완료",
        description: "시청 기록에 등록되었습니다!",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => {
        window.open("https://www.netflix.com", "_blank");
      }, 1500);
    } catch (error) {
      console.error("시청 기록 저장 요청 중 오류 발생:", error);
    }
  };

  // 로딩 상태의 모달
  const LoadingModal = () => (
    <Modal isOpen={isLoading} onClose={() => {}} isCentered>
      <ModalOverlay />
      <ModalContent bg="transparent" boxShadow="none">
        <Center>
          <Spinner size="xl" thickness="4px" color="blue.500" />
        </Center>
      </ModalContent>
    </Modal>
  );

  if (!content) return null;

  return (
    <>
      {/* 로딩 모달 */}
      {isLoading && <LoadingModal />}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          width={modalWidth}
          maxHeight="80vh" // 최대 높이 80% 설정
          overflowY="auto" // 스크롤 활성화
          sx={{
            "&::-webkit-scrollbar": {
              width: "6px", // 스크롤바 폭
            },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.400",
              borderRadius: "10px",
            },
          }}
        >
          <ModalCloseButton />
          <ModalHeader pr="40px" fontSize={headerFontSize}>
            {content.title}
          </ModalHeader>
          <ModalBody>
            <Box>
              <Text fontSize={textFontSize}>
                <strong>Type:</strong> {content.type}
              </Text>
              <Text fontSize={textFontSize}>
                <strong>Director:</strong> {content.director}
              </Text>
              <Text fontSize={textFontSize}>
                <strong>Cast:</strong> {content.cast}
              </Text>
              <Text fontSize={textFontSize}>
                <strong>Country:</strong> {content.country}
              </Text>
              <Text fontSize={textFontSize}>
                <strong>Date Added:</strong> {content.dateAdded}
              </Text>
              <Text fontSize={textFontSize}>
                <strong>Release Year:</strong> {content.releaseYear}
              </Text>
              <Text fontSize={textFontSize}>
                <strong>Rating:</strong> {content.rating}
              </Text>
              <Text fontSize={textFontSize}>
                <strong>Duration:</strong> {content.duration}
              </Text>
              <Text fontSize={textFontSize}>
                <strong>Genres:</strong> {content.listedIn}
              </Text>
              <Text fontSize={textFontSize}>
                <strong>Description:</strong> {content.description}
              </Text>
            </Box>
            <Flex gap={3} mt={4}>
              <Button
                colorScheme="teal"
                size={buttonSize}
                onClick={() => handleLikeDislike(true)}
              >
                좋아요
              </Button>
              <Button
                colorScheme="red"
                size={buttonSize}
                onClick={() => handleLikeDislike(false)}
              >
                싫어요
              </Button>
              <Button
                colorScheme="gray"
                size={buttonSize}
                onClick={handleWatchAndNavigate}
              >
                넷플릭스로 이동
              </Button>
            </Flex>
          </ModalBody>
          <Divider my={4} />
          <ModalFooter flexDirection="column" alignItems="flex-start">
            <Text fontSize={textFontSize} mt={-5} mb={3} fontWeight="bold">
              🔗 친구에게 추천하기
            </Text>
            <Select
              placeholder={
                friends.length > 0
                  ? "친구를 선택하세요"
                  : "--- 친구를 추가해 콘텐츠를 공유해봐요 ---"
              }
              mb={3}
              onChange={(e) => setSelectedFriend(e.target.value)}
              value={selectedFriend}
            >
              {friends.map((friend) => (
                <option key={friend.friendRequestId} value={friend.friendEmail}>
                  {friend.friendName}
                </option>
              ))}
            </Select>
            <Textarea
              placeholder="추천하는 이유를 적어주세요!"
              value={recommendReason}
              onChange={(e) => setRecommendReason(e.target.value)}
              mb={3}
              resize="none"
              height="100px" // 고정 높이
            />
            <Button
              colorScheme="blue"
              size={buttonSize}
              alignSelf="flex-end"
              onClick={handleRecommend}
            >
              추천
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DetailModal;
