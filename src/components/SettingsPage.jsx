// src/components/SettingsPage.jsx
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

const settingsMenuItems = [
  { icon: "📘", label: "Kurslar", path: "/settings/courses" },
  { icon: "🏫", label: "Xonalar", path: "/settings/rooms" },
  { icon: "🏢", label: "Filial", path: "/settings/branch" },
  { icon: "👷", label: "Hodimlar", path: "/settings/staff" },
  { icon: "🏷️", label: "Sabablar", path: "/settings/reasons" },
  { icon: "🎭", label: "Rollar", path: "/settings/roles" },
  { icon: "🪙", label: "Coin", path: "/settings/coin" },
  { icon: "✉️", label: "Xabar Yuborish", path: "/settings/messages" },
  { icon: "❓", label: "FAQ", path: "/settings/faq" },
  { icon: "✅", label: "Tekshiruv", path: "/settings/check" },
];

export default function SettingsMenu() {  // Nomi o'zgartirildi
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <li ref={ref} className="relative list-none">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
          open
            ? "text-orange-500 bg-orange-50"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <span className="text-xl">⚙️</span>
        <span>Boshqarish</span>
        <span
          className={`ml-auto text-xs transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-full top-0 ml-2 w-52 bg-white rounded-xl shadow-xl z-50 py-3 border border-gray-100">
          <div className="flex justify-between items-center px-4 pb-2 mb-1 border-b border-gray-100">
            <span className="font-semibold text-sm text-gray-800">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md w-6 h-6 text-xs flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>

          {settingsMenuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "text-orange-500 bg-orange-50"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </li>
  );
}