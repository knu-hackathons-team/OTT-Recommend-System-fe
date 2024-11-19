import { useEffect, useState } from "react";
import { Box, Grid, Text, Spinner, Flex } from "@chakra-ui/react";
import api from "../../api/interceptor";
import DetailModal from "./DetailModal"; // DetailModal 컴포넌트를 import

interface Content {
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
}

interface CategoryContent {
  category: string;
  contents: Content[];
}

function RecommendedContents(): JSX.Element {
  const [categories, setCategories] = useState<CategoryContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null); // 선택된 콘텐츠 상태
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 상태

  const categoryLabels: { [key: string]: string } = {
    similarCastFromLikes: "🎭 좋아요한 콘텐츠와 출연진 유사한 콘텐츠 TOP 10",
    similarGenreFromLikes: "🎬 좋아요한 콘텐츠와 장르 유사한 콘텐츠 TOP 10",
    sameDirectorFromLikes: "🎥 좋아요한 콘텐츠와 감독 동일한 콘텐츠 TOP 10",
    similarCastFromWatchHistory:
      "🌟 시청한 콘텐츠와 출연진 유사한 콘텐츠 TOP 10",
    similarGenreFromWatchHistory:
      "📽️ 시청한 콘텐츠와 장르 유사한 콘텐츠 TOP 10",
    sameDirectorFromWatchHistory:
      "🎞️ 시청한 콘텐츠와 감독 동일한 콘텐츠 TOP 10",
  };

  useEffect(() => {
    const fetchRecommendedContents = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/recommend/10");
        const fetchedCategories = Object.keys(categoryLabels).map(
          (category) => ({
            category,
            contents:
              response.data[category]?.map(
                (item: { content: Content }) => item.content
              ) || [],
          })
        );
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("추천 콘텐츠를 가져오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedContents();
  }, []);

  const handleCardClick = (content: Content) => {
    setSelectedContent(content); // 선택된 콘텐츠 설정
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setSelectedContent(null); // 선택된 콘텐츠 초기화
    setIsModalOpen(false); // 모달 닫기
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <Spinner size="lg" color="teal.500" />
      </Box>
    );
  }

  return (
    <Box padding="2rem">
      {categories.map(({ category, contents }) => (
        <Box key={category} marginBottom="2rem">
          {/* 카테고리 제목 */}
          <Text
            fontSize={{ base: "lg", md: "lg", lg: "xl" }}
            fontWeight="bold"
            color="teal.500"
            marginBottom="1rem"
          >
            {categoryLabels[category]}
          </Text>
          {contents.length > 0 ? (
            // 콘텐츠 리스트
            <Flex
              overflowX="auto"
              paddingBottom="1rem"
              alignItems="center"
              css={{
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#319795", // teal.500 색상
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#e2e8f0",
                },
              }}
              height="160px" // 카드 리스트 높이
            >
              <Grid
                templateColumns={`repeat(${contents.length}, 200px)`}
                gap="1rem"
              >
                {contents.map((content) => (
                  <Box
                    key={content.id}
                    padding="1rem"
                    border="1px solid #e2e8f0"
                    borderRadius="8px"
                    boxShadow="sm"
                    bg="white"
                    textAlign="center"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    cursor="pointer"
                    minWidth="200px"
                    height="100px" // 각 카드의 높이
                    alignContent={"center"}
                    onClick={() => handleCardClick(content)} // 카드 클릭 핸들러
                    transition="transform 0.2s, box-shadow 0.2s"
                    _hover={{
                      transform: "scale(1.05)",
                      boxShadow: "lg",
                      borderColor: "teal.500",
                    }}
                  >
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color="teal.600"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                    >
                      {content.title}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </Flex>
          ) : (
            // 데이터가 없는 경우 안내 메시지
            <Text fontSize="md" color="gray.500" textAlign="center">
              충분한 데이터가 쌓이지 않았습니다.
            </Text>
          )}
        </Box>
      ))}

      {/* DetailModal */}
      {selectedContent && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          content={selectedContent}
        />
      )}
    </Box>
  );
}

export default RecommendedContents;
