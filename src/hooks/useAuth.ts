import { useMutation, useQuery } from "@tanstack/react-query";
import { login, signup, firebaseLogin, oauthLogin, getUser } from "../api/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => signup(email, password, name),
  });
};

export const useFirebaseLogin = () => {
  return useMutation({
    mutationFn: (token: string) => firebaseLogin(token),
  });
};

export const useOauthLogin = () => {
  return useMutation({
    mutationFn: oauthLogin,
  });
};
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = getUser();
      return user;
    },
    staleTime: 1000 * 60 * 50,
  });
}
