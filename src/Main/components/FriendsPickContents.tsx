import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  Button,
  VStack,
  HStack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import DetailModal from "./DetailModal"; // DetailModal 컴포넌트 가져오기
import api from "../../api/interceptor";

interface RecommendedContent {
  RecommendId: number;
  senderName: string;
  senderEmail: string;
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
    posterPath: string;
  };
  reason: string;
}

const FriendsPickContents: React.FC = () => {
  const [contents, setContents] = useState<RecommendedContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedContent, setSelectedContent] =
    useState<RecommendedContent | null>(null); // 선택된 콘텐츠 상태
  const toast = useToast();

  useEffect(() => {
    const fetchRecommendedContents = async () => {
      try {
        const response = await api.get("/api/friend/recommend");
        setContents(response.data);
      } catch (error) {
        console.error("추천 콘텐츠를 가져오는 중 오류 발생:", error);
        toast({
          title: "오류 발생",
          description: "추천 콘텐츠를 가져오는 중 문제가 발생했습니다.",
          status: "error",
          position: "top",
          duration: 1500,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedContents();
  }, []);

  const handleDelete = async (recommendId: number) => {
    try {
      await api.delete(`/api/friend/recommend/${recommendId}`);
      toast({
        title: "삭제 성공",
        description: "추천받은 콘텐츠가 삭제되었습니다.",
        status: "success",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
      setContents((prev) =>
        prev.filter((item) => item.RecommendId !== recommendId)
      );
    } catch (error) {
      console.error("추천 콘텐츠 삭제 중 오류 발생:", error);
      toast({
        title: "삭제 실패",
        description: "콘텐츠를 삭제하는 중 문제가 발생했습니다.",
        status: "error",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  const handlePosterClick = (content: RecommendedContent) => {
    setSelectedContent(content);
  };

  const closeModal = () => {
    setSelectedContent(null);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (contents.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Text fontSize="xl" fontWeight="bold" color="gray.500" mt={50}>
          추천 받은 콘텐츠가 없습니다.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {contents.map((item) => (
          <HStack
            key={item.RecommendId}
            spacing={4}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            p={4}
          >
            <Image
              src={item.content.posterPath}
              alt={item.content.title}
              boxSize="100px"
              objectFit="cover"
              borderRadius="md"
              cursor="pointer" // 클릭 가능하도록 커서 변경
              onClick={() => handlePosterClick(item)} // 포스터 클릭 시 모달 열기
            />
            <VStack align="start" spacing={2} flex="1">
              <Text fontSize="lg" fontWeight="bold">
                {item.content.title}
              </Text>
              <Text fontSize="sm" color="gray.600">
                추천인: {item.senderName} ({item.senderEmail})
              </Text>
              <Text fontSize="sm" color="gray.500">
                이유: {item.reason}
              </Text>
            </VStack>
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => handleDelete(item.RecommendId)}
            >
              삭제
            </Button>
          </HStack>
        ))}
      </VStack>
      {/* DetailModal 추가 */}
      {selectedContent && (
        <DetailModal
          isOpen={!!selectedContent}
          onClose={closeModal}
          content={{
            id: selectedContent.content.id,
            showId: selectedContent.content.showId,
            type: selectedContent.content.type,
            title: selectedContent.content.title,
            director: selectedContent.content.director,
            cast: selectedContent.content.cast,
            country: selectedContent.content.country,
            dateAdded: selectedContent.content.dateAdded,
            releaseYear: selectedContent.content.releaseYear,
            rating: selectedContent.content.rating,
            duration: selectedContent.content.duration,
            listedIn: selectedContent.content.listedIn,
            description: selectedContent.content.description,
          }}
        />
      )}
    </Box>
  );
};

export default FriendsPickContents;
