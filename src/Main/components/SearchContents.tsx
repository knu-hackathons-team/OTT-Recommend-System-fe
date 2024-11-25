import { useState } from "react";
import {
  Box,
  Grid,
  Text,
  Image,
  Spinner,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Select,
  useDisclosure,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
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

function SearchContents(): JSX.Element {
  const [searchType, setSearchType] = useState<string>("title");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = async () => {
    if (!searchQuery) return;

    setIsLoading(true);
    try {
      const response = await api.get(
        `/api/search/${searchType}/${searchQuery}`
      );
      const contents = response.data.map(
        (item: { content: Content }) => item.content
      );
      setSearchResults(contents);
    } catch (error) {
      console.error("검색 요청 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (content: Content) => {
    setSelectedContent(content);
    onOpen();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const cardColumns = useBreakpointValue({ base: "1fr", md: "repeat(5, 1fr)" });

  return (
    <Box padding="2rem">
      {/* 검색 필터와 검색 입력창 */}
      <Flex
        marginBottom="1.5rem"
        gap="1rem"
        flexDirection={["column", "row"]}
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <Select
          width={["100%", "160px"]} // 드롭다운 크기 조정
          height="40px" // 드롭다운 높이 조정
          value={searchType}
          borderRadius={"md"}
          mt={["0.5rem", "1px"]} // 모바일 화면에서 위쪽 여백 추가
          onChange={(e) => setSearchType(e.target.value)}
          size="sm" // 드롭다운 크기 축소
        >
          <option value="title">제목</option>
          <option value="genre">장르</option>
          <option value="cast">출연진</option>
        </Select>

        <InputGroup maxWidth="600px" flex="1">
          <Input
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <InputRightElement>
            <IconButton
              aria-label="검색"
              icon={<SearchIcon />}
              colorScheme="teal"
              onClick={handleSearch}
              size="sm"
            />
          </InputRightElement>
        </InputGroup>
      </Flex>

      {/* 검색 결과 */}
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
          {searchResults.length > 0 ? (
            <Grid templateColumns={cardColumns} gap="1rem">
              {searchResults.map((content) => (
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
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      bg="gray.100"
                      borderRadius="md"
                      marginBottom="0.5rem"
                      mx="auto"
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
          ) : (
            <Text textAlign="center" color="gray.500" fontSize="lg">
              검색 결과가 없습니다.
            </Text>
          )}
        </>
      )}

      {/* 상세 정보 모달 */}
      <DetailModal
        isOpen={isOpen}
        onClose={onClose}
        content={selectedContent}
      />
    </Box>
  );
}

export default SearchContents;
