// pages/CheckinMission.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPoints, completeTask, startTask } from "../store/missionsSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { AppDispatch, RootState } from "../store/store";

const CheckinMission = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { checkedIn } = useSelector((state: RootState) => state.missions);

  useEffect(() => {
    if (!checkedIn) {
      dispatch(startTask("checkin"));
    }
  }, [dispatch, checkedIn]);

  const handleCheckIn = () => {
    if (!checkedIn) {
      dispatch(addPoints(20));
      dispatch(completeTask("checkin"));
    }
    navigate("/dashboard/missions");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
      <div className="w-[300px] sm:w-[400px] md:w-[500px] lg:ml-14 lg:w-[600px] bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
        <div className="text-6xl mb-4">🎯</div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t("Check in daily to earn bonus points and maintain your streak!")}
        </p>
        <button
          onClick={handleCheckIn}
          className="w-full py-3 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium"
        >
          {t("Check In Now")}
        </button>
      </div>
    </div>
  );
};

export default CheckinMission;
