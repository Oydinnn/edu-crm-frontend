import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { name: "Kurslar",        path: "/settings/courses"  },
  { name: "Xonalar",        path: "/settings/rooms"    },
  { name: "Xodimlar",       path: "/settings/staff"    },
  { name: "Xabar yuborish", path: "/settings/messages" },
];

export default function Index() {
  return (
    <div>
      {/* Sarlavha */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Boshqarish</h1>

      {/* Tablar */}
      <div className="flex gap-1 flex-wrap border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-[2px] ${
                isActive
                  ? "border-[#1f39a1] text-[#1f39a1]"
                  : "border-transparent text-gray-500 hover:text-[#1f39a1]"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>

      {/* Tab kontenti shu yerga chiqadi */}
      <Outlet />
    </div>
  );
}