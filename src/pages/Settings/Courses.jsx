import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

// Rang palitasi
const COLORS = [
  {
    id: "slate",
    bg: "bg-slate-100",
    border: "border-slate-200",
    dot: "bg-slate-700",
  },
  {
    id: "purple",
    bg: "bg-purple-100",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  { id: "red", bg: "bg-red-100", border: "border-red-200", dot: "bg-red-500" },
  {
    id: "orange",
    bg: "bg-orange-100",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  {
    id: "green",
    bg: "bg-green-100",
    border: "border-green-200",
    dot: "bg-green-600",
  },
  {
    id: "teal",
    bg: "bg-teal-100",
    border: "border-teal-200",
    dot: "bg-teal-500",
  },
  {
    id: "blue",
    bg: "bg-blue-100",
    border: "border-blue-200",
    dot: "bg-blue-600",
  },
  {
    id: "violet",
    bg: "bg-violet-100",
    border: "border-violet-200",
    dot: "bg-violet-400",
  },
  {
    id: "pink",
    bg: "bg-pink-100",
    border: "border-pink-200",
    dot: "bg-pink-500",
  },
];

const LESSON_DURATIONS = ["60 min", "90 min", "120 min", "150 min", "180 min"];
const COURSE_DURATIONS = ["1 oy", "2 oy", "3 oy", "4 oy", "6 oy", "12 oy"];

const branches = [
  { id: 1, name: "Filial 1" },
  { id: 2, name: "Filial 2" },
];

const initialCourses = [
  {
    id: 1,
    name: "Human Resources Manager",
    description:
      "A little about the company and the team that you'll be working with. A li...",
    lessonDuration: "90 min",
    courseDuration: "3 oy",
    price: "1 000 000 mln",
    color: "purple",
    branchIds: [1, 2],
  },
  {
    id: 2,
    name: "Human Resources Manager",
    description:
      "A little about the company and the team that you'll be working with. A li...",
    lessonDuration: "90 min",
    courseDuration: "3 oy",
    price: "1 000 000 mln",
    color: "slate",
    branchIds: [1],
  },
  {
    id: 3,
    name: "Human Resources Manager",
    description:
      "A little about the company and the team that you'll be working with. A li...",
    lessonDuration: "90 min",
    courseDuration: "3 oy",
    price: "1 000 000 mln",
    color: "orange",
    branchIds: [1, 2],
  },
  {
    id: 4,
    name: "Human Resources Manager",
    description:
      "A little about the company and the team that you'll be working with. A li...",
    lessonDuration: "90 min",
    courseDuration: "3 oy",
    price: "1 000 000 mln",
    color: "green",
    branchIds: [1],
  },
  {
    id: 5,
    name: "Human Resources Manager",
    description:
      "A little about the company and the team that you'll be working with. A li...",
    lessonDuration: "90 min",
    courseDuration: "3 oy",
    price: "1 000 000 mln",
    color: "slate",
    branchIds: [1],
  },
  {
    id: 6,
    name: "Human Resources Manager",
    description:
      "A little about the company and the team that you'll be working with. A li...",
    lessonDuration: "90 min",
    courseDuration: "3 oy",
    price: "1 000 000 mln",
    color: "pink",
    branchIds: [1, 2],
  },
];

const emptyForm = {
  name: "",
  branchIds: [],
  lessonDuration: "",
  courseDuration: "",
  price: "",
  description: "",
  color: "purple",
};

export default function Courses() {
  const [activeBranch, setActiveBranch] = useState("all");
  const [courses, setCourses] = useState(initialCourses);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Filtrlash
  const filteredCourses =
    activeBranch === "all"
      ? courses
      : activeBranch === "arxiv"
        ? []
        : courses.filter((c) => c.branchIds.includes(Number(activeBranch)));

  const openAddDrawer = () => {
    setEditCourse(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEditDrawer = (course) => {
    setEditCourse(course);
    setForm({
      name: course.name,
      branchIds: course.branchIds,
      lessonDuration: course.lessonDuration,
      courseDuration: course.courseDuration,
      price: course.price,
      description: course.description,
      color: course.color,
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditCourse(null);
    setForm(emptyForm);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editCourse) {
      setCourses((prev) =>
        prev.map((c) => (c.id === editCourse.id ? { ...c, ...form } : c)),
      );
    } else {
      setCourses((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    closeDrawer();
  };

  const handleDelete = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Checkbox - filial tanlash
  const toggleBranch = (id) => {
    setForm((prev) =>
      prev.branchIds.includes(id)
        ? { ...prev, branchIds: prev.branchIds.filter((b) => b !== id) }
        : { ...prev, branchIds: [...prev.branchIds, id] },
    );
  };

  const selectAllBranches = () => {
    setForm((prev) => ({ ...prev, branchIds: branches.map((b) => b.id) }));
  };

  const getColor = (colorId) =>
    COLORS.find((c) => c.id === colorId) || COLORS[1];

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">Kurslar</h2>
          <button
            onClick={openAddDrawer}
            className="flex items-center gap-1.5 bg-[#1f39a1] hover:bg-[#162870] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <AddIcon className="w-5 h-5" />
            Kurslar qoshish
          </button>
        </div>

        {/* Branch tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[
            // { id: "all", name: "Barchasi" },
            // ...branches,
            // { id: "arxiv", name: "Arxiv" },
          ].map((branch) => (
            <button
              key={branch.id}
              onClick={() => setActiveBranch(String(branch.id))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeBranch === String(branch.id)
                  ? "text-[#1f39a1] bg-[#f0f4ff] shadow-sm"
                  : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
              }`}
            >
              {branch.name}
            </button>
          ))}
        </div>

        {/* Courses grid */}
        {filteredCourses.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">
            Kurslar yo'q
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCourses.map((course) => {
              const color = getColor(course.color);
              return (
                <div
                  key={course.id}
                  className={`relative rounded-xl border p-4 transition-all duration-200 group ${color.bg} ${color.border}`}
                >
                  {/* Delete / Edit */}
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-1.5 rounded-lg bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
                    >
                      <DeleteIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditDrawer(course)}
                      className="p-1.5 rounded-lg bg-white/80 hover:bg-[#f0f4ff] text-gray-400 hover:text-[#1f39a1] transition-all duration-200"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <p className="text-sm font-semibold text-gray-800 mb-1 pr-14">
                    {course.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs px-2 py-0.5 bg-white/70 border border-gray-200 rounded-md text-gray-600">
                      {course.lessonDuration}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-white/70 border border-gray-200 rounded-md text-gray-600">
                      {course.courseDuration}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-white/70 border border-gray-200 rounded-md text-gray-600">
                      {course.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={closeDrawer} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {editCourse ? "Kursni tahrirlash" : "Kurs qoshish"}
              </h3>
            </div>
            <button
              onClick={closeDrawer}
              className="text-gray-400 hover:text-[#1f39a1] transition-all duration-200 mt-1"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Nomi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nomi
            </label>
            <input
              type="text"
              placeholder="HR Manager..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 focus:border-[#1f39a1] transition-all duration-200"
            />
          </div>

          {/* Filiallar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Kurs mavjud boledigon filiallar
              </label>
              <button
                onClick={selectAllBranches}
                className="text-xs text-[#1f39a1] hover:underline font-medium"
              >
                Hammasini tanlash
              </button>
            </div>
            <div className="space-y-2">
              {branches.map((branch) => (
                <label
                  key={branch.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.branchIds.includes(branch.id)}
                    onChange={() => toggleBranch(branch.id)}
                    className="w-4 h-4 rounded accent-[#1f39a1] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{branch.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dars davomiyligi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Dars davomiyligi
            </label>
            <select
              value={form.lessonDuration}
              onChange={(e) =>
                setForm({ ...form, lessonDuration: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 focus:border-[#1f39a1] transition-all duration-200 bg-white"
            >
              <option value="">Tanlang</option>
              {LESSON_DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Kurs davomiyligi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Kurs davomiyligi (oylarda)
            </label>
            <select
              value={form.courseDuration}
              onChange={(e) =>
                setForm({ ...form, courseDuration: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 focus:border-[#1f39a1] transition-all duration-200 bg-white"
            >
              <option value="">Tanlang</option>
              {COURSE_DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Narx */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Narx
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MonetizationOnIcon className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Narxini kiriting"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 focus:border-[#1f39a1] transition-all duration-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="A little about the company and the team that you'll be working with."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 focus:border-[#1f39a1] transition-all duration-200 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              This is a hint text to help user.
            </p>
          </div>

          {/* Rang */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-0.5">
              Rangi
            </label>
            <p className="text-xs text-gray-400 mb-3">
              The color you choose will be displayed to users and in the list of
              roles.
            </p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setForm({ ...form, color: color.id })}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${color.dot} ${
                    form.color === color.id
                      ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                      : "hover:scale-110"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={closeDrawer}
            className="px-5 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim()}
            className="px-6 py-2 text-sm font-medium text-white bg-[#1f39a1] hover:bg-[#162870] rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
