import { useState, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../services/axios";

export default function StudentEditModal({ student, onClose, onSave, groups = []  }) {
  const [form, setForm]     = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Guruh
  const [selectedGroups, setSelectedGroups]     = useState([]);
  const [tempSelectedGroups, setTempSelected]   = useState([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupSearch, setGroupSearch]           = useState("");

  const fileRef = useRef();

  // Student o'zgarganda formni to'ldirish
  useEffect(() => {
    if (!student) return;

    setForm({
      full_name:  student.full_name  || "",
      email:      student.email      || "",
      phone:      student.phone      || "",
      address:    student.address    || "",
      birth_date: student.birth_date
        ? new Date(student.birth_date).toISOString().split("T")[0]
        : "",
      photo: null,
    });

    // Oldingi guruhlarni shu yerda set qiling
    const existingGroupIds = student.groups?.map((g) => g.id) || [];
    setSelectedGroups(existingGroupIds);
    setPhotoPreview(null);
    setError(null);

    // Guruhlarni yuklab, keyin selectedGroups ni qayta set qiling
    api.get("/groups/all")
      .then((res) => {
        setSelectedGroups(existingGroupIds);
      })
      .catch(console.error);

  }, [student?.id]); 

  const filteredGroups = groups.filter((g) =>
    g.name?.toLowerCase().includes(groupSearch.toLowerCase())
  );

  function openGroupModal() {
    setTempSelected([...selectedGroups]);
    setGroupSearch("");
    setIsGroupModalOpen(true);
  }

  function toggleTempGroup(id) {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function confirmGroups() {
    setSelectedGroups([...tempSelectedGroups]);
    setIsGroupModalOpen(false);
  }

  // eslint-disable-next-line no-unused-vars
  function removeGroup(id) {
    setSelectedGroups((prev) => prev.filter((x) => x !== id));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setForm((f) => ({ ...f, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSave = async () => {
    if (!form.full_name?.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(student.id, { ...form, groups: selectedGroups });
    } catch (err) {
      setError(err?.response?.data?.message || "Xatolik yuz berdi.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#1f39a1] outline-none transition-all";

  if (!student) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={handleClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white shadow-2xl z-50 flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="font-semibold text-lg text-gray-800">Talabani tahrirlash</h2>
            <p className="text-sm text-gray-400">{student?.full_name}</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* FIO */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">F.I.O *</label>
            <input
              type="text"
              value={form.full_name || ""}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="To'liq ismni kiriting"
              className={inputCls}
            />
          </div>

          {/* Telefon */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Telefon raqam</label>
            <input
              type="tel"
              value={form.phone || ""}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="998XXXXXXXXX"
              className={inputCls}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="example@gmail.com"
              className={inputCls}
            />
          </div>

          {/* Manzil */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Manzil</label>
            <input
              type="text"
              value={form.address || ""}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Manzilni kiriting"
              className={inputCls}
            />
          </div>

          {/* Tug'ilgan sana */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Tug'ilgan sanasi</label>
            <input
              type="date"
              value={form.birth_date || ""}
              onChange={(e) => setForm((f) => ({ ...f, birth_date: e.target.value }))}
              className={inputCls}
            />
          </div>

          {/* Guruh */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Guruh</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedGroups.map((gId) => {
                const g = groups.find((gr) => gr.id === gId);
                return g ? (
                  <span
                    key={gId}
                    className="flex items-center gap-1 px-3 py-1 bg-[#eef2ff] text-[#1f39a1] text-xs rounded-full"
                  >
                    {g.name}
                    <button onClick={() => removeGroup(gId)} className="ml-1 hover:text-red-500">×</button>
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

          {/* Surat */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Surati</label>
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
                </div>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 26, color: "#9ca3af" }} />
                  <p className="text-gray-500 text-sm mt-1">
                    <span className="text-[#1f39a1] font-medium">Fayl tanlash</span> yoki sudrab tashlang
                  </p>
                  <p className="text-xs text-gray-400">JPG yoki PNG (max. 2 MB)</p>
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

        {/* Footer */}
        <div className="p-5 border-t flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.full_name?.trim()}
            className="px-4 py-2 bg-[#1f39a1] text-white rounded-lg text-sm hover:bg-[#162870] disabled:opacity-50 transition flex items-center gap-2"
          >
            {saving && <CircularProgress size={14} color="inherit" />}
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </div>

      {/* ── Guruh tanlash modali ── */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsGroupModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-h-[500px] flex flex-col z-10">

            <div className="p-5 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Guruhga biriktirish</h3>
                  <p className="text-sm text-gray-400">Bir yoki bir nechta guruhni tanlang</p>
                </div>
                <button onClick={() => setIsGroupModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <CloseIcon fontSize="small" />
                </button>
              </div>
              <div className="mt-3 relative">
                <SearchIcon className="absolute top-2.5 left-3 text-gray-400" fontSize="small" />
                <input
                  type="text"
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                  placeholder="Guruh qidirish..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f39a1]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {filteredGroups.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Guruh topilmadi</p>
              ) : filteredGroups.map((g) => (
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
                  <span className="text-sm text-gray-700 font-medium">{g.name}</span>
                </label>
              ))}
            </div>

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
    </>
  );
}
