import { cookies } from "next/headers";
import axiosInstance from "@/configs/axiosConfig";

export async function GET() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const res = await axiosInstance.get(`/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return new Response(JSON.stringify(res.data));
  } catch {
    return new Response(JSON.stringify({ message: "Invalid token" }), {
      status: 401,
    });
  }
}
