// src/config/authConfig.ts

export const AUTH_CONFIG = {
  // Các route public, không cần auth
  publicRoutes: ["/", "/login", "/register","/"],

  // Role-based protected routes
  protectedRoutes: {
    admin: ["/room", "/admin/:path*"],
    user: ["/room", "/profile"],
  },

  // Redirect nếu đã login mà vào auth page
  redirectIfAuthenticated: "/dashboard",

  // Route login
  loginRoute: "/login",
};
