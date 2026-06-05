import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/imgs/logo.png";

// MUI Icons
import LayersIcon from "@mui/icons-material/Layers";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSidebar } from "../contexts/SidebarContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function TeacherSidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  const { isCollapsed, setIsCollapsed, toggleSidebar } = useSidebar();
  const [isGroupsOpen, setIsGroupsOpen] = useState(true);

  const isGroupsActive =
    location.pathname.startsWith("/teacher/groups") ||
    location.pathname.startsWith("/teacher/gathering-groups");

  const isProfileActive = location.pathname === "/teacher/profile";

  const handleGroupsClick = (e) => {
    e.preventDefault();
    if (isCollapsed) {
      setIsCollapsed(false);
      setIsGroupsOpen(true);
    } else {
      setIsGroupsOpen(!isGroupsOpen);
    }
  };

  return (
    <div className="flex bg-gray-50/50 dark:bg-slate-900 transition-colors duration-300">
      <aside
        className={`bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-850 shadow-lg fixed h-screen top-0 left-0 flex flex-col justify-between transition-all duration-300 z-50 ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div
          className={`${isCollapsed ? "p-3" : "p-6"} flex-1 overflow-y-auto no-scrollbar`}
        >
          {/* Logo and Collapse Button */}
          <div
            className={`flex items-center mb-8 ${isCollapsed ? "flex-col gap-3" : "justify-between"}`}
          >
            <NavLink
              to="/teacher/groups"
              className="flex items-center gap-2 p-2 hover:scale-110 transition-transform duration-300"
            >
              <img
                src={Logo}
                className="w-8 h-8 dark:filter dark:invert dark:brightness-125"
                alt="Logo"
              />
              {!isCollapsed && (
                <h1 className="text-xl font-bold text-[#4a5568] dark:text-white transition-colors duration-300">
                  EduCRM
                </h1>
              )}
            </NavLink>
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1f39a1] dark:bg-blue-600 text-white cursor-pointer"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Menyu */}
          <nav>
            <ul className="space-y-2">
              {/* ═══ Guruhlar — Accordion ═══ */}
              <li>
                <button
                  onClick={handleGroupsClick}
                  className={`w-full flex items-center rounded-lg transition-all duration-300 outline-none cursor-pointer
                    ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"}
                    ${
                      isGroupsActive
                        ? "text-[#1f39a1] dark:text-blue-400 font-medium"
                        : "text-[#4a5568] dark:text-gray-300 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 hover:text-[#1f39a1] dark:hover:text-blue-400"
                    }`}
                >
                  <LayersIcon className="w-5 h-5" />
                  {!isCollapsed && (
                    <span className="flex-1 text-left">
                      {t("teacher_groups_menu") || "Guruhlar"}
                    </span>
                  )}
                  {!isCollapsed && (
                    <span>
                      {isGroupsOpen ? (
                        <KeyboardArrowUpIcon className="w-5 h-5" />
                      ) : (
                        <KeyboardArrowDownIcon className="w-5 h-5" />
                      )}
                    </span>
                  )}
                </button>

                {/* Submenus */}
                {isGroupsOpen && !isCollapsed && (
                  <ul className="mt-1 pl-6 pr-2 space-y-1 transition-all duration-300">
                    <li>
                      <NavLink
                        to="/teacher/groups"
                        end
                        className={({ isActive }) =>
                          `block w-full text-left py-2 px-4 rounded-lg text-sm transition-all duration-300
                          ${
                            isActive || location.pathname.includes("/teacher/groups/")
                              ? "bg-[#1f39a1] dark:bg-blue-600 text-white font-medium shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:bg-[#f0f4ff]/50 dark:hover:bg-slate-800/50 hover:text-[#1f39a1] dark:hover:text-blue-400"
                          }`
                        }
                      >
                        {t("teacher_groups_all") || "Guruhlar"}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/teacher/gathering-groups"
                        className={({ isActive }) =>
                          `block w-full text-left py-2 px-4 rounded-lg text-sm transition-all duration-300
                          ${
                            isActive
                              ? "bg-[#1f39a1] dark:bg-blue-600 text-white font-medium shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:bg-[#f0f4ff]/50 dark:hover:bg-slate-800/50 hover:text-[#1f39a1] dark:hover:text-blue-400"
                          }`
                        }
                      >
                        {t("teacher_gathering_groups") || "Yig'ilayotgan guruhlar"}
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* ═══ Profil ═══ */}
              <li>
                <NavLink
                  to="/teacher/profile"
                  className={`w-full flex items-center rounded-lg transition-all duration-300 outline-none
                    ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"}
                    ${
                      isProfileActive
                        ? "bg-[#1f39a1] dark:bg-blue-600 text-white font-semibold shadow-md"
                        : "text-[#4a5568] dark:text-gray-300 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 hover:text-[#1f39a1] dark:hover:text-blue-400"
                    }`}
                >
                  <PersonOutlinedIcon className="w-5 h-5" />
                  {!isCollapsed && <span>{t("teacher_profile") || "Profil"}</span>}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
