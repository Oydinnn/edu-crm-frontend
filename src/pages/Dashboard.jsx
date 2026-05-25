import { useState, useEffect } from "react";
import api from "../services/axios";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";
import { useLanguage } from "../contexts/LanguageContext";

export default function DashboardPage() {
  const { t } = useLanguage();
  const [statsData, setStatsData] = useState({
    groups: 0,
    courses: 0,
    students: 0,
    teachers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/users/dashboard-stats");
        if (response.data.success) {
          setStatsData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      label: t("stats_groups"),
      value: statsData.groups,
      icon: GroupIcon,
      bg: "bg-[#f0f4ff] dark:bg-slate-700/50",
      color: "text-[#1f39a1] dark:text-blue-400",
    },
    {
      label: t("stats_courses"),
      value: statsData.courses,
      icon: BookIcon,
      bg: "bg-[#f0f4ff] dark:bg-slate-700/50",
      color: "text-[#1f39a1] dark:text-blue-400",
    },
    {
      label: t("stats_students"),
      value: statsData.students,
      icon: PersonIcon,
      bg: "bg-[#f0f4ff] dark:bg-slate-700/50",
      color: "text-[#1f39a1] dark:text-blue-400",
    },
    {
      label: t("stats_teachers"),
      value: statsData.teachers,
      icon: SchoolIcon,
      bg: "bg-[#f0f4ff] dark:bg-slate-700/50",
      color: "text-[#1f39a1] dark:text-blue-400",
    },
  ];

  return (
    <main className="flex-1">
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-sm p-6 hover:shadow-md hover:border-[#1f39a1]/20 dark:hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#4a5568] dark:text-gray-400 text-sm font-medium">
                      {stat.label}
                    </p>
                    <div className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">
                      {loading ? (
                        <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 animate-pulse rounded mt-1"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                  >
                    <Icon className={`${stat.color} w-6 h-6`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dars Jadvali */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {t("lesson_schedule")}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f0f4ff] dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  {[
                    { key: "col_time", label: "Vaqt" },
                    { key: "col_classes", label: "Sinflar" },
                    { key: "col_subjects", label: "Fanlar" },
                    { key: "col_teacher", label: "O'qituvchi" },
                    { key: "col_status", label: "Holat" }
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="text-left py-3 px-4 text-sm font-semibold text-[#1f39a1] dark:text-blue-400"
                    >
                      {t(col.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-[#4a5568] dark:text-gray-400 text-sm"
                  >
                    {t("no_lessons")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

