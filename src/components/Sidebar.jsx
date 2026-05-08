import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import Logo from "../assets/imgs/logo.png";

// MUI Icons import
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import BookIcon from "@mui/icons-material/Book";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import WarningIcon from "@mui/icons-material/Warning";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSidebar } from "../contexts/SidebarContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, setIsCollapsed, isSettingsOpen, setIsSettingsOpen } =
    useSidebar();

  const dropdownRef = useRef(null);
  const prevSettingsActive = useRef(false);

  const menuItems = [
    { id: "dashboard", name: "Asosiy", icon: HomeIcon, path: "/dashboard" },
    {
      id: "teachers",
      name: "O'qituvchilar",
      icon: SchoolIcon,
      path: "/teachers",
    },
    { id: "groups", name: "Guruhlar", icon: GroupIcon, path: "/classes" },
    { id: "students", name: "Talabalar", icon: PersonIcon, path: "/students" },
  ];

  const settingsItems = [
    {
      id: "courses",
      name: "Kurslar",
      icon: BookIcon,
      path: "/settings/courses",
    },
    {
      id: "rooms",
      name: "Xonalar",
      icon: MeetingRoomIcon,
      path: "/settings/rooms",
    },
    {
      id: "staff",
      name: "Hodimlar",
      icon: PeopleIcon,
      path: "/settings/staff",
    },
    {
      id: "messages",
      name: "Xabar Yuborish",
      icon: EmailIcon,
      path: "/settings/messages",
    },
  ];

  const isSettingsActive = location.pathname.startsWith("/settings");

  useEffect(() => {
    if (isSettingsActive && !isCollapsed && !prevSettingsActive.current) {
      setIsSettingsOpen(true);
    }
    prevSettingsActive.current = isSettingsActive;
  }, [isSettingsActive, isCollapsed, setIsSettingsOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSettingsOpen]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setIsSettingsOpen(false);
  };

  const handleBoshqarishClick = (e) => {
    e.preventDefault();

    // 1. Sidebar yopiq bo'lsa, ochamiz
    if (isCollapsed) setIsCollapsed(false);

    // 2. Dropdown holatini o'zgartiramiz (ochish/yopish)
    setIsSettingsOpen(!isSettingsOpen);

    // 3. AGAR hozirgi manzil "/settings" bilan boshlanmasa,
    // UNDA navigatsiya qilamiz. Agar allaqachon shu yerda bo'lsak, navigate ishlamaydi.
    // if (!location.pathname.startsWith("/settings")) {
    //   navigate("/settings");
    // }
  };

  return (
    <div className="flex bg-gray-50/50">
      <aside
        className={`bg-white shadow-lg fixed h-screen top-0 left-0 flex flex-col justify-between transition-all duration-300 z-50 ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div
          className={`${isCollapsed ? "p-3" : "p-6"} flex-1 overflow-y-auto no-scrollbar`}
        >
          <div
            className={`flex items-center mb-8 ${isCollapsed ? "flex-col gap-3" : "justify-between"}`}
          >
            <NavLink
              to="/dashboard"
              onClick={() => setIsSettingsOpen(false)}
              className="flex items-center gap-2 p-2"
            >
              <img src={Logo} className="w-8 h-8" alt="Logo" />
              {!isCollapsed && (
                <h1 className="text-xl font-bold text-[#4a5568]">EduCRM</h1>
              )}
            </NavLink>
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1f39a1] text-white"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <nav>
            <ul className="space-y-2">
              {/* Asosiy menyu elementlari */}
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  (item.path === "/dashboard" &&
                    (location.pathname === "/dashboard" ||
                      location.pathname === "/")) ||
                  location.pathname === item.path;

                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      onClick={() => setIsSettingsOpen(false)}
                      className={`flex items-center rounded-lg transition-all duration-500 ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"} 
                      ${isActive ? "text-white bg-[#1f39a1] shadow-md" : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"}`}
                    >
                      <Icon className="w-5 h-5" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </NavLink>
                  </li>
                );
              })}

              {/* Boshqarish tugmasi va Dropdown */}
              <li ref={dropdownRef} className="relative">
                <button
                  onClick={handleBoshqarishClick}
                  className={`w-full flex items-center rounded-lg transition-all duration-500 outline-none ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"} 
                  ${isSettingsActive ? "bg-[#1f39a1] text-white shadow-md" : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"}`}
                >
                  <SettingsIcon
                    className={`w-5 h-5 transition-transform ${isSettingsOpen && !isCollapsed ? "rotate-90" : ""}`}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 text-left">Boshqarish</span>
                  )}
                  {!isCollapsed && (
                    <span
                      className={`text-[10px] transition-transform ${isSettingsOpen ? "" : "rotate-90"}`}
                    >
                      ▶
                    </span>
                  )}
                </button>




                {/* Dropdown menyu */}
                {!isCollapsed && (
                  <div
                    className={`fixed left-64 top-0 w-64 h-full bg-white shadow-2xl z-20 py-3 border-l border-gray-100 flex flex-col 
    transition-all duration-500 ease-in-out transform
    ${isSettingsOpen ? "translate-x-0 opacity-100 visible" : "-translate-x-4 opacity-0 invisible"}`}
                  >
                    {/* Sarlavha qismi */}
                    <div className="px-4 pb-3 border-b font-semibold text-gray-800 flex justify-between items-center">
                      <span>Menu</span>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Elementlar ro'yxati */}
                    <div className="mt-4 space-y-1">
                      {settingsItems.map((item) => (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsSettingsOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all duration-300
            ${isActive ? "bg-[#1f39a1] text-white" : "text-gray-600 hover:bg-blue-50"}`
                          }
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}


                

                {/* Dropdown menyu
                {!isCollapsed && isSettingsOpen && (
                  <div className="fixed left-64 top-0 w-64 h-full bg-white shadow-2xl z-20 py-3 border-l border-gray-100 flex flex-col">
                    <div className="px-4 pb-3 border-b font-semibold text-gray-800 flex justify-between items-center">
                      <span>Menu</span>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-4 space-y-1">
                      {settingsItems.map((item) => (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsSettingsOpen(false)}
                          className={({
                            isActive,
                          }) => `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all 
                            ${isActive ? "bg-[#1f39a1] text-white" : "text-gray-600 hover:bg-blue-50"}`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )} */}
              </li>
            </ul>
          </nav>
        </div>

        {/* Obuna kartasi (Tolov qismi) */}
        {!isCollapsed && (
          <div className="p-6">
            <div className="bg-gradient-to-r from-[#f0f4ff] to-red-50 rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Obuna</h3>
                  <p className="text-gray-600 text-sm">Obunangiz tugagan</p>
                </div>
                <WarningIcon className="text-2xl text-orange-500" />
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Qolgan kunlar</span>
                  <span className="font-semibold text-[#1f39a1]">5 / 30</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#1f39a1] h-2 rounded-full"
                    style={{ width: "16%" }}
                  />
                </div>
              </div>
              <button className="w-full bg-[#1f39a1] hover:bg-[#162870] text-white font-normal py-2 px-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <span>🔄</span> Obunani yangilash{" "}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Obuna muddati tugashiga 5 kun qoldi{" "}
              </p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
