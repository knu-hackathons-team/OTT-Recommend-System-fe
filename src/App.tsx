import { Routes } from "./routes/Routes";
import { ChakraProvider } from "@Chakra-ui/react";

const App = () => {
  return (
    <ChakraProvider>
      <Routes />
    </ChakraProvider>
  );
};

export default App;

// 한 페이지에 해당하는 api, hooks, components, types .. 들은 한 폴더에 모아두기
// index.tsx 사용금지. 명확하게 이름 정하기
