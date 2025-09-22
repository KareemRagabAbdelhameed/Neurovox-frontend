// src/pages/NotificationsPage.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../config/axiosConfig";
import { Bell, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import axios from "axios"; // تم الإبقاء على استيراد axios المباشر بناءً على طلبك

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);

  const fetchAllNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data);
    } catch (err) {
      console.error("Failed to fetch all notifications:", err);
      setError(t("Failed to load notifications. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, [t]);

  const handleMarkAsRead = async (id: string) => {
    try {
      // تم الإبقاء على استخدام axios.patch المباشر بناءً على طلبك
      await axios.patch(`http://195.200.15.135/notifications/is-read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      // يمكنك إضافة رسالة نجاح هنا إذا أردت
    } catch (err) {
      console.error(`Failed to mark notification ${id} as read:`, err);
      // رسالة خطأ للمستخدم للمساعدة في التشخيص
      alert(t("Failed to mark notification as read. Please try again.")); 
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAllAsRead(true);
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      const patchPromises = unreadNotifications.map(n => 
        // تم الإبقاء على استخدام axios.patch المباشر بناءً على طلبك
        axios.patch(`http://195.200.15.135/notifications/is-read/${n.id}`)
      );
      
      await Promise.all(patchPromises);

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      // يمكنك إضافة رسالة نجاح هنا
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      alert(t("Failed to mark all notifications as read. Please try again."));
    } finally {
      setIsMarkingAllAsRead(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex justify-center items-center">
        <p className="text-gray-700 dark:text-gray-300">{t("Loading notifications...")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex justify-center items-start">
      <div className="relative w-full max-w-screen-xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mt-8">
        {/* Back Button (moved to right side) */}
        <button
          onClick={handleGoBack}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t("Go back")}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center sm:text-left mt-10 sm:mt-0">
          {t("All Notifications")} ({unreadCount} {t("unread")})
        </h2>

        <div className="flex justify-end mb-4">
          {unreadCount > 0 && (
            <Button 
              onClick={handleMarkAllAsRead} 
              variant="outline" 
              className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm"
              disabled={isMarkingAllAsRead}
            >
              {isMarkingAllAsRead ? t("Marking all read...") : t("Mark All As Read")}
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">{t("You have no notifications yet.")}</p>
          </div>
        ) : (
          <>
            {/* Table for medium screens and up */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("Title")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("Message")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("Date")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("Status")}
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">{t("Actions")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <tr key={notification.id} className={`${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {notification.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            notification.isRead
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          }`}
                        >
                          {notification.isRead ? t("Read") : t("Unread")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title={t("Mark as Read")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {t("Mark as Read")}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card layout for small screens */}
            <div className="md:hidden space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    !notification.isRead
                      ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-700'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  } shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 max-w-[calc(100%-60px)] truncate">
                      {notification.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        notification.isRead
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      }`}
                    >
                      {notification.isRead ? t("Read") : t("Unread")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 h-auto"
                        title={t("Mark as Read")}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="sr-only">{t("Mark as Read")}</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;