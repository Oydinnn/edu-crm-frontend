import { useEffect, useState, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArchiveIcon from "@mui/icons-material/Archive";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";

import api from "../../services/axios";
import { lazy, Suspense } from "react";

const StudentAddModal  = lazy(() => import("./StudentAddModal"));
const StudentShowModal = lazy(() => import("./StudentShowModal"));
const StudentEditModal = lazy(() => import("./StudentEditModal"));


// ── Kolonlar ──────────────────────────────────────────────────────────────────
const COLS = [
  { label: "Status",         cls: "flex-1" },
  { label: "Talaba",         cls: "flex-1" },
  { label: "Guruh",          cls: "flex-1" },
  { label: "Telefon",        cls: "flex-1" },
  { label: "Tug'ilgan sana", cls: "flex-1" },
  { label: "Yaratilgan",     cls: "flex-1" },
  { label: "Amallar",        cls: "flex-1" },
];

// ── Yordamchi ─────────────────────────────────────────────────────────────────
function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ru-RU");
}

// function getPhotoUrl(photo) {
//   if (!photo) return null;
//   if (photo.startsWith("http")) return photo;
//   return `${import.meta.env.VITE_API_URL?.replace("/api/v1", "")}${photo}`;
// }



function getPhotoUrl(photo) {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  return `${import.meta.env.VITE_API_URL?.replace("/api/v1", "")}/uploads/${photo}`;
}

const AVATAR_COLORS = [
  { bg: "#ede9fe", color: "#5b21b6" },
  { bg: "#ecfdf5", color: "#065f46" },
  { bg: "#fef3c7", color: "#92400e" },
  { bg: "#fee2e2", color: "#991b1b" },
  { bg: "#e0f2fe", color: "#0c4a6e" },
];

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, bg, color }) {
  const Icon = icon;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-sm p-6 hover:shadow-md hover:border-[#1f39a1]/20 dark:hover:border-blue-500/30 transition-all duration-300 group flex-1 min-w-[130px]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-[#4a5568] dark:text-gray-400 font-medium">{label}</p>
          <div className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{value}</div>
        </div>
        <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
          {Icon ? <Icon className={`${color} w-6 h-6`} /> : null}
        </div>
      </div>
    </div>
  );
}

// ── Asosiy komponent ──────────────────────────────────────────────────────────
export default function StudentsPage() {
  const [students, setStudents]       = useState([]);
  const [aktifTab, setAktifTab]       = useState("talabalar");
  const [search, setSearch]           = useState("");
  const [ochiqMenu, setOchiqMenu]     = useState(null);
  const [addOpen, setAddOpen]         = useState(false);
  const [showStudent, setShowStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [page, setPage] = useState(1);
  const ROWS_PER_PAGE = 10;
 

  // ── Yuklash ──
  // const fetchStudents = useCallback(async (status = "active") => {
  //   try {
  //     const res = await api.get(`/students?status=${status}`);
  //     setStudents(res.data.data || []);
  //     // fetchStudents da qo'shing:
  //   } catch (err) {
  //     console.error("Xato:", err);
  //   }
  // }, []);

  // // useEffect(() => { fetchStudents("active"); }, []);

  // useEffect(() => {
  //   if (aktifTab === "talabalar") fetchStudents("active");
  //   else fetchStudents("inactive");
  // }, [aktifTab]);


  // 1. Avval fetchStudents (useCallback)
const fetchStudents = useCallback(async (status = "active") => {
  try {
    const res = await api.get(`/students?status=${status}`);
    setStudents(res.data.data || []);
  } catch (err) {
    console.error("Xato:", err);
  }
}, []);

// 2. Keyin groups state
const [groups, setGroups] = useState([]);

// Faqat bitta useEffect:
useEffect(() => {
  api.get("/groups/all")
    .then((res) => setGroups(res.data?.data || []))
    .catch(console.error);
}, []);

useEffect(() => {
  if (aktifTab === "talabalar") fetchStudents("active");
  else fetchStudents("inactive");
}, [aktifTab]);

  // ── 3 nuqta menyuni tashqariga bosganda yopish ──
  useEffect(() => {
    const handler = () => setOchiqMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ── Toggle status ──
  const toggleStatus = async (id, joriyStatus) => {
    const yangiStatus = joriyStatus === "active" ? "inactive" : "active";
    setStudents((prev) => prev.filter((s) => s.id !== id));
    try {
      await api.patch(`/students/${id}`, { status: yangiStatus });
    } catch {
      fetchStudents(aktifTab === "talabalar" ? "active" : "inactive");
      alert("Status o'zgartirib bo'lmadi!");
    }
  };

  // ── O'chirish ──
  const handleDelete = async (id) => {
    if (!window.confirm("Talabani o'chirishni tasdiqlaysizmi?")) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("O'chirishda xatolik yuz berdi.");
    }
  };

  // ── Qo'shish ──
  const handleSave = async (form) => {
  const fd = new FormData();
  Object.entries(form).forEach(([k, v]) => {
    if (k === "groups") return;
    if (v !== null && v !== undefined && v !== "") fd.append(k, v);
  });
  if (form.groups?.length > 0) {
    form.groups
      .filter((id) => id && !isNaN(id))
      .forEach((id) => fd.append("groups", id));
  }
  await api.post("/students", fd);
  await fetchStudents(aktifTab === "talabalar" ? "active" : "inactive");
  setAddOpen(false);
};


  // ── Tahrirlash ──
  const handleEditSave = async (id, form) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") fd.append(k, v);
    });
    await api.patch(`/students/${id}`, fd);
    await fetchStudents(aktifTab === "talabalar" ? "active" : "inactive");
    setEditStudent(null);
  };

  // ── Search filter ──
  const filtered = students.filter((s) =>
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.phone?.includes(search)

  );

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50/50  dark:bg-slate-950">
      <div className="p-4 sm:p-6">

        {/* ── Sarlavha + tugma ── */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#4a5568]  dark:text-blue-400">Talabalar</h1>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-[#1f39a1] hover:bg-[#162870] text-white font-normal py-2 px-3 sm:px-4
              rounded-lg transition-all duration-300 shadow-md hover:shadow-lg
              flex items-center gap-2 text-sm"
          >
            <AddIcon style={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Talaba qo'shish</span>
            <span className="sm:hidden">Qo'shish</span>
          </button>
        </div>

        {/* ── Tablar ── */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {[
            { key: "talabalar", label: "Talabalar", icon: null },
            { key: "arxiv", label: "Arxiv", icon: <ArchiveIcon style={{ fontSize: 16 }} /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setAktifTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium
                border-b-2 transition-all duration-300 -mb-px
                ${aktifTab === key
                  ? "border-[#1f39a1] text-[#1f39a1]"
                  : "border-transparent text-[#4a5568] hover:text-[#1f39a1] hover:bg-[#f0f4ff] rounded-t-lg"
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* ── Stat kartochkalar ── */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
          <StatCard
              icon={PersonIcon}
              bg="bg-[#f0f4ff] dark:bg-slate-700/50"
              color="text-[#1f39a1] dark:text-blue-400"
            label="Jami talabalar"
            value={filtered.length}
          />
          <StatCard
              icon={GroupIcon}
              bg="bg-[#f0f4ff] dark:bg-slate-700/50"
              color="text-[#1f39a1] dark:text-blue-400"
            label="Active"
            value={students.filter(s => s.status === "active").length}
          />
          <StatCard
              icon={SchoolIcon}
              bg="bg-[#f0f4ff] dark:bg-slate-700/50"
              color="text-[#1f39a1] dark:text-blue-400"
            label="Guruhlar"
            value={[...new Set(students.flatMap(s => s.groups?.map(g => g.id) || []))].length}
          />
        </div>

        {/* ── Search ── */}
        <div className="mb-4">
          <div className="relative w-72">
            <SearchIcon className="absolute top-2.5 left-3 text-gray-400" style={{ fontSize: 18 }} />
            <input
              type="text"
              value={search}
              onChange={(e) => {setSearch(e.target.value);setPage(1)}}
              placeholder="Ism yoki telefon qidirish..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-[#9ba4c9] text-sm"
            />
          </div>
        </div>

        {/* ── Jadval ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-slate-800">
          <div className="overflow-x-auto">

            {/* Header */}
            <div className="flex items-center px-4 py-3.5 bg-[#f0f4ff]/60 border-b border-gray-100 min-w-[950px]">
              {COLS.map((col, i) => (
                <div key={i} className={`${col.cls} px-1`}>
                  <span className="text-xs font-semibold text-[#1f39a1]/60 uppercase tracking-wide">
                    {col.icon ? (
                      <span
                        className="flex justify-center items-center gap-1 cursor-pointer"
                        onClick={() => fetchStudents(aktifTab === "talabalar" ? "active" : "inactive")}
                      >
                        {col.label} <RefreshIcon style={{ fontSize: 15 }} />
                      </span>
                    ) : col.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                Talabalar topilmadi
              </div>
            ) : paginated.map((student) => {
              const av = AVATAR_COLORS[student.id % AVATAR_COLORS.length];
              const isActive = student.status === "active";
              return (
                <div
                  key={student.id}
                  className="flex items-center px-4 py-3.5 border-b border-gray-50
                    hover:bg-[#f0f4ff]/30 transition-all duration-300 min-w-[950px]"
                >
                  {/* 1. Status Toggle */}
                  <div className="flex-1 px-1 flex items-center gap-1">
                    <button
                      onClick={() => toggleStatus(student.id, student.status)}
                      className="transition-transform active:scale-95"
                    >
                      {isActive ? (
                        <ToggleOnIcon style={{ fontSize: 34, color: "#1f39a1" }} />
                      ) : (
                        <ToggleOffIcon style={{ fontSize: 34, color: "#d1d5db" }} />
                      )}
                    </button>
                    <span className={`text-[10px] font-bold ${isActive ? "text-green-500" : "text-gray-400"}`}>
                      {isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  {/* 2. Talaba */}
                  <div className="flex-1 px-1 flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center
                        text-xs font-semibold shrink-0"
                      style={{ background: av.bg, color: av.color }}
                    >
                      {student.photo ? (
                        <img
                          src={getPhotoUrl(student.photo)}
                          alt={student.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="uppercase">{getInitials(student.full_name)}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#4a5568] leading-tight">
                        {student.full_name}
                      </p>
                      {student.email && (
                        <p className="text-[11px] text-gray-400 leading-tight truncate max-w-[140px]">
                          {student.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 3. Guruhlar */}
                  <div className="flex-1 px-1 flex flex-wrap gap-1 items-center">
                    {student.groups?.slice(0, 2).map((g) => (
                      <span
                        key={g.id}
                        className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#6366f118] text-[#6366f1]"
                      >
                        {g.name}
                      </span>
                    ))}
                    {student.groups?.length > 2 && (
                      <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        +{student.groups.length - 2}
                      </span>
                    )}
                    {(!student.groups || student.groups.length === 0) && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>

                  {/* 4. Telefon */}
                  <div className="flex-1 px-1">
                    <span className="text-sm text-[#4a5568]">{student.phone || "—"}</span>
                  </div>

                  {/* 5. Tug'ilgan sana */}
                  <div className="flex-1 px-1">
                    <span className="text-sm text-[#4a5568]">{formatDate(student.birth_date)}</span>
                  </div>

                  {/* 6. Yaratilgan */}
                  <div className="flex-1 px-1">
                    <span className="text-sm text-[#4a5568]">{formatDate(student.created_at)}</span>
                  </div>


                {/* 7. Amallar */}
                <div className="flex-1 px-1 flex items-center gap-1">
                  <button
                    onClick={() => setShowStudent(student)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-[#f0f4ff] hover:text-[#1f39a1] transition-colors"
                  >
                    <VisibilityIcon style={{ fontSize: 18 }} />
                  </button>
                  <button
                  
                    onClick={
                      // console.log("EDIT STUDENT:", student.groups),
                      () => setEditStudent(student)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-[#f0f4ff] hover:text-[#1f39a1] transition-colors"
                  >
                    <EditIcon style={{ fontSize: 18 }} />
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <DeleteIcon style={{ fontSize: 18 }} />
                  </button>
                </div>
                </div>
              );
            })}
          </div>


          {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            
            {/* Previous */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-[#4a5568]
                hover:bg-[#f0f4ff] hover:border-[#1f39a1] hover:text-[#1f39a1]
                disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>

            {/* Page raqamlari */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                    ${page === p
                      ? "bg-[#1f39a1] text-white shadow-md"
                      : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-[#4a5568]
                hover:bg-[#f0f4ff] hover:border-[#1f39a1] hover:text-[#1f39a1]
                disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}

          
        </div>
      </div>

      {/* Modals */}
      <Suspense fallback={null}>
        {addOpen && (
          <StudentAddModal
            open={addOpen}
            onClose={() => setAddOpen(false)}
            onSave={handleSave}
          />
        )}
        {showStudent && (
          <StudentShowModal
            student={showStudent}
            onClose={() => setShowStudent(null)}
            onEdit={(s) => { setShowStudent(null); setEditStudent(s); }}
          />
        )}
        {editStudent && (
          <StudentEditModal
            student={editStudent}
            onClose={() => setEditStudent(null)}
            onSave={handleEditSave}
          />
        )}
      </Suspense>
    </div>
  );
}



















