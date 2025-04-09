import { useMutation } from "@tanstack/react-query";
import { login, signup, firebaseLogin, oauthLogin } from "@/services/auth";

export const useLogin = () => {
  return useMutation<User, Error, { email: string; password: string }>({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await login(email, password);
      return res.user;
    },
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
// export function useUser() {
//   return useQuery({
//     queryKey: ["user"],
//     queryFn: async () => {
//       const user = getUser();
//       return user;
//     },
//     staleTime: 1000 * 60 * 50,
//   });
// }
