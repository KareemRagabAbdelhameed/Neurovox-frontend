import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Brain, Menu, LogIn, X, Home, Target, User, TrendingUp, MoveDownRight, MoveUpRightIcon, Users, BarChart, SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Settings, LogOut } from "lucide-react";
import Swal from "sweetalert2";
import { logoutUser } from "../store/authSlice";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import api from "../config/axiosConfig";
import { fetchUser } from "../store/userSlice";
import axios from "axios";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { data: userInfo, loading, error } = useSelector((state: RootState) => state.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (sidebarRef.current && isMobileSidebarOpen && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSidebarOpen]);

  // Close dropdowns on escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsNotificationsOpen(false);
        setIsMobileSidebarOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("notifications"); 
        console.log(res.data.data);
        setNotifications(res.data.data);
        const unreadNotifications = res.data.data.filter((notification: any) => !notification.isRead);
        setUnreadCount(unreadNotifications.length);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification: any) => {
    try {
      // تحديث حالة الإشعار في الواجهة
      const updatedNotifications = notifications.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      );
      setNotifications(updatedNotifications);
      setUnreadCount(prev => prev - 1);
      
      // إرسال طلب PATCH إلى الخادم
      const res = await axios.patch(`http://195.200.15.135/notifications/is-read/${notification.id}`);
      console.log(res);
      setIsNotificationsOpen(false);
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
    if (onMobileMenuToggle) {
      onMobileMenuToggle();
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileSidebarOpen(false);
  };

  if (isLoading) {
    return (
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="w-20 h-4 bg-gray-300 dark:bg-gray-700 rounded hidden lg:block"></div>
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </header>
    );
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      Swal.fire({
        icon: "success",
        title: t("Logged out successfully"),
        position: "top",
        toast: true,
        timer: 3000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("Logout failed"),
        text: String(error),
        position: "top",
        toast: true,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  

  // Mobile navigation items
  const mobileNavItems = [
    { path: "/dashboard", icon: Home, label: t("Dashboard") },
    { path: "/dashboard/plans", icon: TrendingUp, label: t("Investment Plans") },
    { path: "/dashboard/missions", icon: Target, label: t("Missions") },
    { path: "/dashboard/deposits", icon: MoveDownRight, label: t("Deposits") },
    { path: "/dashboard/withdrawals", icon: MoveUpRightIcon, label: t("Withdrawals") },
    { path: "/dashboard/teams", icon: Users, label: t("Teams") },
    { path: "/dashboard/analytics", icon: BarChart, label: t("Analytics") },
    { path: "/dashboard/settings", icon: SettingsIcon, label: t("Settings") },
    { path: "/dashboard/profile", icon: User, label: t("Profile") },
  ];

  const mobileNavBottomItems = [
    { path: "/dashboard", icon: Home, label: t("Dashboard") },
    { path: "/dashboard/missions", icon: Target, label: t("Missions") },
    { path: "/dashboard/deposits", icon: MoveDownRight, label: t("Deposits") },
    { path: "/dashboard/withdrawals", icon: MoveUpRightIcon, label: t("Withdrawals") },
    { path: "/dashboard/profile", icon: User, label: t("Profile") },
  ]

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={handleMobileMenuToggle}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
            
            {/* Logo and Title */}
            <Link to="/dashboard" className="flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <div className="hidden w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 sm:flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30 hover:shadow-indigo-500/30 dark:hover:shadow-indigo-900/40 transition-shadow duration-300">
                <Brain className="hidden sm:flex w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text hover:scale-105 transition-transform duration-300">Neurovox</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI Investment Platform</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">

            {token ? (
              // Authenticated User UI
              <>
                {/* Balance Display - Hidden on mobile */}
                <div className="hidden lg:flex items-center space-x-6">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-300 border border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-white">{t("Available Balance")}</p>
                    <p className="text-base font-semibold text-green-600 dark:text-green-400" data-testid="text-header-balance">
                      ${userInfo?.availableBalance || "0.00"}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 border border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-white">{t("Total Earnings")}</p>
                    <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400" data-testid="text-header-earnings">
                      ${userInfo?.totalEarnings || "0.00"}
                    </p>
                  </div>
                </div>

                {/* Notification Bell */}
                <div className="relative" ref={notificationsRef}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 border border-gray-100 dark:border-gray-800"
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    data-testid="button-notifications"
                  >
                    <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </Button>

                  {/* Notifications Dropdown */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-4 w-64 sm:w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{t("Notifications")}</h4>
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs h-auto p-1 text-indigo-600 dark:text-indigo-400"
                              onClick={() => {
                                setNotifications(notifications.map(n => ({ ...n, unread: false })));
                                setUnreadCount(0);
                              }}
                            >
                              {t("Mark all read")}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => setIsNotificationsOpen(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                              onClick={() => {
                                handleNotificationClick(notification);
                                const updatedNotifications = notifications.map(n => 
                                  n.id === notification.id ? { ...n, isRead: true } : n
                                );
                                setNotifications(updatedNotifications);
                                setUnreadCount(prev => prev - 1);
                                setIsNotificationsOpen(false);
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{notification.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 ml-2"></div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">{t("No notifications")}</p>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-800">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-center text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 py-3"
                          onClick={() => {
                            setIsNotificationsOpen(false);
                          }}
                        >
                          {t("View All Notifications")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full p-0"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-label="User menu"
                  >
                    <Avatar className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:ring-2 hover:ring-indigo-500 dark:hover:ring-indigo-400 transition-all duration-300">
                      <AvatarFallback className="text-white font-semibold">
                        {userInfo?.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>

                  {/* Custom Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
                      <div className="flex items-center justify-start gap-3 p-4">
                        <Link to={"/dashboard/profile"}>
                        <Avatar className="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600">
                          <AvatarFallback className="text-white">
                            {userInfo?.firstName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        </Link>
                        <div className="flex flex-col space-y-1 leading-none overflow-hidden">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {userInfo?.firstName || "User"} {userInfo?.lastName || "User"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {userInfo?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-800"></div>
                      
                      <div className="py-2">
                        <Link
                          to="/dashboard/settings"
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          {t("Settings")}
                        </Link>
                        {/* New Profile Link */}
                        <Link
                          to="/dashboard/profile"
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          {t("Profile")}
                        </Link>
                        
                        <button
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          {t("Log out")}
                        </button>
                      </div>
                      
                      {/* Mobile-only balance display */}
                      <div className="lg:hidden border-t border-gray-200 dark:border-gray-800"></div>
                      <div className="lg:hidden p-4 space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t("Available Balance")}</p>
                          <p className="text-base font-semibold text-green-600 dark:text-green-400">
                            ${userInfo?.availableBalance || "0.00"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t("Total Earnings")}</p>
                          <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
                            ${userInfo?.totalEarnings || "0.00"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Non-authenticated User UI
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link to="/">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-300"
                  >
                    {t("Login")}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-indigo-900/30 transition-all duration-300 hover:scale-105"
                  >
                    <LogIn className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{t("Register Now")}</span>
                    <span className="sm:hidden">{t("Register")}</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)}>
          <div 
            ref={sidebarRef}
            className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text hover:scale-105 transition-transform duration-300">Neurovox</h2>
                </div>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close mobile menu"
                >
                  <X className="w-5 h-5 dark:text-white" />
                </button>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {mobileNavItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                        location.pathname === item.path
                          ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar - Only show when user is authenticated AND sidebar is closed */}
      {token && !isMobileSidebarOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-2 flex justify-around items-center lg:hidden z-30">
          {mobileNavBottomItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                location.pathname === item.path
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}