// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSidebar } from "../contexts/SidebarContext";
// import { useAuth } from "../contexts/AuthContext";
// import { useTheme } from "../contexts/ThemeContext";
// import { useLanguage } from "../contexts/LanguageContext";
// import LogoutIcon from "@mui/icons-material/Logout";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const { theme, toggleTheme, isDark } = useTheme();
//   const { lang, setLang, t } = useLanguage();
//   const navigate = useNavigate();
//   const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//   const langDropdownRef = useRef(null);
//   const profileDropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
//         setIsLangDropdownOpen(false);
//       }
//       if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
//         setIsProfileDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const getInitials = (name) => {
//     if (!name) return "C";
//     const parts = name.trim().split(/\s+/);
//     if (parts.length >= 2) {
//       return (parts[0][0] + parts[1][0]).toUpperCase();
//     }
//     return name[0].toUpperCase();
//   };

//   const getPhotoUrl = (photo) => {
//     if (!photo) return null;
//     if (photo.startsWith("http")) return photo;
//     const base = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:3000";
//     if (photo.startsWith("/")) return `${base}${photo}`;
//     return `${base}/uploads/${photo}`;
//   };

//   const displayName = user?.full_name || "Creator";
//   const displayRole = user?.role
//     ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
//     : "Admin";

//   const languages = [
//     { code: "uz", label: "UZB", flag: "🇺🇿" },
//     { code: "en", label: "ENG", flag: "🇬🇧" },
//     { code: "ru", label: "RUS", flag: "🇷🇺" }
//   ];

//   const currentLanguage = languages.find((l) => l.code === lang) || languages[0];

//   return (
//     <header className="w-full px-6 py-4 flex justify-between items-center sticky top-0 z-30 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800/60 transition-all duration-300">
//       <div>
//         <h2 className="text-xl font-semibold text-[#4a5568] dark:text-white transition-colors duration-300">
//           {t("greeting", { name: displayName })}
//         </h2>
//         <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
//           {t("welcome")}
//         </p>
//       </div>

//       <div className="flex items-center gap-4">
//         {/* Dark Mode Switcher */}
//         <button
//           onClick={toggleTheme}
//           className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 shadow-sm hover:scale-105 cursor-pointer"
//           title={isDark ? "Light Mode" : "Dark Mode"}
//         >
//           {isDark ? (
//             <span className="text-xl leading-none">☀️</span>
//           ) : (
//             <span className="text-xl leading-none">🌙</span>
//           )}
//         </button>

//         {/* Language Selector Dropdown */}
//         <div className="relative" ref={langDropdownRef}>
//           <button
//             onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
//             className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl transition-all duration-300 shadow-sm hover:scale-[1.02] cursor-pointer"
//           >
//             <span>{currentLanguage.flag}</span>
//             <span className="hidden sm:inline">{currentLanguage.label}</span>
//             <span className={`text-[10px] text-gray-400 transition-transform duration-300 ${isLangDropdownOpen ? "rotate-180" : ""}`}>
//               ▼
//             </span>
//           </button>

//           {isLangDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1 animate-fadeIn">
//               {languages.map((l) => (
//                 <button
//                   key={l.code}
//                   onClick={() => {
//                     setLang(l.code);
//                     setIsLangDropdownOpen(false);
//                   }}
//                   className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left font-medium transition-colors duration-200 cursor-pointer ${
//                     lang === l.code
//                       ? "bg-blue-50 dark:bg-slate-700 text-[#1f39a1] dark:text-blue-400"
//                       : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50"
//                   }`}
//                 >
//                   <span className="text-base">{l.flag}</span>
//                   <span>{l.label}</span>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Notifications */}
//         <button className="relative p-2 text-[#4a5568] dark:text-gray-300 hover:text-[#1f39a1] dark:hover:text-blue-400 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 rounded-xl transition-all duration-300 shadow-sm">
//           <span className="text-xl leading-none">🔔</span>
//           <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//         </button>

//         <div className="relative" ref={profileDropdownRef}>
//           <button
//             onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
//             className="flex items-center gap-3 border-l border-gray-200 dark:border-slate-700 pl-4 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity"
//           >
//             {user?.photo ? (
//               <img
//                 src={getPhotoUrl(user.photo)}
//                 alt={displayName}
//                 className="w-10 h-10 rounded-full object-cover border border-[#1f39a1]/20 shadow-sm"
//                 onError={(e) => {
//                   e.target.style.display = 'none';
//                   const sibling = e.target.nextSibling;
//                   if (sibling) sibling.style.display = 'flex';
//                 }}
//               />
//             ) : null}
//             <div
//               className="w-10 h-10 bg-[#1f39a1] rounded-full flex items-center justify-center text-white font-bold shadow-sm"
//               style={{ display: user?.photo ? 'none' : 'flex' }}
//             >
//               {getInitials(displayName)}
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-sm font-bold text-[#1f39a1] dark:text-white transition-colors duration-300">
//                 {displayName}
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold transition-colors duration-300 uppercase">
//                 {displayRole}
//               </p>
//             </div>
//           </button>

//           {/* Profile Dropdown Menu */}
//           {isProfileDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl z-50 p-3 animate-fadeIn">
//               {/* User Info (Header) */}
//               <div className="flex items-center gap-3 p-2">
//                 {user?.photo ? (
//                   <img
//                     src={getPhotoUrl(user.photo)}
//                     alt={displayName}
//                     className="w-10 h-10 rounded-full object-cover border border-[#1f39a1]/20 shadow-sm"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                       const sibling = e.target.nextSibling;
//                       if (sibling) sibling.style.display = 'flex';
//                     }}
//                   />
//                 ) : null}
//                 <div
//                   className="w-10 h-10 bg-[#1f39a1] rounded-full flex items-center justify-center text-white font-bold shadow-sm"
//                   style={{ display: user?.photo ? 'none' : 'flex' }}
//                 >
//                   {getInitials(displayName)}
//                 </div>
//                 <div className="text-left overflow-hidden">
//                   <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
//                     {displayName}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase truncate">
//                     {displayRole}
//                   </p>
//                 </div>
//               </div>

//               {/* Divider */}
//               <div className="my-2 border-t border-gray-100 dark:border-slate-700" />

//               {/* Logout Button */}
//               <button
//                 onClick={() => {
//                   logout();
//                   setIsProfileDropdownOpen(false);
//                   navigate("/login");
//                 }}
//                 className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors duration-200 cursor-pointer text-left"
//               >
//                 <LogoutIcon className="w-5 h-5 text-red-500" />
//                 <span>{t("logout") || "Chiqish"}</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }






import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target))
        setIsLangDropdownOpen(false);
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target))
        setIsProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "C";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith("http")) return photo;
    const base = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:3000";
    if (photo.startsWith("/")) return `${base}${photo}`;
    return `${base}/uploads/${photo}`;
  };

  const displayName = user?.full_name || "Creator";
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : "Admin";

  const languages = [
    { code: "uz", label: "UZB"},
    { code: "en", label: "ENG" },
    { code: "ru", label: "RUS" },
  ];

  const currentLanguage = languages.find((l) => l.code === lang) || languages[0];

  const iconClass = "text-[#4a5568] dark:text-gray-300";
  const btnBase =
    "p-2 rounded-xl transition-all duration-300 cursor-pointer hover:bg-[#f0f4ff] dark:hover:bg-slate-800 hover:text-[#1f39a1] dark:hover:text-blue-400";

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center sticky top-0 z-30 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800/60 transition-all duration-300">
        <div>
          <h2 className="text-xl font-semibold text-[#4a5568] dark:text-white transition-colors duration-300">
            {t("greeting", { name: displayName })}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
            {t("welcome")}
          </p>
        </div>

      <div className="flex items-center gap-2">

        {/* Dark Mode */}
        <button
          onClick={toggleTheme}
          className={btnBase}
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? (
            <LightModeIcon className={iconClass} style={{ fontSize: 22 }} />
          ) : (
            <DarkModeIcon style={{ fontSize: 22 }} />
          )}
        </button>

        {/* Language */}
        <div className="relative" ref={langDropdownRef}>
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="flex items-center px-3 py-2 text-sm font-semibold text-[#4a5568] dark:text-gray-300 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 hover:text-[#1f39a1] rounded-xl transition-all duration-300 cursor-pointer"
          >
            <span>{currentLanguage.label}</span>
            <KeyboardArrowDownIcon
              style={{ fontSize: 18 }}
              className={`text-gray-400 transition-transform duration-300 ${isLangDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isLangDropdownOpen && (
            <div className="absolute top-full left-0 w-16 bg-white dark:bg-slate-800 rounded-xl z-50 py-1 animate-fadeIn">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setIsLangDropdownOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-1 text-sm text-left font-medium transition-colors duration-200 cursor-pointer ${
                    lang === l.code
                      ? "bg-[#f0f4ff] dark:bg-slate-700 text-[#1f39a1] dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-[#f0f4ff] dark:hover:bg-slate-700/50 hover:text-[#1f39a1]"
                  }`}
                >
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className={`relative ${btnBase} text-[#4a5568] dark:text-gray-300`}>
          <NotificationsIcon style={{ fontSize: 22 }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-50 dark:border-slate-900"></span>
        </button>

        {/* Profile */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-3 border-l border-gray-200 dark:border-slate-700 pl-4 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity ml-2"
          >
            {user?.photo ? (
              <img
                src={getPhotoUrl(user.photo)}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border border-[#1f39a1]/20"
                onError={(e) => {
                  e.target.style.display = "none";
                  const s = e.target.nextSibling;
                  if (s) s.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="w-9 h-9 bg-[#1f39a1] rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ display: user?.photo ? "none" : "flex" }}
            >
              {getInitials(displayName)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-[#1f39a1] dark:text-white transition-colors duration-300">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase transition-colors duration-300">
                {displayRole}
              </p>
            </div>
            <KeyboardArrowDownIcon
              style={{ fontSize: 18 }}
              className={`text-gray-400 transition-transform duration-300 hidden md:block ${isProfileDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl z-50 p-3 animate-fadeIn">
              <div className="flex items-center gap-3 p-2">
                {user?.photo ? (
                  <img
                    src={getPhotoUrl(user.photo)}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover border border-[#1f39a1]/20"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const s = e.target.nextSibling;
                      if (s) s.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-10 h-10 bg-[#1f39a1] rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ display: user?.photo ? "none" : "flex" }}
                >
                  {getInitials(displayName)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase truncate">{displayRole}</p>
                </div>
              </div>

              <div className="my-2 border-t border-gray-100 dark:border-slate-700" />

              <button
                onClick={() => { logout(); setIsProfileDropdownOpen(false); navigate("/login"); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <LogoutIcon style={{ fontSize: 20 }} className="text-red-500" />
                <span>{t("logout") || "Chiqish"}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}