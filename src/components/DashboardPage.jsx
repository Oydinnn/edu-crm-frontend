
export default function DashboardPage() {
  return (
    <main className="flex-1 ml-64">
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sinflar kartasi */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Sinflar</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🏫</span>
              </div>
            </div>
          </div>

          {/* Fanlar kartasi */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Fanlar</p>
                <p className="text-2xl font-bold mt-1">1</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
            </div>
          </div>

          {/* Talabalar kartasi */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Talabalar</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👨‍🎓</span>
              </div>
            </div>
          </div>

          {/* O'qituvchilar kartasi */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">O'qituvchilar</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👨‍🏫</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dars Jadvali */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Dars Jadvali
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Vaqt</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Sinflar</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Fanlar</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">O'qituvchi</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Holat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    📭 Hozircha darslar mavjud emas
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