import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import api from "../services/axios";

export default function TeachersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teachers, setTeachers] = useState([]);

  const itemsPerPage = 5;

  // const teachers = Array.from({ length: 38 }, () => ({
  //   name: "Qwerty qwert",
  //   group: "123 123",
  //   phone: "+998 33 408 28 08",
  //   date: "24 Jan 2022",
  //   date_register: "24 Jan 2022",
  // }));

  const filteredTeachers = teachers.filter((t) =>
    `${t.first_name || ""} ${t.last_name || ""} ${t.phone || ""} ${t.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const currentData = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  async function getTeacher() {
    try {
      const res = await api.get("/teachers");

      if (res?.data?.success) {
        setTeachers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log(teachers);

  useEffect(() => {
    // setCurrentPage(1);
    getTeacher();
  }, []);

  return (
    <div className=" p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">O'qituvchilar</h1>
          <p className="text-gray-500 text-sm">
            O‘qituvchilar ro‘yxati va ma’lumotlari
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1f39a1] hover:bg-[#162870] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          <AddIcon />
          O‘qituvchi qo‘shish
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex justify-between">
        <div className="relative w-80">
          <SearchIcon className="absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Qidirish..."
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9ba4c9]"
          />
        </div>
      </div>

      {/* Table */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-[#f8fafc] text-gray-500 text-sm">
        <tr>
          <th className="p-3 text-left">Nomi</th>
          <th className="p-3 text-left">Guruh</th>
          <th className="p-3 text-left">Telefon raqam</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Manzil</th>
          <th className="p-3"></th>
        </tr>
      </thead>
      <tbody>
        {currentData.map((t, i) => (
          <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition">
            <td className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-[#1f39a1] flex items-center justify-center text-white font-semibold">
                  {t.photo ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}${t.photo}`}
                      // src={`http://localhost:3000${t.photo}`}
                      alt={t.first_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="uppercase">{t.first_name?.charAt(0) || "?"}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {t.first_name} {t.last_name}
                  </h3>
                  <p className="text-xs text-gray-400">Teacher</p>
                </div>
              </div>
            </td>
            <td className="p-4">
              <span className="px-3 py-1 rounded-full text-xs bg-[#eef2ff] text-[#1f39a1]">
                {t.groups?.[0]?.name || "No group"}
              </span>
            </td>
            <td className="p-4 text-gray-600">{t.phone}</td>
            <td className="p-4 text-gray-600">{t.email}</td>
            <td className="p-4 text-gray-600">{t.address}</td>
            <td className="p-4">
              <div className="flex items-center gap-3 text-gray-500">
                <VisibilityIcon className="cursor-pointer hover:text-blue-500" />
                <EditIcon className="cursor-pointer hover:text-green-500" />
                <DeleteIcon className="cursor-pointer hover:text-red-500" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
        {/* Previous */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Previous
        </button>

        {/* Pagination Numbers */}
        <div className="flex items-center gap-2">
          {(() => {
            const pages = [];

            for (let i = 1; i <= totalPages; i++) {
              if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
              ) {
                pages.push(i);
              } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push("...");
              }
            }

            return [...new Set(pages)].map((item, index) =>
              item === "..." ? (
                <span
                  key={index}
                  className="w-9 h-9 flex items-center justify-center text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => setCurrentPage(item)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    currentPage === item
                      ? "bg-[#1f39a1] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              ),
            );
          })()}
        </div>

        {/* Next */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>

      {/* Drawer (Right panel) */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transform transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">O‘qituvchi qo‘shish</h2>
          <CloseIcon
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          <input
            type="text"
            placeholder="Telefon raqam"
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-[#9ba4c9] p-2 rounded-lg"
          />

          <input
            type="text"
            placeholder="F.I.O"
            className="w-full border border-[#9ba4c9] p-2 rounded-lg"
          />

          <input
            type="date"
            className="w-full border border-[#9ba4c9] p-2 rounded-lg"
          />

          <select className="w-full border border-[#9ba4c9] p-2 rounded-lg">
            <option>Guruh tanlang</option>
          </select>

          <div>
            <label className="text-sm text-gray-600">Jinsi</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="male" />
                Erkak
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="female" />
                Ayol
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Surati</label>

            <div className="mt-2 border-2 border-[#9ba4c9] border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
              <input type="file" className="hidden" id="fileUpload" />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <p className="text-gray-500 text-sm">
                  Click to upload yoki drag & drop
                </p>
                <p className="text-xs text-gray-400">
                  PNG yoki JPG (max 800x800)
                </p>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-[#9ba4c9] rounded-lg"
            >
              Bekor qilish
            </button>
            <button className="px-4 py-2 bg-[#1f39a1] text-white rounded-lg">
              Saqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
