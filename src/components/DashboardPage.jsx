import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";

import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";

export default function DashboardPage() {
  const stats = [
    {
      label: "Guruhlar",
      value: 0,
      icon: GroupIcon,
      bg: "bg-[#f0f4ff]",
      color: "text-[#1f39a1]",
    },
    {
      label: "Kurslar",
      value: 1,
      icon: BookIcon,
      bg: "bg-[#f0f4ff]",
      color: "text-[#1f39a1]",
    },
    {
      label: "Talabalar",
      value: 0,
      icon: PersonIcon,
      bg: "bg-[#f0f4ff]",
      color: "text-[#1f39a1]",
    },
    {
      label: "O'qituvchilar",
      value: 0,
      icon: SchoolIcon,
      bg: "bg-[#f0f4ff]",
      color: "text-[#1f39a1]",
    },
  ];

  return (
    <main className="flex-1">
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md hover:border-[#1f39a1]/20 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#4a5568] text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold mt-2 text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                  >
                    <Icon className={`${stat.color} w-6 h-6`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dars Jadvali */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Dars Jadvali
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f0f4ff] border-b border-gray-200">
                <tr>
                  {["Vaqt", "Sinflar", "Fanlar", "O'qituvchi", "Holat"].map(
                    (col) => (
                      <th
                        key={col}
                        className="text-left py-3 px-4 text-sm font-semibold text-[#1f39a1]"
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-[#4a5568] text-sm"
                  >
                    Hozircha darslar mavjud emas
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
