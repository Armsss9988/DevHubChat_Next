"use server";
import { cookies } from "next/headers";
import axiosInstance from "@/configs/axiosConfig";

export async function getServerCurrentUser() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) return null;

  try {
    const res = await axiosInstance.get(`/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch {
    return null;
  }
}
