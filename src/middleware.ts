import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const url = request.nextUrl.clone();
  const currentPath = request.nextUrl.pathname;

  const isGuestOnly = ["/login", "/register"].some((path) =>
    currentPath.startsWith(path)
  );
  const isProtected = ["/room"].some((path) => currentPath.startsWith(path));

  // Không có access token → chặn vào trang cần login
  if (!accessToken && isProtected) {
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", currentPath);
    return NextResponse.redirect(url);
  }

  // Có access token mà vào login/register → redirect về room
  if (accessToken && isGuestOnly) {
    url.pathname = "/room";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/room", "/login", "/register"],
};

// import { NextRequest, NextResponse } from "next/server";
// import { AUTH_CONFIG } from "@/configs/authConfig";

// export async function middleware(request: NextRequest) {
//   const url = request.nextUrl.clone();
//   const pathname = url.pathname;
//   const accessToken = request.cookies.get("access_token")?.value;
//   const refreshToken = request.cookies.get("refresh_token")?.value;

//   let user: unknown = null;

//   // Kiểm tra accessToken
//   if (accessToken) {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       if (res.ok) {
//         user = await res.json();
//       }
//     } catch (e) {
//       console.error("AccessToken invalid:", e);
//     }
//   }

//   // Thử refresh nếu chưa có user
//   if (!user && refreshToken) {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}auth/refresh`,
//         {
//           method: "POST",
//           headers: {
//             Cookie: `refresh_token=${refreshToken}`,
//           },
//         }
//       );

//       if (res.ok) {
//         const data = await res.json();
//         const response = NextResponse.next();
//         response.cookies.set("access_token", data.accessToken, {
//           httpOnly: true,
//           secure: true,
//           path: "/",
//           maxAge: 60 * 15,
//           sameSite: "lax",
//         });

//         // Lấy user sau khi refresh
//         const userRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}auth/me`,
//           {
//             headers: { Authorization: `Bearer ${data.accessToken}` },
//           }
//         );

//         if (userRes.ok) {
//           user = await userRes.json();
//           if (isAuthPage(pathname)) {
//             url.pathname = AUTH_CONFIG.redirectIfAuthenticated;
//             return NextResponse.redirect(url);
//           }

//           return response;
//         }
//       }
//     } catch (err) {
//       console.error("Refresh failed:", err);
//     }
//   }

//   const isProtected = isProtectedRoute(pathname);
//   const isAuth = isAuthPage(pathname);

//   // Đã login → chặn login/register
//   if (user && isAuth) {
//     url.pathname = AUTH_CONFIG.redirectIfAuthenticated;
//     return NextResponse.redirect(url);
//   }

//   // Chưa login → vào route cần bảo vệ
//   if (!user && isProtected) {
//     const loginUrl = new URL(AUTH_CONFIG.loginRoute, request.url);
//     loginUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   //   // Login rồi nhưng không đúng role → redirect về dashboard
//   //   if (user && !isAuthorized(user.role, pathname)) {
//   //     url.pathname = AUTH_CONFIG.redirectIfAuthenticated;
//   //     return NextResponse.redirect(url);
//   //   }

//   return NextResponse.next();
// }

// // Helpers

// function isAuthPage(path: string) {
//   return AUTH_CONFIG.publicRoutes.includes(path);
// }

// function isProtectedRoute(path: string): boolean {
//   const allProtected = Object.values(AUTH_CONFIG.protectedRoutes).flat();
//   return allProtected.some((protectedPath) => matchPath(path, protectedPath));
// }

// // function isAuthorized(role: string, path: string): boolean {
// //   const allowedPaths = AUTH_CONFIG.protectedRoutes[role as keyof typeof AUTH_CONFIG.protectedRoutes] || [];
// //   return allowedPaths.some((protectedPath: string | undefined) => matchPath(path, protectedPath));
// // }

// // Hỗ trợ matcher động /path/:slug
// function matchPath(path: string, protectedPath: string | undefined): boolean {
//   if (!protectedPath) return false;
//   const regex = new RegExp(
//     "^" + protectedPath.replace(/:[^/]+/g, "[^/]+").replace(/\*/g, ".*") + "$"
//   );
//   return regex.test(path);
// }
