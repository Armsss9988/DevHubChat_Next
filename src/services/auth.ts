import axiosConfig from "@/configs/axiosConfig";
export const login = async (email: string, password: string) => {
  try {
    // const response = await fetch("/api/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || "Login failed");
    // }
    // return await response.json();
    const res = await axiosConfig.post("/auth/login", { email, password });
    return res.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const res = await axiosConfig.post("/auth/logout");
    return res.data;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

export const signup = async (email: string, password: string, name: string) => {
  try {
    const res = await axiosConfig.post("/auth/register", {
      email,
      password,
      name,
    });
    return res.data;
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
