import { useLanguage } from "../../contexts/LanguageContext";
import SchoolIcon from "@mui/icons-material/School";

export default function StudentExtraLessons() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#4a5568] dark:text-white mb-6">
          {t("student_extra_lessons") || "Qo'shimcha darslar"}
        </h1>
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg p-12 text-center">
          <SchoolIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" style={{ fontSize: 64 }} />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t("student_extra_lessons_empty") || "Qo'shimcha darslar hozircha mavjud emas"}
          </p>
        </div>
      </div>
    </div>
  );
}
