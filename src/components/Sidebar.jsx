import { NavLink } from "react-router-dom";
import Logo from "../assets/imgs/newlogotype.png";
import SettingsMenu from "./SettingsPage";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg fixed h-full flex flex-col justify-between">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 p-2 rounded-lg group cursor-pointer transition-all duration-300 hover:bg-orange-50">
          <img src={Logo} alt="logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-orange-500">
            TATU
          </h1>
        </div>

        {/* Nav */}
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 text-orange-500 bg-orange-50 rounded-lg transition"
                    : "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                }
              >
                <span className="text-xl">🏠</span>
                <span>Asosiy</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/teachers"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 text-orange-500 bg-orange-50 rounded-lg transition"
                    : "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                }
              >
                <span className="text-xl">👨‍🏫</span>
                <span>O'qituvchilar</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/classes"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 text-orange-500 bg-orange-50 rounded-lg transition"
                    : "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                }
              >
                <span className="text-xl">🏫</span>
                <span>Sinflar</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/students"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 text-orange-500 bg-orange-50 rounded-lg transition"
                    : "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                }
              >
                <span className="text-xl">👨‍🎓</span>
                <span>Talabalar</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/subjects"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 text-orange-500 bg-orange-50 rounded-lg transition"
                    : "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                }
              >
                <span className="text-xl">📚</span>
                <span>Fanlar</span>
              </NavLink>
            </li>

            {/* <li>
              <NavLink
                to='/settings'
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 text-orange-500 bg-orange-50 rounded-lg transition"
                    : "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                }
              >
                <span className="text-xl">⚙️</span>
                <span>Boshqarish</span>
              </NavLink>
            </li> */}

            <div className=" group">
              {/* Tugma */}
              <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <span className="text-xl">⚙️</span>
                <span>Boshqarish</span>
                
              </button>

              {/* Dropdown menyu - Hoverda ochiladi */}
              <div className="absolute  left-full top-0  w-52 h-full bg-white rounded-xl shadow-xl z-50 py-3 border border-gray-100 invisible opacity-0 group-hover:visible group-hover:z-50 group-hover:opacity-100 transition-all duration-200">
                <div className="flex justify-between items-center px-4 pb-2 mb-1 border-b border-gray-100">
                  <span className="font-semibold text-sm text-gray-800">
                    Menu
                  </span>
                </div>

                <div className="space-y-1">
                  <NavLink
                    to="/settings/courses"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                      }`
                    }
                  >
                    <span>📘</span>
                    <span>Kurslar</span>
                  </NavLink>

                  <NavLink
                    to="/settings/rooms"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                      }`
                    }
                  >
                    <span>🏫</span>
                    <span>Xonalar</span>
                  </NavLink>

                  <NavLink
                    to="/settings/branch"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                      }`
                    }
                  >
                    <span>🏢</span>
                    <span>Filial</span>
                  </NavLink>

                  <NavLink
                    to="/settings/staff"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                      }`
                    }
                  >
                    <span>👷</span>
                    <span>Hodimlar</span>
                  </NavLink>

                  <NavLink
                    to="/settings/reasons"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                      }`
                    }
                  >
                    <span>🏷️</span>
                    <span>Sabablar</span>
                  </NavLink>

                  <NavLink
                    to="/settings/roles"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                      }`
                    }
                  >
                    <span>🎭</span>
                    <span>Rollar</span>
                  </NavLink>

                  <NavLink
                    to="/settings/coin"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                      }`
                    }
                  >
                    <span>🪙</span>
                    <span>Coin</span>
                  </NavLink>

                  <NavLink
                    to="/settings/messages"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                      }`
                    }
                  >
                    <span>✉️</span>
                    <span>Xabar Yuborish</span>
                  </NavLink>

                  <NavLink
                    to="/settings/faq"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                      }`
                    }
                  >
                    <span>❓</span>
                    <span>FAQ</span>
                  </NavLink>

                  <NavLink
                    to="/settings/check"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                      }`
                    }
                  >
                    <span>✅</span>
                    <span>Tekshiruv</span>
                  </NavLink>
                </div>
              </div>
            </div>
          </ul>
        </nav>
      </div>

      {/* Obuna kartasi */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Obuna</h3>
              <p className="text-gray-600 text-sm">Obunangiz tugagan</p>
            </div>
            <span className="text-2xl">⚠️</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Qolgan kunlar</span>
              <span className="font-semibold text-orange-600">5 / 30</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: "16%" }}
              />
            </div>
          </div>

          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
            <span>🔄</span>
            Obunani yangilash
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            Obuna muddati tugashiga 5 kun qoldi
          </p>
        </div>
      </div>
    </aside>
  );
}
