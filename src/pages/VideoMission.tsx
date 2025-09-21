import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPoints, completeTask, startTask } from "../store/missionsSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { AppDispatch, RootState } from "../store/store";

const VideoMission = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { videoCompleted } = useSelector((state: RootState) => state.missions);

  useEffect(() => {
    // Start timer when page opens
    if (!videoCompleted) {
      dispatch(startTask("video"));
    }
  }, [dispatch, videoCompleted]);

  const handleComplete = () => {
    if (!videoCompleted) {
      dispatch(addPoints(50));
      dispatch(completeTask("video")); // هنا هيتحسب الوقت بالثواني
    }
    navigate("/dashboard/missions");
  };

  return (
    <div className="min-h-screen items-start bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-[350px] sm:w-[500px] md:w-[600px] lg:ml-14 lg:w-[800px] bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {t("Watch Video")}
        </h2>
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
          <span className="text-gray-500 dark:text-gray-400">{t("Video Player")}</span>
        </div>
        <button
          onClick={handleComplete}
          className="w-full py-3 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium"
        >
          {t("Complete Watching")}
        </button>
      </div>
    </div>
  );
};

export default VideoMission;
