import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import api from "../../services/axios";

// MUI Icons
import LayersIcon from "@mui/icons-material/Layers";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function StatCard({ icon, label, value, bg, color }) {
  const Icon = icon;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-sm p-6 hover:shadow-md hover:border-[#e8903e]/20 dark:hover:border-orange-500/30 transition-all duration-300 group flex-1 min-w-[200px]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-[#4a5568] dark:text-gray-400 font-medium">{label}</p>
          <div className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{value}</div>
        </div>
        <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
          {Icon ? <Icon className={`${color} w-6 h-6`} /> : null}
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students/my/groups");
      if (response.data.success) {
        setGroups(response.data.data || []);
      }
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeGroups = groups.filter((g) => g.status !== "completed");
  const completedGroups = groups.filter((g) => g.status === "completed");

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#4a5568] dark:text-white">
            {t("student_home") || "Bosh sahifa"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("student_dashboard_subtitle") || "Sizning shaxsiy kabinetingiz"}
          </p>
        </div>

        {/* Statistika kartochkalari */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
          <StatCard
            icon={LayersIcon}
            bg="bg-orange-50 dark:bg-orange-900/20"
            color="text-[#e8903e] dark:text-orange-400"
            label={t("student_active_groups") || "Faol guruhlar"}
            value={loading ? "..." : activeGroups.length}
          />
          <StatCard
            icon={SchoolIcon}
            bg="bg-blue-50 dark:bg-blue-900/20"
            color="text-[#1f39a1] dark:text-blue-400"
            label={t("student_completed_groups") || "Tugatilgan guruhlar"}
            value={loading ? "..." : completedGroups.length}
          />
          <StatCard
            icon={AssignmentIcon}
            bg="bg-green-50 dark:bg-green-900/20"
            color="text-green-600 dark:text-green-400"
            label={t("student_total_groups") || "Jami guruhlar"}
            value={loading ? "..." : groups.length}
          />
        </div>

        {/* Faol guruhlar ro'yxati */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-[#4a5568] dark:text-white">
              {t("student_my_groups") || "Mening guruhlarim"}
            </h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#e8903e] dark:border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : activeGroups.length === 0 ? (
              <div className="text-center py-20">
                <LayersIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {t("groups_not_found") || "Guruhlar topilmadi"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {activeGroups.map((guruh, index) => (
                  <div
                    key={guruh.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#e8903e] to-[#d4782e] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#4a5568] dark:text-gray-200">
                          {guruh.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {guruh.course || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {guruh.teacher && (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-[#1f39a1] rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {guruh.teacher.full_name?.charAt(0).toUpperCase() || "T"}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                            {guruh.teacher.full_name || "—"}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(guruh.start_date)}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium">
                        {guruh.status?.toUpperCase() || "ACTIVE"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
