"use client";

import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState } from "react";
import { useLogout } from "@/hooks/useAuth";
import { Skeleton } from "antd";
const Header = () => {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);

  const { mutate: logout } = useLogout();

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      logout(undefined, {
        onSuccess: () => {
          router.push("/");
        },
        onError: () => {
          setLoadingLogout(false);
        },
      });
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleLogin = async () => {
    setLoadingLogin(true);
    router.push("/login");
    setLoadingLogin(false);
  };

  const handleSignup = async () => {
    setLoadingSignup(true);
    router.push("/signup");
    setLoadingSignup(false);
  };
  if (isLoading) return <Skeleton active />;

  return (
    <div className="bg-[#4E6C50] text-white px-6 py-4 flex items-center justify-between shadow-amber-900 shadow-2xl rounded-b-sm z-10 h-16 relative">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold hover:text-[#DDE6ED] transition"
      >
        🌱 DevHub
      </Link>

      {/* Desktop buttons */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm md:text-base">
              👋 Chào mừng,{" "}
              <span className="font-semibold">{user.username}</span>
            </span>
            <Button
              icon={<LogoutOutlined />}
              loading={loadingLogout}
              onClick={handleLogout}
              className="bg-white text-[#4E6C50] hover:opacity-80 border-none"
            >
              Đăng xuất
            </Button>
          </>
        ) : (
          <>
            <Button
              icon={<LoginOutlined />}
              loading={loadingLogin}
              onClick={handleLogin}
              className="bg-white text-[#4E6C50] hover:opacity-80 border-none"
            >
              Đăng nhập
            </Button>
            <Button
              icon={<UserAddOutlined />}
              loading={loadingSignup}
              onClick={handleSignup}
              className="bg-white text-[#4E6C50] hover:opacity-80 border-none"
            >
              Đăng ký
            </Button>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-white text-xl" onClick={toggleMenu}>
        {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-4 mt-2 bg-[#4E6C50] shadow-md rounded-lg p-4 flex flex-col gap-3 z-50 md:hidden">
          {user ? (
            <>
              <span className="text-sm">
                👋 Chào mừng,{" "}
                <span className="font-semibold">{user.username}</span>
              </span>
              <Button
                icon={<LogoutOutlined />}
                loading={loadingLogout}
                onClick={handleLogout}
                className="bg-white text-[#4E6C50] hover:opacity-80 border-none w-full"
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button
                icon={<LoginOutlined />}
                loading={loadingLogin}
                onClick={() => {
                  toggleMenu();
                  handleLogin();
                }}
                className="bg-white text-[#4E6C50] hover:opacity-80 border-none w-full"
              >
                Đăng nhập
              </Button>
              <Button
                icon={<UserAddOutlined />}
                loading={loadingSignup}
                onClick={() => {
                  toggleMenu();
                  handleSignup();
                }}
                className="bg-white text-[#4E6C50] hover:opacity-80 border-none w-full"
              >
                Đăng ký
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
