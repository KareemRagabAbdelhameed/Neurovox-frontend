import React from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/card";
import {
  CalendarDays,
  TrendingUp,
  Zap,
  Shield,
  DollarSign,
  Clock,
  ChevronRight,
  Wallet,
  ArrowUpRight,
  Target,
  Trophy,
  Download,
  Upload,
  PlusCircle,
  Flag,
  Activity,
  Sparkles,
} from "lucide-react";

const InvestmentPlans = () => {
  const stats = [
    {
      title: "Total Balance",
      icon: <Wallet className="w-5 h-5 text-emerald-500 dark:text-emerald-300" />,
      value: "$12,450.80",
      description: "+14.5% this month",
      trend: "up",
    },
    {
      title: "Active Investments",
      icon: <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-300" />,
      value: "5",
      description: "2 pending approval",
      trend: "neutral",
    },
    {
      title: "Total Earnings",
      icon: <ArrowUpRight className="w-5 h-5 text-purple-500 dark:text-purple-300" />,
      value: "$2,840.50",
      description: "+22% vs last month",
      trend: "up",
    },
    {
      title: "Completed Missions",
      icon: <Target className="w-5 h-5 text-amber-500 dark:text-amber-300" />,
      value: "12/15",
      description: "80% completion rate",
      trend: "up",
    },
  ];

  const actions = [
    {
      title: "Deposit",
      icon: <Download className="w-6 h-6 text-emerald-500 dark:text-emerald-300" />,
      classes: {
        wrapper: "bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-300/20 dark:hover:bg-emerald-300/30",
        iconBox: "bg-emerald-500/20 dark:bg-emerald-300/30",
      },
    },
    {
      title: "Withdraw",
      icon: <Upload className="w-6 h-6 text-blue-500 dark:text-blue-300" />,
      classes: {
        wrapper: "bg-blue-500/10 hover:bg-blue-500/20 dark:bg-blue-300/20 dark:hover:bg-blue-300/30",
        iconBox: "bg-blue-500/20 dark:bg-blue-300/30",
      },
    },
    {
      title: "New Plan",
      icon: <PlusCircle className="w-6 h-6 text-purple-500 dark:text-purple-300" />,
      classes: {
        wrapper: "bg-purple-500/10 hover:bg-purple-500/20 dark:bg-purple-300/20 dark:hover:bg-purple-300/30",
        iconBox: "bg-purple-500/20 dark:bg-purple-300/30",
      },
    },
    {
      title: "Missions",
      icon: <Flag className="w-6 h-6 text-amber-500 dark:text-amber-300" />,
      classes: {
        wrapper: "bg-amber-500/10 hover:bg-amber-500/20 dark:bg-amber-300/20 dark:hover:bg-amber-300/30",
        iconBox: "bg-amber-500/20 dark:bg-amber-300/30",
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-300 dark:to-blue-300 bg-clip-text text-transparent">
            Welcome Back, Kareem
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Here is your portfolio overview</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 dark:from-amber-300 dark:to-orange-300 dark:hover:from-amber-400 dark:hover:to-orange-400 text-white">
          <Trophy className="w-4 h-4 mr-2" />
          STARTER TIER
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6 bg-gradient-to-br from-background/50 to-background border-border dark:border-gray-700 hover:border-border/80 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{stat.title}</span>
                {stat.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                <p
                  className={`text-sm flex items-center gap-1 ${
                    stat.trend === "up"
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {stat.trend === "up" && <Activity className="w-4 h-4" />}
                  {stat.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-br from-background/50 to-background border-border dark:border-gray-700">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your investments and activities
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`p-4 rounded-lg transition-all duration-300 group ${action.classes.wrapper}`}
              >
                <div className="space-y-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${action.classes.iconBox}`}
                  >
                    {action.icon}
                  </div>
                  <span className="block font-medium text-gray-900 dark:text-white">{action.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Active Investments & Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Investments */}
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-300/20 dark:via-purple-300/20 dark:to-pink-300/20 backdrop-blur-sm border-border dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Investments</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Your ongoing investment plans
                </p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 dark:bg-blue-300/30 dark:text-blue-300 dark:hover:bg-blue-300/40">
                5 Active
              </Badge>
            </div>
            {/* Add your active investments list here */}
          </div>
        </Card>

        {/* Active Missions */}
        <Card className="p-6 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 dark:from-amber-300/20 dark:via-orange-300/20 dark:to-red-300/20 backdrop-blur-sm border-border dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Missions</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete tasks to earn rewards
                </p>
              </div>
              <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 dark:bg-amber-300/30 dark:text-amber-300 dark:hover:bg-amber-300/40">
                3 Available
              </Badge>
            </div>
            {/* Add your active missions list here */}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InvestmentPlans;