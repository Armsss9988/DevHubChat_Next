import { useMutation } from "@tanstack/react-query";
import {
  login,
  signup,
  firebaseLogin,
  oauthLogin,
  logout,
} from "@/services/auth";
import { useAppDispatch } from "@/redux/hook";
import { logout as logoutRedux } from "@/redux/slices/authSlice";
export const useLogin = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await login(email, password);
    },
    onSuccess: (data) => {
      console.log("user from login:", data);
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async () => {
      const res = await logout();
      return res.user;
    },
    onSuccess: () => {
      dispatch(logoutRedux());
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
    }) =>  signup(email, password, name),
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
// export const useLogout = () => {
//   const queryClient = useQueryClient();

//   const logout = async () => {
//     try {
//       await fetch(`${process.env.NEXT_PUBLIC_FE_URL}/api/logout`, {
//         method: "POST",
//       });
//       queryClient.setQueryData(["currentUser"], null);
//     } catch (err) {
//       console.error("Logout failed", err);
//     }
//   };

//   return logout;
// };
// export function useGetUser() {
//   return useQuery({
//     queryKey: ["currentUser"],
//     queryFn: async () => {
//       const user = getUser();
//       return user;
//     },
//     staleTime: 1000 * 60 * 50,
//   });
// }
