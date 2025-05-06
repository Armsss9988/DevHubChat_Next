
// Notification State
export interface NotificationState {
  visible: boolean;
  unreadCount: number;
  hasUnread: boolean;
}

// Props hoặc Hooks Handlers
export interface HeaderHandlers {
  toggleNotification: () => void;
  handleLogout: () => Promise<void>;
}

// Loading
export interface LoadingState {
  loadingLogout: boolean;
}

