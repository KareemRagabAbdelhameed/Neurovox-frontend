import { useLocation } from "wouter";
import { cn } from "../lib/utils";
import { Badge } from "../components/ui/badge";
import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  Target,
  Users,
  Settings as SettingsIcon,
  Home,
  MoveUpRightIcon,
  MoveDownRight,
  BarChart,
  DollarSign,
  Layers,
  Target as TargetIcon
} from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({}: SidebarProps) {
  const [location] = useLocation();
  const { t } = useTranslation();

  const navigation = [
    {
      name: t("Dashboard"),
      href: "/dashboard",
      icon: Home,
      current: location === "/",
    },
    {
      name: t("Investment Plans"),
      href: "/plans",
      icon: TrendingUp,
      current: location === "/plans",
    },
    {
      name: t("Missions"),
      href: "/missions",
      icon: Target,
      current: location === "/missions",
      badge: 3,
    },
    {
      name: t("Deposits"),
      href: "/deposits",
      icon: MoveDownRight,
      current: location === "/deposits",
    },
    {
      name: t("Withdrawals"),
      href: "/withdrawals",
      icon: MoveUpRightIcon,
      current: location === "/withdrawals",
    },
    {
      name: t("Teams"),
      href: "/teams",
      icon: Users,
      current: location === "/teams",
    },
    {
      name: t("Analytics"),
      href: "/analytics",
      icon: BarChart,
      current: location === "/analytics",
    },
    {
      name: t("Settings"),
      href: "/settings",
      icon: SettingsIcon,
      current: location === "/settings",
    },
  ];

  const quickStats = [
    {
      icon: DollarSign,
      label: t("Daily Earnings"),
      value: "$1,234",
      trend: "+12.5%"
    },
    {
      icon: Layers,
      label: t("Active Plans"),
      value: "5",
      trend: "+2 " + t("this week")
    },
    {
      icon: TargetIcon,
      label: t("Active Missions"),
      value: "8",
      trend: "3 " + t("pending")
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "w-72 lg:w-64 xl:w-80 glass-card border-r border-gray-200 dark:border-gray-800 flex-shrink-0 flex-col",
          "hidden lg:flex",
          "bg-white dark:bg-gray-900"
        )}
      >
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  item.current
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300"
                )}
              >
                <item.icon
                  className={cn(
                    item.current
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300",
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-300"
                  )}
                />
                <div className="flex-1">
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* Quick Stats Card */}
          <div className="mt-8 px-4">
            <div
              className={cn(
                "p-4 rounded-xl transition-all duration-300",
                "bg-gradient-to-br from-blue-50 to-indigo-50",
                "dark:from-blue-900/20 dark:to-indigo-900/20",
                "hover:from-blue-100 hover:to-indigo-100",
                "dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30",
                "border border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800",
                "group"
              )}
            >
              <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-4">
                {t("Quick Stats")}
              </h2>
              <div className="space-y-4">
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg",
                      "bg-white dark:bg-gray-800/50",
                      "group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20",
                      "transition-all duration-300"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                        <stat.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </p>
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                      {stat.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.slice(0, 8).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                item.current
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400",
                "flex flex-col items-center p-2 text-xs rounded-lg transition-colors duration-200"
              )}
            >
              <div className="relative">
                <item.icon className="h-3 w-3 mx-auto" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 truncate">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
