import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Text,
  Spinner,
  Button,
  useBreakpointValue,
  useDisclosure,
  Flex,
  Image,
} from "@chakra-ui/react";
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
  posterPath?: string; // 이미지 URL 추가
}

function RandomContents(): JSX.Element {
  const [randomContents, setRandomContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchRandomContents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/random/10");
      const contents = response.data.map(
        (item: { content: Content }) => item.content
      );
      setRandomContents(contents);
    } catch (error) {
      console.error("랜덤 콘텐츠를 가져오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomContents(); // 컴포넌트 로드 시 첫 호출
  }, []);

  const handleCardClick = (content: Content) => {
    setSelectedContent(content);
    onOpen();
  };

  const cardColumns = useBreakpointValue({ base: "1fr", md: "repeat(5, 1fr)" });

  return (
    <Box padding="2rem">
      {/* 새로고침 버튼 및 안내 문구 */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        marginBottom="1rem"
        flexDirection={["column", "row"]} // 모바일에서 수직 정렬
        gap="1rem"
      >
        <Text
          fontSize={{ base: "sm", md: "lg", lg: "xl" }}
          fontWeight="bold"
          color="teal.500"
          textAlign={["center", "left"]} // 모바일에서 가운데 정렬
        >
          랜덤으로 콘텐츠를 10개 추천해드립니다. 마음에 드는 콘텐츠가 없다면
          새로고침 해보세요!
        </Text>
        <Button
          colorScheme="teal"
          size="sm"
          onClick={fetchRandomContents} // 새로고침 버튼에서 API 호출
          alignSelf={["center", "flex-end"]}
        >
          새로고침
        </Button>
      </Flex>

      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <Spinner size="lg" color="teal.500" />
        </Box>
      ) : (
        <>
          <Grid templateColumns={cardColumns} gap="1rem">
            {randomContents.map((content) => (
              <Box
                key={content.id}
                padding="1rem"
                border="1px solid #e2e8f0"
                borderRadius="8px"
                boxShadow="sm"
                bg="white"
                alignContent={"center"}
                textAlign="center"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
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
                    boxSize="200px"
                    objectFit="contain"
                    mx="auto"
                    marginBottom="0.5rem"
                    borderRadius="md"
                  />
                ) : (
                  <Box
                    boxSize="200px"
                    display="flex"
                    width={"150px"}
                    flexDirection="column"
                    justifyContent="center"
                    borderRadius={"sm"}
                    alignItems="center"
                    background={"gray.100"}
                    mx={"auto"}
                    marginBottom="0.5rem"
                  >
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      해당 콘텐츠는
                    </Text>
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
                >
                  {content.title}
                </Text>
              </Box>
            ))}
          </Grid>
          <DetailModal
            isOpen={isOpen}
            onClose={onClose}
            content={selectedContent}
          />
        </>
      )}
    </Box>
  );
}

export default RandomContents;
