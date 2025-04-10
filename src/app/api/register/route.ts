import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axiosConfig from "@/configs/axiosConfig";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    const res = await axiosConfig.post("/auth/register", {
      email,
      password,
      name,
    });

    const token = res.data.accessToken;
    const response = NextResponse.json({
      message: "Register success",
      user: res.data.user,
    });
    response.cookies.set("access_token", token);
    return response;
  } catch {
    return NextResponse.json(
      {
        message: "Register failed",
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
