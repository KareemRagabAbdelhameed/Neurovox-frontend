import { useTranslation } from "react-i18next";
import type { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/themeSlice";

const Settings = () => {
  const { i18n, t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  

  return (
    <div className="min-h-screen w-full flex items-center justify-center pb-32 -ml-5 sm:-ml-0 lg:pb-0 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 sm:p-8 lg:p-10 ml-12 sm:ml-28 md:ml-36 lg:ml-44 transition-colors duration-300">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center">
          {t("settings")}
        </h1>
        
        <div className="grid gap-8 md:grid-cols-2 w-full">
          {/* Language Selection */}
          <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-16 sm:p-8">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              {t("language")}
            </label>
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="en">🇬🇧 English</option>
              <option value="ar">🇪🇬 العربية</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="es">🇪🇸 Español</option>
              <option value="zh">🇨🇳 中文</option>
              <option value="ita">🇮🇹 Italiano</option>
            </select>
          </div>
          
          {/* Theme Toggle */}
          <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 sm:p-8">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              {t("theme")}
            </label>
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-600 dark:text-gray-400">
              </span>
              <button
                onClick={()=>dispatch(toggleTheme())}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`${darkMode ? "translate-x-8" : "translate-x-1"} inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300`}
                />
              </button>
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default Settings;