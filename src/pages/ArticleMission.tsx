// pages/ArticleMission.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPoints, completeTask, startTask } from "../store/missionsSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { AppDispatch, RootState } from "../store/store";

const ArticleMission = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { articleRead } = useSelector((state: RootState) => state.missions);

  useEffect(() => {
    if (!articleRead) {
      dispatch(startTask("article"));
    }
  }, [dispatch, articleRead]);

  const handleComplete = () => {
    if (!articleRead) {
      dispatch(addPoints(30));
      dispatch(completeTask("article"));
    }
    navigate("/dashboard/missions");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-[350px] sm:w-[500px] md:w-[600px] lg:ml-14 lg:w-[800px] bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t("Read Article")}</h2>
        <div className="prose dark:prose-invert max-w-none mb-4 dark:text-white">
          <h3>Lorem ipsum dolor sit amet</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </div>
        <button
          onClick={handleComplete}
          className="w-full py-3 px-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium"
        >
          {t("Complete Reading")}
        </button>
      </div>
    </div>
  );
};

export default ArticleMission;
