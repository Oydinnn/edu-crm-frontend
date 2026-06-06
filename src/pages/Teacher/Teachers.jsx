import { useEffect, useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../../services/axios";
import TeacherShowModal from "./TeacherShowModal";

 function getPhotoUrl(photo) {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  const base = import.meta.env.VITE_API_URL?.replace("/api/v1", "");
  return `${base}${photo}`;
}

export default function TeachersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [showTeacher, setShowTeacher] = useState(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [tempSelectedGroups, setTempSelectedGroups] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    photo: null,
  });

  const itemsPerPage = 10;

  const filteredTeachers = teachers.filter((t) =>
    `${t.full_name || ""} ${t.phone || ""} ${t.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const currentData = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const filteredGroups = groups.filter((g) =>
    g.name?.toLowerCase().includes(groupSearch.toLowerCase()),
  );

  async function getTeacher() {
    try {
      const res = await api.get("/teachers");
      if (res?.data?.success) setTeachers(res.data.data);
      
    } catch (error) {
      console.log(error);
    }
  }

  async function getGroups() {
    try {
      const res = await api.get("/groups/all");
      if (res?.data?.success) setGroups(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  // 🗑️ DELETE TEACHER
  async function deleteTeacher(id) {
    if (!window.confirm("Rostanham bu o'qituvchini o'chirasizmi?")) return;
    
    try {
      await api.delete(`/teachers/${id}`);
      await getTeacher();
      alert("O'qituvchi muvaffaqiyatli o'chirildi");
    } catch (error) {
      const msg = error.response?.data?.message || "Xatolik yuz berdi";
      alert("Xato: " + msg);
    }
  }


  // ✏️ EDIT TEACHER
  function openEditDrawer(teacher) {
    setIsEditMode(true);
    setEditingTeacherId(teacher.id);
    setForm({
      full_name: teacher.full_name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      address: teacher.address || "",
      photo: null,
    });
    if (teacher.photo) {
      const photoUrl = getPhotoUrl(teacher.photo);
      setPhotoPreview(photoUrl);
    } else {
      setPhotoPreview(null);
    }
    setSelectedGroups(teacher.groups?.map((g) => g.id) || []);
    setIsOpen(true);
  }

  async function handleUpdate() {
    if (!form.full_name || !form.phone) {
      alert("Iltimos, majburiy maydonlarni to'ldiring");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      if (form.photo instanceof File) formData.append("photo", form.photo);
      
      if (selectedGroups.length > 0) {
        formData.append("groups", JSON.stringify(selectedGroups));
      }

      const res = await api.patch(`/teachers/${editingTeacherId}`, formData);

      if (res?.data?.success) {
        await getTeacher();
        setIsOpen(false);
        setIsEditMode(false);
        resetForm();
        alert("O'qituvchi muvaffaqiyatli yangilandi");
      } else if (res?.data?.data) {
        await getTeacher();
        setIsOpen(false);
        setIsEditMode(false);
        resetForm();
        alert("O'qituvchi muvaffaqiyatli yangilandi");
      }
    } catch (error) {
      console.error("Update error:", error);
      const errorMsg =
        error.response?.data?.message ||
        (error.response?.status === 409
          ? "Bu telefon yoki email allaqachon ro'yxatda bor"
          : "Xatolik yuz berdi");
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTeacher();
    getGroups();
  }, []);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      const MAX = 400;
      let w = img.width, h = img.height;
      if (w > h) { h = (h / w) * MAX; w = MAX; }
      else { w = (w / h) * MAX; h = MAX; }
      
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      
      canvas.toBlob((blob) => {
        const compressed = new File([blob], file.name, { type: 'image/jpeg' });
        setForm(prev => ({ ...prev, photo: compressed }));
        setPhotoPreview(URL.createObjectURL(compressed));
      }, 'image/jpeg', 0.8);
    };
    img.src = URL.createObjectURL(file);
  }

  function openGroupModal() {
    setTempSelectedGroups([...selectedGroups]);
    setGroupSearch("");
    setIsGroupModalOpen(true);
  }

  function toggleTempGroup(groupId) {
    setTempSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  }

  function confirmGroups() {
    setSelectedGroups([...tempSelectedGroups]);
    setIsGroupModalOpen(false);
  }

  function removeGroup(groupId) {
    setSelectedGroups((prev) => prev.filter((id) => id !== groupId));
  }

  function resetForm() {
    setForm({
      full_name: "",
      email: "",
      phone: "",
      address: "",
      photo: null,
    });
    setSelectedGroups([]);
    setPhotoPreview(null);
    setIsEditMode(false);
    setEditingTeacherId(null);
  }

  async function handleSubmit() {
    if (!form.full_name || !form.phone ) {
      alert("Iltimos, majburiy maydonlarni to'ldiring");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      if (form.photo) formData.append("photo", form.photo);
      selectedGroups.forEach((id) => formData.append("groups[]", id));

      const res = await api.post("/teachers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        await getTeacher();
        setIsOpen(false);
        resetForm();
        alert(`O'qituvchi muvaffaqiyatli yaratildi, login va parol ${form.email} emailga jo'natildi! `);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        (error.response?.status === 409
          ? "Bu telefon yoki email allaqachon ro'yxatda bor"
          : "Xatolik yuz berdi");
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen  dark:bg-slate-950">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800  dark:text-blue-400">O'qituvchilar</h1>
          <p className="text-gray-500 text-sm">
            O'qituvchilar ro'yxati va ma'lumotlari
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
          className="bg-[#1f39a1] hover:bg-[#162870] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          <AddIcon />
          O'qituvchi qo'shish
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">

          {/* Header */}
          <div className="flex items-center px-4 py-3.5 bg-[#f0f4ff]/60 border-b border-gray-100 min-w-[950px]">
            {["Nomi", "Guruh", "Telefon raqam", "Email", "Manzil", "Amallar"].map((label, i) => (
              <div key={i} className="flex-1 px-1">
                <span className="text-xs font-semibold text-[#1f39a1]/60 uppercase tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {currentData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              O'qituvchilar topilmadi
            </div>
          ) : currentData.map((t, i) => (
            <div
              key={i}
              className="flex items-center px-4 py-3.5 border-b border-gray-50
                hover:bg-[#f0f4ff]/30 transition-all duration-300 min-w-[950px]"
            >
              {/* 1. Nomi */}
              <div className="flex-1 px-1 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1f39a1] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {t.photo ? (
                    <img
                      src={getPhotoUrl(t.photo)}
                      alt={t.full_name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="uppercase">{t.full_name?.charAt(0) || "?"}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#4a5568] leading-tight">{t.full_name}</p>
                  <p className="text-[11px] text-gray-400 leading-tight">Teacher</p>
                </div>
              </div>

              {/* 2. Guruh */}
              <div className="flex-1 px-1 flex flex-wrap gap-1 items-center">
                {t.groups?.slice(0, 2).map((g) => (
                  <span
                    key={g.id}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#6366f118] text-[#6366f1]"
                  >
                    {g.name}
                  </span>
                ))}
                {t.groups?.length > 2 && (
                  <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    +{t.groups.length - 2}
                  </span>
                )}
                {(!t.groups || t.groups.length === 0) && (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </div>

              {/* 3. Telefon */}
              <div className="flex-1 px-1">
                <span className="text-sm text-[#4a5568]">{t.phone || "—"}</span>
              </div>

              {/* 4. Email */}
              <div className="flex-1 px-1">
                <span className="text-sm text-[#4a5568] truncate">{t.email || "—"}</span>
              </div>

              {/* 5. Manzil */}
              <div className="flex-1 px-1">
                <span className="text-sm text-[#4a5568]">{t.address || "—"}</span>
              </div>

              {/* 6. Amallar */}
              <div className="flex-1 px-1 flex items-center gap-1">
                <button
                  onClick={() => setShowTeacher(t)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-[#f0f4ff] hover:text-[#1f39a1] transition-colors"
                >
                  <VisibilityIcon style={{ fontSize: 18 }} />
                </button>
                <button
                  onClick={() => openEditDrawer(t)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-[#f0f4ff] hover:text-[#1f39a1] transition-colors"
                >
                  <EditIcon style={{ fontSize: 18 }} />
                </button>
                <button
                  onClick={() => deleteTeacher(t.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <DeleteIcon style={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-5 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Previous
        </button>
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
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>

      {/* ============ ADD/EDIT TEACHER DRAWER ============ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-all duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="font-semibold text-lg text-gray-800">
              {isEditMode ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"}
            </h2>
            <p className="text-sm text-gray-400">
              {isEditMode
                ? "O'qituvchi ma'lumotlarini yangilang"
                : "Bu yerda siz yangi o'qituvchi qo'shishingiz mumkin."}
            </p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              resetForm();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* FIO */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              O'qituvchi FIO *
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleFormChange}
              placeholder="Ma'lumotni kiriting"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f39a1]"
            />
          </div>

          {/* Telefon */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Telefon raqam *
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleFormChange}
              placeholder="998901234567"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f39a1]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Elektron pochta
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              placeholder="Elektron pochtani kiriting"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f39a1]"
            />
          </div>

          {/* Guruh */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Guruh
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedGroups.map((gId) => {
                const g = groups.find((gr) => gr.id === gId);
                return g ? (
                  <span
                    key={gId}
                    className="flex items-center gap-1 px-3 py-1 bg-[#eef2ff] text-[#1f39a1] text-xs rounded-full"
                  >
                    {g.name}
                    <button
                      onClick={() => removeGroup(gId)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
            <button
              type="button"
              onClick={openGroupModal}
              className="flex items-center gap-1 text-sm text-[#1f39a1] border border-[#1f39a1] px-3 py-1.5 rounded-lg hover:bg-[#eef2ff] transition"
            >
              <AddIcon fontSize="small" />
              Qo'shish
            </button>
          </div>


           {/* Manzil */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Manzil
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleFormChange}
              placeholder="Manzilni kiriting"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f39a1]"
            />
          </div>

          {/* Surat */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Surati
            </label>
            <div
              onClick={() => fileRef.current.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                photoPreview
                  ? "border-green-400 bg-green-50 hover:bg-green-100"
                  : "border-[#9ba4c9] hover:bg-gray-50"
              }`}
            >
              {photoPreview ? (
                <div className="space-y-2">
                  <img
                    src={photoPreview}
                    alt="preview"
                    className="w-20 h-20 rounded-lg object-cover mx-auto border-2 border-green-400"
                  />
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <span className="text-lg">✓</span>
                    <p className="text-sm font-medium">Fayl yuklandi</p>
                  </div>
                  <p className="text-xs text-gray-500">{form.photo?.name}</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 text-sm">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG or PNG (max. 800x800px)
                  </p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>

         
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t flex justify-end gap-3">
          <button
            onClick={() => {
              setIsOpen(false);
              resetForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Bekor qilish
          </button>
          <button
            onClick={isEditMode ? handleUpdate : handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[#1f39a1] text-white rounded-lg text-sm hover:bg-[#162870] disabled:opacity-50 transition"
          >
            {loading ? "Saqlanmoqda..." : isEditMode ? "Yangilash" : "Saqlash"}
          </button>
        </div>
      </div>

      {/* ============ GROUP SELECTION MODAL ============ */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsGroupModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-h-[500px] flex flex-col z-10">
            {/* Modal Header */}
            <div className="p-5 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Guruhga biriktirish
                  </h3>
                  <p className="text-sm text-gray-400">
                    Bir yoki bir nechta guruhni tanlang
                  </p>
                </div>
                <button
                  onClick={() => setIsGroupModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
              {/* Group Search */}
              <div className="mt-3 relative">
                <SearchIcon
                  className="absolute top-2.5 left-3 text-gray-400"
                  fontSize="small"
                />
                <input
                  type="text"
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                  placeholder="Guruh qidirish..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f39a1]"
                />
              </div>
            </div>

            {/* Group List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {filteredGroups.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">
                  Guruh topilmadi
                </p>
              ) : (
                filteredGroups.map((g) => (
                  <label
                    key={g.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={tempSelectedGroups.includes(g.id)}
                      onChange={() => toggleTempGroup(g.id)}
                      className="w-4 h-4 accent-[#1f39a1] rounded"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      {g.name}
                    </span>
                  </label>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmGroups}
                className="px-4 py-2 text-sm bg-[#1f39a1] text-white rounded-lg hover:bg-[#162870] transition"
              >
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}

      <TeacherShowModal
        teacher={showTeacher}
        onClose={() => setShowTeacher(null)}
        onEdit={(t) => {
          setShowTeacher(null);
          openEditDrawer(t);
        }}
      />
    </div>
  );
}
