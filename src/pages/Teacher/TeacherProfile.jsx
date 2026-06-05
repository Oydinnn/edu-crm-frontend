import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/axios";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function TeacherProfile() {
  const { t } = useLanguage();
  const { user, fetchCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await api.put("/users/me", formData);
      await fetchCurrentUser();
      setIsEditing(false);
    } catch (error) {
      console.error("Profilni saqlashda xatolik:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "T";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith("http")) return photo;
    const base = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:3000";
    if (photo.startsWith("/")) return `${base}${photo}`;
    return `${base}/uploads/${photo}`;
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          {t("teacher_profile") || "Profil"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">
          {t("teacher_profile_subtitle") || "Shaxsiy ma'lumotlaringiz"}
        </p>
      </div>

      {/* Profil kartasi */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#1f39a1] to-[#3b5bdb] dark:from-blue-700 dark:to-indigo-800 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              {user?.photo ? (
                <img
                  src={getPhotoUrl(user.photo)}
                  alt={user.full_name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#1f39a1] dark:bg-blue-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-slate-900 shadow-lg">
                  {getInitials(user?.full_name)}
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                <CameraAltIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Edit tugmasi */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer"
            >
              <EditIcon className="w-4 h-4" />
              {isEditing
                ? t("save") || "Saqlash"
                : t("edit") || "Tahrirlash"}
            </button>
          </div>
        </div>

        {/* Ma'lumotlar */}
        <div className="pt-16 pb-8 px-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              {user?.full_name || "O'qituvchi"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <SchoolIcon className="w-4 h-4 text-[#1f39a1] dark:text-blue-400" />
              <span className="text-sm text-[#1f39a1] dark:text-blue-400 font-medium">
                O'qituvchi
              </span>
            </div>
          </div>

          {/* Ma'lumotlar formasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ism */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <PersonIcon className="w-4 h-4" />
                {t("name") || "To'liq ism"}
              </label>
              {isEditing ? (
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 dark:focus:ring-blue-500/30 transition-all duration-300"
                />
              ) : (
                <p className="text-gray-800 dark:text-white font-medium px-1 transition-colors duration-300">
                  {user?.full_name || "—"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <EmailIcon className="w-4 h-4" />
                {t("email") || "Email"}
              </label>
              {isEditing ? (
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 dark:focus:ring-blue-500/30 transition-all duration-300"
                />
              ) : (
                <p className="text-gray-800 dark:text-white font-medium px-1 transition-colors duration-300">
                  {user?.email || "—"}
                </p>
              )}
            </div>

            {/* Telefon */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <PhoneIcon className="w-4 h-4" />
                {t("phone") || "Telefon"}
              </label>
              {isEditing ? (
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 dark:focus:ring-blue-500/30 transition-all duration-300"
                />
              ) : (
                <p className="text-gray-800 dark:text-white font-medium px-1 transition-colors duration-300">
                  {user?.phone || "—"}
                </p>
              )}
            </div>

            {/* Manzil */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <LocationOnIcon className="w-4 h-4" />
                {t("address") || "Manzil"}
              </label>
              {isEditing ? (
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 dark:focus:ring-blue-500/30 transition-all duration-300"
                />
              ) : (
                <p className="text-gray-800 dark:text-white font-medium px-1 transition-colors duration-300">
                  {user?.address || "—"}
                </p>
              )}
            </div>
          </div>

          {/* Bekor qilish tugmasi */}
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  if (user) {
                    setFormData({
                      full_name: user.full_name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      address: user.address || "",
                    });
                  }
                }}
                className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                {t("cancel") || "Bekor qilish"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
