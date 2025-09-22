// src/pages/NotFoundPage.tsx
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button"; // افترض أن لديك هذا المكون لزر موحد

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
      <div className="max-w-xl">
        <h1 className="text-8xl sm:text-9xl font-extrabold text-blue-600 dark:text-blue-400 mb-4 animate-bounce-slow">
          404
        </h1>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          {t("Page Not Found")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {t("Oops! It seems you've stumbled upon a page that doesn't exist.")}
          <br />
          {t("Don't worry, you can always go back to the homepage.")}
        </p>
        <Button
          onClick={handleGoHome}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          {t("Go back to Homepage")}
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;