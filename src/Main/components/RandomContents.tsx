import { useEffect, useState } from "react";
import { Box, Grid, Text, Spinner, useBreakpointValue } from "@chakra-ui/react";
import api from "../../api/interceptor";

interface Content {
  title: string;
}

function RandomContents(): JSX.Element {
  const [randomContents, setRandomContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        <Grid templateColumns={cardColumns} gap="1rem">
          {randomContents.map((content, index) => (
            <Box
              key={index}
              padding="1rem"
              border="1px solid #e2e8f0"
              borderRadius="8px"
              boxShadow="sm"
              bg="white"
              textAlign="center"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
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
      )}
    </Box>
  );
}

export default RandomContents;
