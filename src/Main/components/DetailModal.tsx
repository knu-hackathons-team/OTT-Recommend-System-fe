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
  useToast,
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
  const toast = useToast();

  // 훅을 최상단에 배치
  const textFontSize = useBreakpointValue({ base: "sm", md: "md" });
  const headerFontSize = useBreakpointValue({ base: "lg", md: "xl" });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const modalWidth = useBreakpointValue({ base: "90%", md: "500px" });

  if (!content) return null;

  const handleLikeDislike = async (isLike: boolean) => {
    try {
      await api.post(`/api/like/${content.id}/${isLike}`);
      toast({
        title: isLike ? "좋아요를 눌렀어요!" : "싫어요를 눌렀어요!",
        description: "이제 추천 콘텐츠 결과에 반영됩니다.",
        duration: 3000,
        isClosable: true,
        position: "top",
        render: () => (
          <Box
            bg={isLike ? "teal.500" : "red.500"}
            color="white"
            px={4}
            py={3}
            borderRadius="md"
            boxShadow="lg"
          >
            <Text fontWeight="bold">
              {isLike ? "좋아요를 눌렀어요!" : "싫어요를 눌렀어요!"}
            </Text>
            <Text>이제 추천 콘텐츠 결과에 반영됩니다.</Text>
          </Box>
        ),
      });
    } catch (error) {
      console.error("좋아요/싫어요 요청 중 오류 발생:", error);
    }
  };

  const handleWatchAndNavigate = async () => {
    try {
      await api.post(`/api/watch/${content.id}`);
      toast({
        duration: 3000,
        isClosable: true,
        position: "top",
        render: () => (
          <Box
            bg="gray.300"
            color="black"
            px={4}
            py={3}
            borderRadius="md"
            boxShadow="lg"
          >
            <Text fontWeight="bold">시청기록에 등록되었어요!</Text>
            <Text>이제 추천 콘텐츠 결과에 반영됩니다.</Text>
          </Box>
        ),
      });
    } catch (error) {
      console.error("시청 기록 저장 요청 중 오류 발생:", error);
    } finally {
      window.open(
        "https://www.netflix.com/kr/",
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

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
