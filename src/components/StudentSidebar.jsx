import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/imgs/logo.png";

// MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import PaymentIcon from "@mui/icons-material/Payment";
import LayersIcon from "@mui/icons-material/Layers";
import BarChartIcon from "@mui/icons-material/BarChart";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSidebar } from "../contexts/SidebarContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function StudentSidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  const { isCollapsed, setIsCollapsed, toggleSidebar } = useSidebar();

  const menuItems = [
    {
      id: "home",
      name: t("student_home") || "Bosh sahifa",
      icon: HomeIcon,
      path: "/student/dashboard",
    },
    {
      id: "payments",
      name: t("student_payments") || "To'lovlarim",
      icon: PaymentIcon,
      path: "/student/payments",
    },
    {
      id: "groups",
      name: t("student_groups") || "Guruhlarim",
      icon: LayersIcon,
      path: "/student/groups",
    },
    {
      id: "indicators",
      name: t("student_indicators") || "Ko'rsatgichlarim",
      icon: BarChartIcon,
      path: "/student/indicators",
    },
    {
      id: "rating",
      name: t("student_rating") || "Reyting",
      icon: LeaderboardIcon,
      path: "/student/rating",
    },
    {
      id: "shop",
      name: t("student_shop") || "Do`kon",
      icon: StorefrontIcon,
      path: "/student/shop",
    },
    {
      id: "extra-lessons",
      name: t("student_extra_lessons") || "Qo'shimcha darslar",
      icon: SchoolIcon,
      path: "/student/extra-lessons",
    },
    {
      id: "settings",
      name: t("student_settings") || "Sozlamalar",
      icon: SettingsIcon,
      path: "/student/settings",
    },
  ];

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
              to="/student/dashboard"
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
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                  (item.path === "/student/dashboard" && location.pathname === "/student") ||
                  (item.path !== "/student/dashboard" && location.pathname.startsWith(item.path));

                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={`w-full flex items-center rounded-lg transition-all duration-300 outline-none
                        ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"}
                        ${
                          isActive
                            ? "bg-[#1f39a1] dark:bg-blue-600 text-white font-semibold shadow-md"
                            : "text-[#4a5568] dark:text-gray-300 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 hover:text-[#1f39a1] dark:hover:text-blue-400"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
