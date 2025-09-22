// pages/SurveyMission.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPoints, completeTask, startTask } from "../store/missionsSlice";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { AppDispatch, RootState } from "../store/store";
import { ArrowRight } from "lucide-react";

const surveyQuestions = [
  {
    id: 1,
    question: "ما هو مستوى خبرتك في التداول؟",
    options: ["مبتدئ", "متوسط", "متقدم", "محترف"],
  },
  {
    id: 2,
    question: "ما هي أهدافك الاستثمارية الرئيسية؟",
    options: ["دخل إضافي", "ادخار طويل المدى", "نمو رأس المال", "المضاربة"],
  },
  {
    id: 3,
    question: "كم ساعة تقضي في متابعة الأسواق يومياً؟",
    options: ["أقل من ساعة", "1-3 ساعات", "4-6 ساعات", "أكثر من 6 ساعات"],
  },
];

const SurveyMission = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { surveyCompleted } = useSelector((state: RootState) => state.missions);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!surveyCompleted) {
      dispatch(startTask("survey"));
    }
  }, [dispatch, surveyCompleted]);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      if (!surveyCompleted) {
        dispatch(addPoints(50));
        dispatch(completeTask("survey"));
      }
      navigate("/dashboard/missions");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pb-32 lg:pb-0 flex justify-center">
      <div className="w-[300px] sm:w-[400px] md:w-[500px] ml-4 lg:ml-14 lg:w-[800px] bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        {!surveyCompleted ? (
          <>
            <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t("Survey")}</h2>
            <Link to={"/dashboard/missions"}>
        <ArrowRight className="w-5 h-5 dark:text-white" /> {/* Icon */}
        </Link>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {surveyQuestions[currentQuestion].question}
            </h4>
            <div className="space-y-2 mb-6">
              {surveyQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion, option)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                    answers[currentQuestion] === option
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="py-3 px-6 rounded-xl font-medium bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors duration-200"
              >
                {currentQuestion < surveyQuestions.length - 1 ? t("Next") : t("Submit")}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t("Survey Completed!")}
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              {t("Thank you for your valuable feedback")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyMission;
