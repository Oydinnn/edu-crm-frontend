import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/axios";
import StudentGroupsTeachersInfo from "./StudentGroupsTeachersInfo";
import StudentShowModal from "./StudentShowModal";

// MUI Icons
import GroupIcon from "@mui/icons-material/Group";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

function GuruhKorishModal({ guruh, onClose }) {
  if (!guruh) return null;

  const AVATAR_COLORS = [
    { bg: "#ede9fe", color: "#5b21b6" },
    { bg: "#ecfdf5", color: "#065f46" },
    { bg: "#fef3c7", color: "#92400e" },
    { bg: "#fee2e2", color: "#991b1b" },
    { bg: "#e0f2fe", color: "#0c4a6e" },
  ];

  const av = AVATAR_COLORS[guruh.groupId % AVATAR_COLORS.length];
  const initials = guruh.groupName ? guruh.groupName.slice(0, 2).toUpperCase() : "G";

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl"
              style={{ backgroundColor: av.bg, color: av.color }}
            >
              {initials}
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[#1f39a1] dark:text-blue-400">
                {guruh.groupName}
              </h2>
              <p className="text-sm text-gray-400 mt-1">{guruh.courseName || "Guruh haqida"}</p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer">
            <CloseIcon className="text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Yo'nalishi</p>
              <p className="font-semibold text-[#4a5568] dark:text-gray-200">
                {guruh.courseName || "—"}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <p
                className={`font-bold text-[15px] uppercase ${
                  guruh.status !== "completed"
                    ? "text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                    : "text-gray-500"
                }`}
              >
                {guruh.status || "ACTIVE"}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Boshlash vaqti</p>
              <p className="font-semibold text-[#4a5568] dark:text-gray-200">
                {formatDate(guruh.startDate)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Dars vaqti</p>
              <p className="font-semibold text-[#4a5568] dark:text-gray-200">
                {guruh.startTime || "—"}
              </p>
            </div>
          </div>

          {guruh.weekDay?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Dars kunlari
              </p>
              <div className="flex flex-wrap gap-2">
                {guruh.weekDay.map((day, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-[#1f39a1] dark:bg-blue-600 text-white text-xs"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* O'qituvchi */}
          {guruh.teacherCount > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                O'qituvchilar soni
              </p>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                <div className="w-10 h-10 bg-[#1f39a1] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {guruh.teacherCount}
                </div>
                <span className="text-sm font-medium text-[#4a5568] dark:text-gray-300">
                  {guruh.teacherCount} ta o'qituvchi
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex gap-3 bg-gray-50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentGroups() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aktifTab, setAktifTab] = useState("faol");
  const [korishModal, setKorishModal] = useState(false);
  const [tanlanganGuruh, setTanlanganGuruh] = useState(null);
  const [teachersModal, setTeachersModal] = useState(false);
  const [selectedTeachersGroup, setSelectedTeachersGroup] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students/my/groups");
      if (response.data.success) {
        setGroups(response.data.data || []);
      }
    } catch (error) {
      console.error("Guruhlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredGroups = groups.filter((group) => {
    if (aktifTab === "faol") {
      return group.status !== "completed";
    }
    return group.status === "completed";
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="p-4 sm:p-6">
        {/* Tablar */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-slate-800 mb-6">
          {[
            { key: "faol", label: t("student_active") || "Faol" },
            { key: "tugagan", label: t("student_finished") || "Tugagan" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setAktifTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium
                border-b-2 transition-all duration-300 -mb-px cursor-pointer
                ${
                  aktifTab === key
                    ? "border-[#1f39a1] text-[#1f39a1] dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-[#4a5568] dark:text-gray-400 hover:text-[#1f39a1] dark:hover:text-blue-400 hover:bg-[#f0f4ff]/50 dark:hover:bg-slate-800 rounded-t-lg"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Jadval */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#1f39a1] dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-20">
                <GroupIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {t("groups_not_found") || "Guruhlar topilmadi"}
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="flex items-center px-4 py-3.5 bg-[#f0f4ff]/60 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800 min-w-max">
                  <div className="w-12 px-1">
                    <span className="text-xs font-semibold text-[#1f39a1] dark:text-blue-400 uppercase tracking-wide">
                      #
                    </span>
                  </div>
                  <div className="flex-1 px-1">
                    <span className="text-xs font-semibold text-[#1f39a1] dark:text-blue-400 uppercase tracking-wide">
                      Guruh nomi
                    </span>
                  </div>
                  <div className="flex-1 px-1">
                    <span className="text-xs font-semibold text-[#1f39a1] dark:text-blue-400 uppercase tracking-wide">
                      Yo'nalishi
                    </span>
                  </div>
                  <div className="flex-1 px-1">
                    <span className="text-xs font-semibold text-[#1f39a1] dark:text-blue-400 uppercase tracking-wide">
                      O'qituvchi
                    </span>
                  </div>
                  <div className="flex-1 px-1">
                    <span className="text-xs font-semibold text-[#1f39a1] dark:text-blue-400 uppercase tracking-wide">
                      Boshlash vaqti
                    </span>
                  </div>
                  <div className="w-24 px-1 text-center">
                    <span className="text-xs font-semibold text-[#1f39a1] dark:text-blue-400 uppercase tracking-wide">
                      Amallar
                    </span>
                  </div>
                </div>

                {/* Table Rows */}
                {filteredGroups.map((guruh, index) => (
                  <div
                    key={guruh.groupId}
                    onClick={() => {
                      navigate(`/student/groups/${guruh.groupId}`, {
                        state: { group: guruh },
                      });
                    }}
                    className="flex items-center px-4 py-3.5 border-b border-gray-50 dark:border-slate-800/50 hover:bg-[#f0f4ff]/30 dark:hover:bg-slate-800/20 transition-all duration-300 min-w-max cursor-pointer"
                  >
                    {/* # */}
                    <div className="w-12 px-1">
                      <span className="text-sm font-medium text-[#4a5568] dark:text-gray-300">
                        {index + 1}
                      </span>
                    </div>

                    {/* Guruh nomi */}
                    <div className="flex-1 px-1">
                      <span className="text-sm font-medium text-[#4a5568] dark:text-gray-200">
                        {guruh.groupName}
                      </span>
                    </div>

                    {/* Yo'nalishi */}
                    <div className="flex-1 px-1">
                      <span className="text-sm text-[#4a5568] dark:text-gray-300">
                        {guruh.courseName || "—"}
                      </span>
                    </div>

                    {/* O'qituvchi */}
                    <div
                      className="flex-1 px-1 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        if (guruh.teacherCount > 0) {
                          e.stopPropagation();
                          setSelectedTeachersGroup(guruh);
                          setTeachersModal(true);
                        }
                      }}
                    >
                      {guruh.teacherCount > 0 ? (
                        <>
                          <div className="w-7 h-7 bg-white  rounded-full flex items-center justify-center text-[#1f39a1] text-xs border-1 border-[#1f39a1]  shadow-sm">
                            {guruh.teacherCount}
                          </div>
                          <span className="text-sm text-[#4a5568] dark:text-gray-300 truncate max-w-[120px]">
                            {guruh.teacherCount} ta o'qituvchi
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </div>

                    {/* Boshlash vaqti */}
                    <div className="flex-1 px-1">
                      <span className="text-sm text-[#4a5568] dark:text-gray-300">
                        {formatDate(guruh.startDate)}
                      </span>
                    </div>

                    {/* Amallar */}
                    <div className="w-24 px-1 flex justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileModalOpen(true);
                        }}
                        className="p-1 text-gray-400 hover:text-[#1f39a1] dark:hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        <VisibilityIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* + tugmasi */}
        <div className="flex justify-center mt-8">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500 hover:border-[#1f39a1] hover:text-[#1f39a1] dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer">
            <AddIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Guruh Ko'rish Modal */}
      {korishModal && tanlanganGuruh && (
        <GuruhKorishModal
          guruh={tanlanganGuruh}
          onClose={() => {
            setKorishModal(false);
            setTanlanganGuruh(null);
          }}
        />
      )}

      {/* O'qituvchilar Ma'lumotlari Modali */}
      {teachersModal && selectedTeachersGroup && (
        <StudentGroupsTeachersInfo
          group={selectedTeachersGroup}
          onClose={() => {
            setTeachersModal(false);
            setSelectedTeachersGroup(null);
          }}
        />
      )}

      {/* Student Show Modal */}
      {profileModalOpen && user && (
        <StudentShowModal
          student={user}
          onClose={() => setProfileModalOpen(false)}
          onEdit={() => {}}
        />
      )}
    </div>
  );
}
