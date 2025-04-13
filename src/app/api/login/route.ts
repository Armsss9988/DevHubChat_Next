import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axiosConfig from "@/configs/axiosConfig";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const res = await axiosConfig.post("/auth/login", { email, password });
    const response = NextResponse.json({
      message: "Login success",
      user: res.data.user,
    });
    response.cookies.set("access_token", res.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 15,
    });

    response.cookies.set("refresh_token", res.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 7, 
    });
    return response;
  } catch {
    return NextResponse.json(
      {
        message: "Login failed",
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
