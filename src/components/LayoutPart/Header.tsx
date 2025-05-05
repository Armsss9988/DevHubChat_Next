"use client";

import { Badge, Button, Drawer, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  MenuOutlined,
  CloseOutlined,
  BellOutlined,
} from "@ant-design/icons";
import {
  useEffect,
  useState,
  useCallback,
  memo,
  lazy,
  Suspense,
  useMemo,
} from "react";
import { useLogout } from "@/hooks/useAuth";
import { useAppSelector } from "@/redux/hook";
import {
  setFaviconWithNotification,
  resetFavicon,
} from "@/services/notificationUtils";
import { getSocket } from "@/services/socket";
import {
  useMarkAllNotificationsAsRead,
  useNotifications,
} from "@/hooks/useNotification";
import { useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/types/notification";

const NotificationList = lazy(() =>
  import("../Notification/NotificationList").then((module) => ({
    default: module.default,
  }))
);

// CSS cho hiệu ứng menu mobile
const menuStyles = `
  .mobile-menu {
    transition: transform 300ms ease-in-out, opacity 300ms ease-in-out;
    transform: translateY(-10px);
    opacity: 0;
  }
  .mobile-menu-open {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Header = memo(() => {
  const router = useRouter();
  const user = useAppSelector((state) => state?.auth?.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationState, setNotificationState] = useState({
    visible: false,
    unreadCount: 0,
    hasUnread: false,
  });
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { data: notifications } = useNotifications();
  const { mutate: setAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();

  const unreadCount = useMemo(
    () => notifications?.filter((n: Notification) => !n.isRead).length || 0,
    [notifications]
  );

  const toggleMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    setLoadingLogout(true);
    try {
      logout(undefined, {
        onSuccess: () => router.push("/"),
        onError: () => setLoadingLogout(false),
      });
    } finally {
      setLoadingLogout(false);
    }
  }, [logout, router]);

  const handleLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  const handleSignup = useCallback(() => {
    router.push("/signup");
  }, [router]);

  const toggleNotification = useCallback(() => {
    setNotificationState((prev) => ({ ...prev, visible: true }));
  }, []);

  const closeNotification = useCallback(() => {
    setNotificationState({ visible: false, unreadCount: 0, hasUnread: false });
    resetFavicon();
    setAsRead();
  }, [setAsRead]);

  // Xử lý trạng thái người dùng
  useEffect(() => {
    if (!user) {
      setNotificationState({
        visible: false,
        unreadCount: 0,
        hasUnread: false,
      });
      resetFavicon();
    } else {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  }, [user, queryClient]);

  // Cập nhật favicon khi có thông báo mới
  useEffect(() => {
    if (unreadCount > 0) {
      setNotificationState((prev) => ({ ...prev, hasUnread: true }));
      setFaviconWithNotification();
    } else {
      setNotificationState((prev) => ({ ...prev, hasUnread: false }));
      resetFavicon();
    }
  }, [unreadCount]);

  // Xử lý thông báo qua socket
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = () => {
      messageApi.info("Bạn có tin nhắn mới!");
      setNotificationState((prev) => ({
        ...prev,
        unreadCount: prev.unreadCount + 1,
        hasUnread: true,
      }));
      setFaviconWithNotification();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    socket.on("notification", handleNewNotification);

    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [user, messageApi, queryClient]);

  return (
    <>
      <style>{menuStyles}</style>
      {contextHolder}
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
          {user && (
            <Button
              type="text"
              onClick={toggleNotification}
              className="relative"
            >
              <Badge dot={notificationState.hasUnread} offset={[-2, 2]}>
                <BellOutlined style={{ fontSize: 20, color: "white" }} />
              </Badge>
            </Button>
          )}

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
                onClick={handleLogin}
                className="bg-white text-[#4E6C50] hover:opacity-80 border-none"
              >
                Đăng nhập
              </Button>
              <Button
                icon={<UserAddOutlined />}
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
          <div
            className={`absolute top-full right-4 mt-2 bg-[#4E6C50] shadow-md rounded-lg p-4 flex flex-col gap-3 z-50 md:hidden mobile-menu ${
              isMobileMenuOpen ? "mobile-menu-open" : ""
            }`}
          >
            {user && (
              <Badge
                count={notificationState.unreadCount}
                size="small"
                offset={[0, 5]}
              >
                <Button
                  icon={<BellOutlined />}
                  onClick={() => {
                    toggleNotification();
                    toggleMenu();
                  }}
                  className="text-white bg-transparent border-none w-full"
                />
              </Badge>
            )}

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

      {/* Notification Drawer */}
      <Drawer
        title="Thông báo"
        placement="right"
        closable={true}
        onClose={closeNotification}
        open={notificationState.visible}
      >
        <Suspense fallback={<p>Đang tải thông báo...</p>}>
          {!notifications || notifications.length === 0 ? (
            <p>Không có thông báo nào.</p>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto">
              <NotificationList notifications={notifications} />
            </div>
          )}
        </Suspense>
      </Drawer>
    </>
  );
});

Header.displayName = "Header";

export default Header;
