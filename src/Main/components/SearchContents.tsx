import { useState } from "react";
import {
  Box,
  Grid,
  Text,
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
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          size="sm" // 드롭다운 크기 축소
        >
          <option value="title">제목</option>
          <option value="genre">장르</option>
          <option value="director">감독</option>
        </Select>

        <InputGroup maxWidth="600px" flex="1">
          <Input
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
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
