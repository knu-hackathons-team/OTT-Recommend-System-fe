import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import RecommendedContents from "./components/RecommendedContents";
import RandomContents from "./components/RandomContents";
import SearchContents from "./components/SearchContents";
import NavBar from "./components/NavBar";
import UnauthorizedAccess from "./components/UnauthorizedAccess";

function MainPage(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("추천 콘텐츠");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  const handleLogout = (): void => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <Box
        background={"black"}
        height={"100vh"}
        alignContent={"center"}
        overflow={"hidden"}
      >
        <UnauthorizedAccess />
      </Box>
    );
  }

  return (
    <Box>
      {/* Navigation Bar */}
      <NavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <Box marginTop="5rem" padding="2rem">
        {activeTab === "추천 콘텐츠" && <RecommendedContents />}
        {activeTab === "랜덤 콘텐츠" && <RandomContents />}
        {activeTab === "검색" && <SearchContents />}
      </Box>
    </Box>
  );
}

export default MainPage;
