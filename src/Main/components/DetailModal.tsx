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
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
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
  if (!content) return null;

  const handleLikeDislike = async (isLike: boolean) => {
    try {
      await api.post(`/api/like/${content.id}/${isLike}`);
      console.log(isLike ? "좋아요 요청 성공" : "싫어요 요청 성공");
    } catch (error) {
      console.error("좋아요/싫어요 요청 중 오류 발생:", error);
    }
  };

  const handleWatchAndNavigate = async () => {
    try {
      // 시청 기록 저장 API 호출
      await api.post(`/api/watch/${content.id}`);
      console.log("시청 기록 저장 요청 성공");
    } catch (error) {
      console.error("시청 기록 저장 요청 중 오류 발생:", error);
    } finally {
      // 넷플릭스로 이동
      window.open(
        "https://www.netflix.com/kr/",
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // 반응형 스타일 설정
  const textFontSize = useBreakpointValue({ base: "sm", md: "md" });
  const headerFontSize = useBreakpointValue({ base: "lg", md: "xl" });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const modalWidth = useBreakpointValue({ base: "90%", md: "500px" });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent width={modalWidth}>
        <ModalHeader fontSize={headerFontSize}>{content.title}</ModalHeader>
        <ModalCloseButton />
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
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          {/* 좋아요/싫어요 버튼 */}
          <Flex gap="1rem">
            <Button
              colorScheme="teal"
              size={buttonSize}
              fontSize={textFontSize}
              onClick={() => handleLikeDislike(true)}
            >
              좋아요
            </Button>
            <Button
              colorScheme="red"
              size={buttonSize}
              fontSize={textFontSize}
              onClick={() => handleLikeDislike(false)}
              ml={-3}
            >
              싫어요
            </Button>
          </Flex>
          {/* 넷플릭스로 이동 버튼 */}
          <Button
            colorScheme="gray"
            size={buttonSize}
            fontSize={textFontSize}
            onClick={handleWatchAndNavigate}
            ml={3}
            width={{ base: "100%", md: "auto" }}
          >
            넷플릭스로 이동
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailModal;
