import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Text,
  Spinner,
  useBreakpointValue,
  useDisclosure,
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
}

function RandomContents(): JSX.Element {
  const [randomContents, setRandomContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
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

    fetchRandomContents();
  }, []);

  const handleCardClick = (content: Content) => {
    setSelectedContent(content);
    onOpen();
  };

  const cardColumns = useBreakpointValue({ base: "1fr", md: "repeat(5, 1fr)" });

  return (
    <Box padding="2rem">
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
                height="100px"
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
