import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import api from "../../services/axios";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

export default function TeacherGatheringGroups() {
  const { t } = useLanguage();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGatheringGroups();
  }, []);

  const fetchGatheringGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get("/groups/gathering");
      if (response.data.success) {
        setGroups(response.data.data || []);
      }
    } catch (error) {
      console.error("Yig'ilayotgan guruhlarni yuklashda xatolik:", error);
      // Fallback
      try {
        const res = await api.get("/groups?status=GATHERING");
        if (res.data.success) {
          setGroups(res.data.data || []);
        }
      } catch (err) {
        console.error("Fallback xatolik:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          {t("teacher_gathering_title") || "Yig'ilayotgan guruhlar"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">
          {t("teacher_gathering_subtitle") || "Hali to'liq yig'ilmagan guruhlar"}
        </p>
      </div>

      {/* Qidirish */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t("search") || "Qidirish..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 dark:focus:ring-blue-500/30 focus:border-[#1f39a1] dark:focus:border-blue-500 transition-all duration-300"
          />
        </div>
      </div>

      {/* Guruhlar grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#1f39a1] dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-20">
          <HourglassEmptyIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" style={{ fontSize: 64 }} />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t("teacher_gathering_not_found") || "Yig'ilayotgan guruhlar topilmadi"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all duration-300 hover:border-amber-300/50 dark:hover:border-amber-500/30 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <GroupWorkIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white transition-colors duration-300">
                      {group.name}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {group.course?.name || ""}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                  Yig'ilmoqda
                </span>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-50 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <PersonIcon className="w-4 h-4" />
                  <span>
                    {group.students?.length || group._count?.students || 0} ta talaba
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CalendarTodayIcon className="w-4 h-4" />
                  <span>
                    {group.days || ""} {group.time ? `• ${group.time}` : ""}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
                  <span>Talabalar soni</span>
                  <span className="font-semibold text-[#1f39a1] dark:text-blue-400">
                    {group.students?.length || group._count?.students || 0} / {group.maxStudents || 15}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div
                    className="bg-amber-500 dark:bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        ((group.students?.length || group._count?.students || 0) / (group.maxStudents || 15)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
