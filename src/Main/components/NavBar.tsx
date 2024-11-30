import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import api from "../../api/interceptor";

interface NavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

const NavBar = ({
  activeTab,
  setActiveTab,
  handleLogout,
}: NavBarProps): JSX.Element => {
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await api.get("/api/members/info");
        const name = response.data.name;
        setUserName(name);
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <Flex
      as="nav"
      justify="space-between"
      align="center"
      padding="1rem"
      bg="white"
      boxShadow="md"
      position="fixed"
      top="0"
      width="100%"
      zIndex="1000"
    >
      {/* 네비게이션 탭 */}
      <Flex
        align="center"
        justifyContent="flex-start" // 모바일에서도 왼쪽 정렬 유지
        gap={["0.5rem", "2rem"]}
        flexWrap="wrap" // 텍스트가 길어질 경우 줄바꿈
        overflow="hidden" // 작은 화면에서 넘어가는 텍스트 숨김
      >
        <Text
          cursor="pointer"
          fontSize={["xs", "sm", "md"]}
          fontWeight="bold"
          color={activeTab === "랜덤 콘텐츠" ? "white" : "teal.500"}
          bg={activeTab === "랜덤 콘텐츠" ? "teal.500" : "none"}
          borderRadius="md"
          padding="0.2rem 0.5rem"
          onClick={() => setActiveTab("랜덤 콘텐츠")}
        >
          랜덤 콘텐츠
        </Text>
        <Text
          cursor="pointer"
          fontSize={["xs", "sm", "md"]}
          fontWeight="bold"
          color={activeTab === "추천 콘텐츠" ? "white" : "teal.500"}
          bg={activeTab === "추천 콘텐츠" ? "teal.500" : "none"}
          borderRadius="md"
          padding="0.2rem 0.5rem"
          onClick={() => setActiveTab("추천 콘텐츠")}
        >
          추천 콘텐츠
        </Text>
        <Text
          cursor="pointer"
          fontSize={["xs", "sm", "md"]}
          fontWeight="bold"
          color={activeTab === "친구들의 Pick" ? "white" : "teal.500"}
          bg={activeTab === "친구들의 Pick" ? "teal.500" : "none"}
          borderRadius="md"
          padding="0.2rem 0.5rem"
          onClick={() => setActiveTab("친구들의 Pick")}
        >
          친구들의 Pick
        </Text>
        <Text
          cursor="pointer"
          fontSize={["xs", "sm", "md"]}
          fontWeight="bold"
          color={activeTab === "검색" ? "white" : "teal.500"}
          bg={activeTab === "검색" ? "teal.500" : "none"}
          borderRadius="md"
          padding="0.2rem 0.5rem"
          onClick={() => setActiveTab("검색")}
        >
          검색
        </Text>
      </Flex>

      {/* 햄버거 메뉴 */}
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
          ml="auto" // 모바일에서 우측 정렬
        />
        <MenuList
          minW="fit-content"
          maxHeight="200px" // 최대 높이 설정
          overflowY="auto" // 스크롤 추가
          sx={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.400",
              borderRadius: "10px",
            },
          }}
        >
          <MenuItem>{userName ? `${userName} 님` : "사용자 님"}</MenuItem>
          <MenuItem onClick={() => navigate("/mypage")}>나의 콘텐츠</MenuItem>
          <MenuItem onClick={() => navigate("/friends")}>친구 관리</MenuItem>
          <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default NavBar;
