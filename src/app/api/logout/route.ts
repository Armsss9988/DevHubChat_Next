// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: "Logged out successfully" });

  // Xóa cookie bằng cách set lại với maxAge = 0
  res.cookies.set("access_token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return res;
}
