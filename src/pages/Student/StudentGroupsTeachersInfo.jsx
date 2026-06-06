import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function StudentGroupsTeachersInfo({ group, onClose }) {
  if (!group) return null;

  // Hafta kunlari tarjimasi
  const WEEKDAYS_UZ = {
    MONDAY: "Du",
    TUESDAY: "Se",
    WEDNESDAY: "Ch",
    THURSDAY: "Pa",
    FRIDAY: "Ju",
    SATURDAY: "Sh",
    SUNDAY: "Ya"
  };

  const formatWeekDays = (days) => {
    if (!days || !Array.isArray(days)) return "—";
    return days.map(day => WEEKDAYS_UZ[day] || day).join(", ");
  };

  const getLessonTimeRange = (startTime, durationMinutes) => {
    if (!startTime) return "—";
    const [hours, minutes] = startTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return startTime;
    
    // Default dars davomiyligi 120 daqiqa (2 soat) agar backenddan kelmasa
    const duration = durationMinutes || 120;
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
    
    const pad = (num) => String(num).padStart(2, "0");
    const formattedStart = `${pad(hours)}:${pad(minutes)}`;
    const formattedEnd = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;
    
    return `${formattedStart} - ${formattedEnd}`;
  };

  const getTeacherRole = (role) => {
    if (!role) return "Teacher";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  // Kurs nomi va Guruh nomini birlashtirish
  const formattedTitle = `${group.courseName || ""} ${group.groupName ? group.groupName.toUpperCase() : ""}`.trim();

  // Statusni o'zbekchaga o'g'irish
  const statusLabel = group.status === "completed" ? "Tugagan" : "Faol";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 transform scale-100 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Yopish tugmasi */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-8 pt-2">
          {/* Guruh nomi va Status */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {formattedTitle || "Guruh O'qituvchilari"}
            </h2>
            <p className="text-base font-semibold text-[#4a5568] dark:text-gray-300 mt-1.5">
              {statusLabel}
            </p>
          </div>

          {/* O'qituvchilar jadvali */}
          <div className="border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/75 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      O'qituvchi
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Roli
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Dars kunlari
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Dars vaqti
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {group.teachers && group.teachers.length > 0 ? (
                    group.teachers.map((teacher, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold text-sm">
                              {teacher.full_name ? teacher.full_name.charAt(0).toUpperCase() : "T"}
                            </div>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                              {teacher.full_name || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {getTeacherRole(teacher.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {formatWeekDays(teacher.week_day)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {getLessonTimeRange(teacher.start_time, teacher.duration_hours)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-400">
                        O'qituvchilar topilmadi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
