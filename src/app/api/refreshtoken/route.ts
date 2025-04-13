import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const refreshToken = (await cookies()).get("refresh_token")?.value;

  if (!refreshToken)
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/refresh`, {
    method: "POST",
    headers: {
      Cookie: `refresh_token=${refreshToken}`,
    },
  });

  const data = await res.json();
  if (!res.ok)
    return NextResponse.json({ message: "Refresh failed" }, { status: 401 });

  const response = NextResponse.json({ message: "Token refreshed" });
  response.cookies.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 15,
  });

  return response;
}
