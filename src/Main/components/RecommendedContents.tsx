import { useEffect, useState } from "react";
import { Box, Grid, Text, Spinner, Flex, Image } from "@chakra-ui/react";
import api from "../../api/interceptor";
import DetailModal from "./DetailModal";

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
  posterPath?: string;
  watchCount?: number;
  likeCount?: number;
}

interface CategoryContent {
  category: string;
  contents: Content[];
}

function RecommendedContents(): JSX.Element {
  const [watchTop, setWatchTop] = useState<
    { content: Content; watchCount: number }[]
  >([]);
  const [likeTop, setLikeTop] = useState<
    { content: Content; likeCount: number }[]
  >([]);
  const [categories, setCategories] = useState<CategoryContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    const fetchAllContents = async () => {
      setIsLoading(true);
      try {
        // 많이 시청한 콘텐츠 TOP 10 가져오기
        const watchResponse = await api.get("/api/watch/top");
        setWatchTop(watchResponse.data || []);

        // 좋아요한 콘텐츠 TOP 10 가져오기
        const likeResponse = await api.get("/api/like/top");
        setLikeTop(likeResponse.data || []);

        // 추천 콘텐츠 가져오기
        const recommendResponse = await api.get("/api/recommend/10");
        const fetchedCategories = Object.keys(categoryLabels).map(
          (category) => ({
            category,
            contents:
              recommendResponse.data[category]?.map(
                (item: { content: Content }) => item.content
              ) || [],
          })
        );
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("콘텐츠를 가져오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllContents();
  }, []);

  const handleCardClick = (content: Content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedContent(null);
    setIsModalOpen(false);
  };

  const renderContentGrid = (
    items: { content: Content; count?: number }[],
    label: string,
    countLabel?: string
  ) => (
    <Box marginBottom="2rem">
      <Text
        fontSize={{ base: "lg", md: "lg", lg: "xl" }}
        fontWeight="bold"
        color="teal.500"
        marginBottom="1rem"
      >
        {label}
      </Text>
      {items.length > 0 ? (
        <Flex
          overflowX="auto"
          paddingBottom="1rem"
          alignItems="center"
          height="300px"
          css={{
            "&::-webkit-scrollbar": {
              height: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#319795",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#e2e8f0",
            },
          }}
        >
          <Grid
            templateColumns={`repeat(${items.length}, 200px)`}
            gap="1rem"
            paddingX="1rem"
          >
            {items.map(({ content, count }) => (
              <Box
                key={content.id}
                padding="1rem"
                border="1px solid #e2e8f0"
                borderRadius="8px"
                boxShadow="sm"
                bg="white"
                textAlign="center"
                cursor="pointer"
                width="200px"
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "lg",
                  borderColor: "teal.500",
                }}
                onClick={() => handleCardClick(content)}
              >
                {content.posterPath ? (
                  <Image
                    src={content.posterPath}
                    alt={`${content.title} 포스터`}
                    boxSize="150px"
                    objectFit="contain"
                    mx="auto"
                    marginBottom="0.5rem"
                    borderRadius="md"
                  />
                ) : (
                  <Box
                    boxSize="150px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    bg="gray.100"
                    borderRadius="md"
                    marginBottom="0.5rem"
                    mx="auto"
                  >
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      포스터가 없습니다.
                    </Text>
                  </Box>
                )}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="teal.600"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  marginBottom="0.5rem"
                >
                  {content.title}
                </Text>
                {countLabel && (
                  <Text fontSize="sm" color="gray.500">
                    {`${countLabel}: ${count}`}
                  </Text>
                )}
              </Box>
            ))}
          </Grid>
        </Flex>
      ) : (
        <Text fontSize="md" color="gray.500" textAlign="center">
          충분한 데이터가 쌓이지 않았습니다.
        </Text>
      )}
    </Box>
  );

  const renderCategoryGrids = () =>
    categories.map(({ category, contents }) =>
      renderContentGrid(
        contents.map((content) => ({ content })),
        categoryLabels[category] || category
      )
    );

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
      {/* 많이 시청한 콘텐츠 TOP 10 */}
      {renderContentGrid(
        watchTop.map((item) => ({
          content: item.content,
          count: item.watchCount,
        })),
        "🔥 서비스 이용자들이 많이 시청한 콘텐츠 TOP 10",
        "시청 횟수"
      )}

      {/* 좋아요한 콘텐츠 TOP 10 */}
      {renderContentGrid(
        likeTop.map((item) => ({
          content: item.content,
          count: item.likeCount,
        })),
        "❤️ 서비스 이용자들이 좋아한 콘텐츠 TOP 10",
        "좋아요 수"
      )}

      {/* 기존 추천 콘텐츠 */}
      {renderCategoryGrids()}

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
