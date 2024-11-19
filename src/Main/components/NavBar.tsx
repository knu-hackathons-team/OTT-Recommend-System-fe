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
      <Flex align="center" gap="2rem">
        <Text
          cursor="pointer"
          fontSize={["sm", "md", "lg"]}
          fontWeight="bold"
          color={activeTab === "추천 콘텐츠" ? "black" : "teal.500"}
          borderBottom={activeTab === "추천 콘텐츠" ? "2px solid teal" : "none"}
          onClick={() => setActiveTab("추천 콘텐츠")}
        >
          추천 콘텐츠
        </Text>
        <Text
          cursor="pointer"
          fontSize={["sm", "md", "lg"]}
          fontWeight="bold"
          color={activeTab === "랜덤 콘텐츠" ? "black" : "teal.500"}
          borderBottom={activeTab === "랜덤 콘텐츠" ? "2px solid teal" : "none"}
          onClick={() => setActiveTab("랜덤 콘텐츠")}
        >
          랜덤 콘텐츠
        </Text>
        <Text
          cursor="pointer"
          fontSize={["sm", "md", "lg"]}
          fontWeight="bold"
          color={activeTab === "검색" ? "black" : "teal.500"}
          borderBottom={activeTab === "검색" ? "2px solid teal" : "none"}
          onClick={() => setActiveTab("검색")}
        >
          검색
        </Text>
      </Flex>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        />
        <MenuList>
          {/* 사용자 이름 표시 */}
          <MenuItem>{userName ? `${userName} 님` : "사용자 님"}</MenuItem>
          <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default NavBar;
