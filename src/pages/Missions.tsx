
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, PlayCircle, BookOpen, Trophy, ClipboardList, X, ChevronRight } from 'lucide-react';

const Missions = () => {
  const { t } = useTranslation();
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [articleRead, setArticleRead] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [points, setPoints] = useState(0);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [readingTime, setReadingTime] = useState(0);
  const [readingInterval, setReadingInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // تتبع وقت القراءة
  const startReadingTimer = () => {
    const interval = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);
    setReadingInterval(interval);
  };

  const stopReadingTimer = () => {
    if (readingInterval) {
      clearInterval(readingInterval);
      setReadingInterval(null);
    }
  };

  // إغلاق المهمة المفتوحة
  const closeTask = () => {
    setSelectedTask(null);
    stopReadingTimer();
    setReadingTime(0);
  };

  // محاكاة إكمال الفيديو مع التحقق من الوقت
  const handleVideoComplete = () => {
    if (readingTime >= 30) { // مثال: يجب مشاهدة الفيديو لمدة 30 ثانية على الأقل
      setVideoCompleted(true);
      setPoints(prev => prev + 50);
      closeTask();
    }
  };

  // محاكاة إكمال المقال مع التحقق من وقت القراءة
  const handleArticleComplete = () => {
    if (readingTime >= 60) { // مثال: يجب قراءة المقال لمدة دقيقة على الأقل
      setArticleRead(true);
      setPoints(prev => prev + 30);
      closeTask();
    }
  };

  // تنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      if (readingInterval) {
        clearInterval(readingInterval);
      }
    };
  }, [readingInterval]);

  // بدء تتبع الوقت عند اختيار مهمة
  useEffect(() => {
    if (selectedTask === 'video' || selectedTask === 'article') {
      startReadingTimer();
    } else {
      stopReadingTimer();
    }
  }, [selectedTask]);

  // بيانات الاستبيان
  const surveyQuestions = [
    {
      id: 1,
      question: 'ما هو مستوى خبرتك في التداول؟',
      options: ['مبتدئ', 'متوسط', 'متقدم', 'محترف']
    },
    {
      id: 2,
      question: 'ما هي أهدافك الاستثمارية الرئيسية؟',
      options: ['دخل إضافي', 'ادخار طويل المدى', 'نمو رأس المال', 'المضاربة']
    },
    {
      id: 3,
      question: 'كم ساعة تقضي في متابعة الأسواق يومياً؟',
      options: ['أقل من ساعة', '1-3 ساعات', '4-6 ساعات', 'أكثر من 6 ساعات']
    }
  ];

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setSurveyCompleted(true);
      setPoints(prev => prev + 50);
      closeTask();
    }
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
    setPoints(prev => prev + 20);
    closeTask();
  };

  const tasks = [
    {
      id: 'video',
      title: t('Watch Video'),
      icon: <PlayCircle className="w-8 h-8" />,
      completed: videoCompleted,
      points: 50,
      color: 'blue'
    },
    {
      id: 'article',
      title: t('Read Article'),
      icon: <BookOpen className="w-8 h-8" />,
      completed: articleRead,
      points: 30,
      color: 'purple'
    },
    {
      id: 'checkin',
      title: t('Daily Check-in'),
      icon: <CheckCircle className="w-8 h-8" />,
      completed: checkedIn,
      points: 20,
      color: 'orange'
    },
    {
      id: 'survey',
      title: t('Survey'),
      icon: <ClipboardList className="w-8 h-8" />,
      completed: surveyCompleted,
      points: 50,
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 sm:ml-14 ml-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* عنوان الصفحة ونقاط المستخدم */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            {t('Daily Missions')}
          </h1>
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-6 py-2 shadow-lg">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{points}</span>
            <span className="text-gray-500 dark:text-gray-400">{t('Points')}</span>
          </div>
        </div>

        {/* بطاقات المهام */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                task.completed ? 'border-2 border-green-500' : ''
              }`}
              onClick={() => !task.completed && setSelectedTask(task.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`text-${task.color}-500`}>{task.icon}</div>
                {task.completed && <CheckCircle className="w-6 h-6 text-green-500" />}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {task.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  +{task.points} {t('Points')}
                </span>
                {!task.completed && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* المهمة المختارة */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.find(t => t.id === selectedTask)?.title}
                  </h2>
                  <button
                    onClick={closeTask}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* محتوى المهمة */}
                <div className="space-y-6">
                  {selectedTask === 'video' && (
                    <div className="space-y-4">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">{t('Video Player')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{t('Time Watched')}: {Math.floor(readingTime)} {t('seconds')}</span>
                        <span>{t('Required')}: 30 {t('seconds')}</span>
                      </div>
                      <button
                        onClick={handleVideoComplete}
                        disabled={readingTime < 30}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-colors duration-200 ${
                          readingTime < 30
                            ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                            : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                        }`}
                      >
                        {t('Complete Watching')}
                      </button>
                    </div>
                  )}

                  {selectedTask === 'article' && (
                    <div className="space-y-4">
                      <div className="prose dark:prose-invert max-w-none">
                        <h3>Lorem ipsum dolor sit amet</h3>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p>
                          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{t('Time Reading')}: {Math.floor(readingTime)} {t('seconds')}</span>
                        <span>{t('Required')}: 60 {t('seconds')}</span>
                      </div>
                      <button
                        onClick={handleArticleComplete}
                        disabled={readingTime < 60}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-colors duration-200 ${
                          readingTime < 60
                            ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                            : 'bg-purple-500 text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700'
                        }`}
                      >
                        {t('Complete Reading')}
                      </button>
                    </div>
                  )}

                  {selectedTask === 'checkin' && (
                    <div className="text-center space-y-4">
                      <div className="text-6xl mb-4">🎯</div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('Check in daily to earn bonus points and maintain your streak!')}
                      </p>
                      <button
                        onClick={handleCheckIn}
                        className="w-full py-3 px-4 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-200"
                      >
                        {t('Check In Now')}
                      </button>
                    </div>
                  )}

                  {selectedTask === 'survey' && (
                    <div className="space-y-4">
                      {!surveyCompleted ? (
                        <>
                          <div className="mb-4">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                              {surveyQuestions[currentQuestion].question}
                            </h4>
                            <div className="space-y-2">
                              {surveyQuestions[currentQuestion].options.map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleAnswerSelect(currentQuestion, option)}
                                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                                    answers[currentQuestion] === option
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {t('Question')} {currentQuestion + 1} / {surveyQuestions.length}
                            </span>
                            <button
                              onClick={handleNextQuestion}
                              disabled={!answers[currentQuestion]}
                              className={`py-3 px-6 rounded-xl font-medium transition-colors duration-200 ${
                                !answers[currentQuestion]
                                  ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                  : 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                              }`}
                            >
                              {currentQuestion < surveyQuestions.length - 1 ? t('Next') : t('Submit')}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-6xl mb-4">🎉</div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {t('Survey Completed!')}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {t('Thank you for your valuable feedback')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Missions;
