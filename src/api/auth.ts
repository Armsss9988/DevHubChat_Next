import axiosConfig from "../services/axiosConfig";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export const login = async (email: string, password: string) => {
  const response = await axiosConfig.post("/auth/login", { email, password });
  if (response.status === 200) {
    cookies.apply({ token: response.data.token });
  }
  return response.data;
};

export const signup = async (email: string, password: string, name: string) => {
  const response = await axiosConfig.post("auth/register", {
    email,
    password,
    name,
  });
  return response.data;
};

export const firebaseLogin = async (token: string) => {
  const response = await axiosConfig.post("/firebase-login", { token });
  return response.data;
};

export const oauthLogin = async () => {
  const response = await axiosConfig.get("/oauth-login");
  return response.data;
};
export const getUser = async () => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "my-secret");
  } catch {
    return null;
  }
};
