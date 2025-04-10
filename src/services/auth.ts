import axiosConfig from "@/configs/axiosConfig";
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const signup = async (email: string, password: string, name: string) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Register failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const firebaseLogin = async (token: string) => {
  const response = await axiosConfig.post("/firebase-login", { token });
  return response.data;
};

export const oauthLogin = async () => {
  const response = await axiosConfig.get("/oauth-login");
  return response.data;
};
// export const getUser = async () => {
//   const token = (await cookies()).get("token")?.value;
//   if (!token) return null;

//   try {
//     return jwt.verify(token, process.env.JWT_SECRET || "my-secret");
//   } catch {
//     return null;
//   }
// };
