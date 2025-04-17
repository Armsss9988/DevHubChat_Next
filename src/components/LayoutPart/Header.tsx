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
import { useEffect, useState } from "react";
import { useLogout } from "@/hooks/useAuth";
import { useAppSelector } from "@/redux/hook";
import {
  setFaviconWithNotification,
  resetFavicon,
} from "@/services/notificationUtils";
import { getSocket } from "@/services/socket";
import { Notification, NotificationPayload } from "@/types/notification";
import {
  useMarkAllNotificationsAsRead,
  useNotifications,
} from "@/hooks/useNotification";
import { NotificationList } from "../Notification/NotificationList";

const Header = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state?.auth?.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [hasUnread, setHasUnread] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { data: notificationGet, refetch } = useNotifications();
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const { mutate: setAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: logout } = useLogout();
  refetch();
  useEffect(() => {
    if (notificationGet) {
      const notiData: NotificationPayload[] = notificationGet.map(
        (noti: Notification) => ({
          type: "NEW_MESSAGE",
          roomId: noti.roomId,
          roomName: noti.room.name,
          fromUserId: noti.userId,
          fromUsername: noti.user.username,
          isRead: noti.isRead,
          message: noti.message.content,
        })
      );
      setNotifications(notiData);
      if (notificationGet && notificationGet[0] && notificationGet[0].isRead) {
        setHasUnread(true);
        setUnreadCount(1);
        setFaviconWithNotification();
      }
    }
  }, [notificationGet]);

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setHasUnread(false);
      setNotificationVisible(false);
    }
  }, [user]);
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.id) return;

    const handleNewNotification = (notification: NotificationPayload) => {
      messageApi.info("Bạn có tin nhắn mới!!");
      setHasUnread(true);
      setFaviconWithNotification();
      setNotifications((prev) => [...prev, notification]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification", handleNewNotification);

    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [user?.id]);

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

  const toggleNotification = () => {
    setNotificationVisible(true);
  };

  const closeNotification = () => {
    setNotificationVisible(false);
    setUnreadCount(0);
    setHasUnread(false);
    resetFavicon();
    setAsRead();
  };

  return (
    <>
      <div className="bg-[#4E6C50] text-white px-6 py-4 flex items-center justify-between shadow-amber-900 shadow-2xl rounded-b-sm z-10 h-16 relative">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold hover:text-[#DDE6ED] transition"
        >
          🌱 DevHub
        </Link>
        {contextHolder}
        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user && (
            <Button
              type="text"
              onClick={() => toggleNotification()}
              className="relative"
            >
              <Badge dot={hasUnread} offset={[-2, 2]}>
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
            {user && (
              <Badge count={unreadCount} size="small" offset={[0, 5]}>
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

        {/* Notification Drawer */}
      </div>
      <Drawer
        title="Thông báo"
        placement="right"
        closable={true}
        onClose={closeNotification}
        open={notificationVisible}
      >
        {notifications.length === 0 ? (
          <p>Không có thông báo nào.</p>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto">
            <NotificationList notifications={notifications} />
          </div>
        )}
      </Drawer>
    </>
  );
};

export default Header;
