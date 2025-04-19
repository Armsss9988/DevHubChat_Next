# ⚡ Real-time Dev Chat App

> 💬 Một mini Slack/Discord, viết bằng Next.js + .NET Core, hỗ trợ chat real-time message, quản lý room, subscribe, thông báo chưa đọc.

💡 Purpose:
This project was built as a learning sandbox to explore and experiment with modern technologies like WebSockets (NestJS), Next.js, Prisma, and Nestjs. It’s not production-ready — it’s meant for hands-on learning, testing features, and improving development skills.

⚠️ Disclaimer:

The codebase has not been fully refactored yet, and there might be small bugs or non-optimal implementations.

The app does not persist tokens correctly on iOS due to strict security policies.

This project prioritizes feature implementation over polish, and is ideal for those wanting to study real-time socket systems, in-app notifications, and basic chat architecture.
---

## 🔥 Tech Stack

### Websocket flow (drawn by AI)

![image](https://github.com/user-attachments/assets/68cbc150-f1fd-407b-887a-b1cd5f3ad01c)

### Frontend
- **Next.js 14 (App Router)**
- **ANTD**
- **Redux**
- **Tailwind CSS**
- **React Query**
- **Firebase Auth** (Google, GitHub) (optional)
- **WebSocket client (Socket.io)**

### Backend
- **.NET Core (REST + WebSocket Gateway)**
- **Prisma ORM**
- **PostgreSQL**
- **AWS S3** (upload file/chat attachment) (inprocess)

---

## 📦 Features

- 🔐 **Auth**: Login with Token HTTP Only
- 📚 **Room Tabs**: `Subscribed` | `My Rooms`
- 🚪 **Join Room**: Public/Private room có password
- 💬 **Real-time Chat**: WebSocket cập nhật trực tiếp
- 📦 **Subscribed wtih Notification & Unread**
- 🧑‍💻 **Gửi code snippet**, markdown, preview file (inprocess)
- 🪪 **RBAC**: ADMIN vs USER (inprocess)
- 🔔 **Thông báo tin nhắn mới**, quản lý đã đọc/chưa đọc
- 🌐 **Dark mode** (optional) (inprocess)

---


