import { API_BASE_URL } from "./constant";
import { LoginData, TokenResponse } from "./type";

export const login = async (data: LoginData): Promise<TokenResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/temp/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("로그인에 실패했습니다");
  }

  return response.json();
};
