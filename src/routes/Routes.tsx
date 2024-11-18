import { createBrowserRouter, RouterProvider } from "react-router-dom"; // 라우터 관련 모듈 가져오기
import MainPage from "../../src/Main/MainPage"; // 메인 페이지 컴포넌트 가져오기
import StartPage from "../Start/StartPage";
import RedirectPage from "../Start/Redirection";
import { RouterPath } from "./path"; // 경로 상수 가져오기

// 라우터 정의
const router = createBrowserRouter([
  {
    path: RouterPath.root, // 루트 경로
    element: <StartPage />, // 시작 페이지를 직접 렌더링
  },
  {
    path: RouterPath.rediretcion, // 리다이렉션 페이지 경로
    element: <RedirectPage />, // 리다이렉션 페이지를 직접 렌더링
  },
  {
    path: RouterPath.main, // 메인 페이지 경로
    element: <MainPage />, // 메인 페이지를 직접 렌더링
  },
]);

// 라우터를 렌더링하는 컴포넌트
export const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
