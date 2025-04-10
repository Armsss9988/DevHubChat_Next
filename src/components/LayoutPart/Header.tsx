"use client";

import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const Header = () => {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  return (
    <header className="bg-[#4E6C50] text-white px-6 py-4 flex items-center justify-between shadow-amber-900 shadow-2xl rounded-b-sm z-10 h-12">
      <Link
        href="/"
        className="text-2xl font-bold text-white hover:text-[#DDE6ED] transition "
      >
        🌱 DevHub
      </Link>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm md:text-base">
              👋 Chào mừng,{" "}
              <span className="font-semibold">{user.username}</span>
            </span>
            <Button
              icon={<LogoutOutlined />}
              onClick={() => {}}
              className="bg-white text-[#4E6C50] hover:opacity-80 border-none"
            >
              Đăng xuất
            </Button>
          </>
        ) : (
          <>
            <Button
              icon={<LoginOutlined />}
              onClick={() => router.push("/login")}
              className="bg-white text-[#4E6C50] hover:opacity-80 border-none"
            >
              Đăng nhập
            </Button>
            <Button
              icon={<UserAddOutlined />}
              onClick={() => router.push("/signup")}
              className="bg-white text-[#4E6C50] hover:opacity-80 border-none"
            >
              Đăng ký
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
