// pages/Missions.tsx
import { useSelector } from "react-redux";
import { Trophy, PlayCircle, BookOpen, CheckCircle, ClipboardList, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { RootState } from "../store/store";

const Missions = () => {
  const { t } = useTranslation();
  const { points, videoCompleted, articleRead, checkedIn, surveyCompleted } = useSelector(
    (state: RootState) => state.missions
  );

  const tasks = [
    { id: "video", title: t("Watch Video"), icon: <PlayCircle className="w-8 h-8" />, completed: videoCompleted, points: 50, color: "blue" },
    { id: "article", title: t("Read Article"), icon: <BookOpen className="w-8 h-8" />, completed: articleRead, points: 30, color: "purple" },
    { id: "checkin", title: t("Daily Check-in"), icon: <CheckCircle className="w-8 h-8" />, completed: checkedIn, points: 20, color: "orange" },
    { id: "survey", title: t("Survey"), icon: <ClipboardList className="w-8 h-8" />, completed: surveyCompleted, points: 50, color: "green" },
  ];

  return (
    <div className="min-h-screen p-6 pb-32 lg:pb-1 ml-10 sm:12 md:14 lg:ml-16 ">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">{t("Daily Missions")}</h1>
        <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-6 py-2 shadow-lg">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{points}</span>
          <span className="text-gray-500 dark:text-gray-400">{t("Points")}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tasks.map(task => (
          <Link
            to={`/dashboard/missions/${task.id}`}
            key={task.id}
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 ${
              task.completed ? "border-2 border-green-500" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`text-${task.color}-500`}>{task.icon}</div>
              {task.completed && <CheckCircle className="w-6 h-6 text-green-500" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{task.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">+{task.points} {t("Points")}</span>
              {!task.completed && <ChevronRight className="w-5 h-5 text-gray-400" />}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Missions;
