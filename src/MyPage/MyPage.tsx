import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Text,
  Button,
  IconButton,
  Image,
  Spinner,
  Flex,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import api from "../api/interceptor";
import DetailModal from "../Main/components/DetailModal";

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
}

interface WatchRecord {
  watchedDateTime: string;
  content: Content;
}

function MyContentPage(): JSX.Element {
  const [contents, setContents] = useState<Content[]>([]);
  const [watchRecords, setWatchRecords] = useState<WatchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<"like" | "dislike" | "watch">(
    "like"
  );

  const navigate = useNavigate();
  const toast = useToast();

  const fetchContents = async (type: "like" | "dislike" | "watch") => {
    setIsLoading(true);
    try {
      let response;
      if (type === "like") {
        response = await api.get("/api/like/true");
        setContents(
          response.data.map((item: { content: Content }) => item.content)
        );
      } else if (type === "dislike") {
        response = await api.get("/api/like/false");
        setContents(
          response.data.map((item: { content: Content }) => item.content)
        );
      } else {
        response = await api.get("/api/watch");
        setWatchRecords(response.data || []);
      }
    } catch (error) {
      toast({
        title: "데이터를 불러오는 중 오류 발생",
        description: "데이터를 가져오는 데 실패했습니다.",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top", // Toast 위치 설정
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContent = async (id: number) => {
    try {
      if (currentTab === "like" || currentTab === "dislike") {
        await api.delete(`/api/like/${id}`);
      } else {
        await api.delete(`/api/watch/${id}`);
      }
      toast({
        title: "삭제 성공",
        description: "콘텐츠가 성공적으로 삭제되었습니다.",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top", // Toast 위치 설정
      });
      fetchContents(currentTab);
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "콘텐츠 삭제 중 오류가 발생했습니다.",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top", // Toast 위치 설정
      });
    }
  };

  const handleCardClick = (content: Content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedContent(null);
    setIsModalOpen(false);
  };

  const groupByDate = (records: WatchRecord[]) => {
    const grouped: { [key: string]: Content[] } = {};
    records.forEach((record) => {
      const date = new Date(record.watchedDateTime).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(record.content);
    });
    return grouped;
  };

  const renderWatchRecords = () => {
    const groupedRecords = groupByDate(watchRecords);
    return Object.entries(groupedRecords).map(([date, contents]) => (
      <Box key={date} mb="2rem">
        <Text fontWeight="bold" fontSize="lg" mb="1rem">
          {date}
        </Text>
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          }}
          gap="1rem"
        >
          {contents.map((content) => (
            <Box
              key={content.id}
              position="relative"
              border="1px solid #e2e8f0"
              borderRadius="8px"
              boxShadow="sm"
              width={{ base: "150px", md: "280px" }}
              bg="white"
              textAlign="center"
              padding="1rem"
              cursor="pointer"
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
                  boxSize="120px"
                  objectFit="contain"
                  mx="auto"
                  marginBottom="0.5rem"
                />
              ) : (
                <Box
                  boxSize="120px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bg="gray.100"
                  borderRadius="md"
                  mx="auto"
                  marginBottom="0.5rem"
                >
                  <Text fontSize="sm" color="gray.500">
                    포스터 없음
                  </Text>
                </Box>
              )}
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="teal.600"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                mb="0.5rem"
                maxWidth="100%"
              >
                {content.title}
              </Text>
              <IconButton
                aria-label="삭제"
                icon={<CloseIcon />}
                position="absolute"
                top="0.5rem"
                right="0.5rem"
                size="sm"
                color="red.500"
                bg="none" // 배경 제거
                _hover={{ bg: "none", color: "red.700" }} // Hover 스타일
                onClick={(e) => {
                  e.stopPropagation();
                  deleteContent(content.id);
                }}
              />
            </Box>
          ))}
        </Grid>
        <Divider mt="2rem" />
      </Box>
    ));
  };

  useEffect(() => {
    fetchContents("like");
  }, []);

  return (
    <Box padding="1rem">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb="1rem"
        position="relative"
      >
        <IconButton
          aria-label="뒤로가기"
          icon={<ArrowBackIcon />}
          position="absolute" // 절대 위치 지정
          top="0" // 화면의 위쪽 경계에 맞춤
          left="0" // 화면의 왼쪽 경계에 맞춤
          mr={"1rem"} // 우측 마진 설정
          onClick={() => navigate("/main")}
        />
        <Flex
          gap="1rem"
          position="absolute"
          right="0"
          top="0"
          mr={"1rem"} // 우측 마진 설정
          flexDirection={["column", "row"]}
        >
          <Button
            colorScheme={currentTab === "like" ? "teal" : "gray"}
            onClick={() => {
              setCurrentTab("like");
              fetchContents("like");
            }}
          >
            내가 좋아요한 콘텐츠
          </Button>
          <Button
            colorScheme={currentTab === "dislike" ? "teal" : "gray"}
            onClick={() => {
              setCurrentTab("dislike");
              fetchContents("dislike");
            }}
          >
            내가 싫어요한 콘텐츠
          </Button>
          <Button
            colorScheme={currentTab === "watch" ? "teal" : "gray"}
            onClick={() => {
              setCurrentTab("watch");
              fetchContents("watch");
            }}
          >
            내가 시청한 콘텐츠
          </Button>
        </Flex>
      </Flex>

      <Box mt={{ base: "180px", md: "80px" }}>
        {isLoading ? (
          <Flex justifyContent="center" alignItems="center" height="200px">
            <Spinner size="lg" color="teal.500" />
          </Flex>
        ) : currentTab === "watch" ? (
          renderWatchRecords()
        ) : (
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap="1rem"
          >
            {contents.map((content) => (
              <Box
                key={content.id}
                position="relative"
                border="1px solid #e2e8f0"
                borderRadius="8px"
                boxShadow="sm"
                width={{ base: "150px", md: "280px" }}
                bg="white"
                textAlign="center"
                padding="1rem"
                cursor="pointer"
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
                    boxSize="120px"
                    objectFit="contain"
                    mx="auto"
                    marginBottom="0.5rem"
                  />
                ) : (
                  <Box
                    boxSize="120px"
                    display="flex"
                    width={"90px"}
                    justifyContent="center"
                    alignItems="center"
                    bg="gray.100"
                    borderRadius="md"
                    mx="auto"
                    marginBottom="0.5rem"
                  >
                    <Text fontSize="sm" color="gray.500">
                      포스터 없음
                    </Text>
                  </Box>
                )}
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color="teal.600"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  mb="0.5rem"
                  maxWidth="100%" // 카드 안에서의 최대 너비를 설정
                  wordBreak="keep-all" // 단어가 중간에 잘리지 않도록 설정
                >
                  {content.title}
                </Text>
                <IconButton
                  aria-label="삭제"
                  icon={<CloseIcon />}
                  position="absolute"
                  top="0.1rem"
                  right="0.1rem"
                  size="sm"
                  color="red.500"
                  bg="none" // 배경 제거
                  _hover={{ bg: "none", color: "red.700" }} // Hover 스타일
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteContent(content.id);
                  }}
                />
              </Box>
            ))}
          </Grid>
        )}
      </Box>

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

export default MyContentPage;
