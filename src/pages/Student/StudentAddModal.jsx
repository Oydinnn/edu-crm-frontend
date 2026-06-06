import { useState, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../services/axios";

const INITIAL_FORM = {
  full_name: "",
  phone: "",
  email: "",
  birth_date: "",
  address: "",
  photo: null,
  password: "",
};

export default function StudentAddModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Guruh modal
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [tempSelectedGroups, setTempSelectedGroups] = useState([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupSearch, setGroupSearch] = useState("");

  const fileRef = useRef();

  // Guruhlarni yuklash
  useEffect(() => {
    if (!open) return;
    api.get("/groups/all")
      .then((res) => setGroups(res.data?.data || res.data || []))
      .catch(console.error);
  }, [open]);

  const filteredGroups = groups.filter((g) =>
    g.name?.toLowerCase().includes(groupSearch.toLowerCase())
  );

  function openGroupModal() {
    setTempSelectedGroups([...selectedGroups]);
    setGroupSearch("");
    setIsGroupModalOpen(true);
  }

  function toggleTempGroup(groupId) {
    setTempSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  }

  function confirmGroups() {
    setSelectedGroups([...tempSelectedGroups]);
    setIsGroupModalOpen(false);
  }

  function removeGroup(groupId) {
    setSelectedGroups((prev) => prev.filter((id) => id !== groupId));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setForm((f) => ({ ...f, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  function handleClose() {
    setForm(INITIAL_FORM);
    setSelectedGroups([]);
    setPhotoPreview(null);
    onClose();
  }

  async function handleSave() {
    if (!form.full_name.trim()) return;
    setSaving(true);
    try {
      await onSave({ ...form, groups: selectedGroups });
      setForm(INITIAL_FORM);
      setSelectedGroups([]);
      setPhotoPreview(null);
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#1f39a1] outline-none transition-all";

  if (!open) return null;

  return (
    <>
      {/* ── Drawer overlay ── */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={handleClose}
      />

      {/* ── Drawer ── */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="font-semibold text-lg text-gray-800">Talaba qo'shish</h2>
            <p className="text-sm text-gray-400">Bu yerda siz yangi Talaba qo'shishingiz mumkin.</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* FIO */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Talaba FIO *</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="Ma'lumotni kiriting"
              className={inputCls}
            />
          </div>

          {/* Telefon */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Telefon raqam *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="998901234567"
              className={inputCls}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Elektron pochtani kiriting"
              className={inputCls}
            />
          </div>

          {/* Parol */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Parol *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Parolni kiriting"
              className={inputCls}
            />
          </div>

          {/* Tug'ilgan sana */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Tug'ilgan sanasi</label>
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm((f) => ({ ...f, birth_date: e.target.value }))}
              className={inputCls}
            />
          </div>

          {/* Manzil */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Manzil</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Manzilni kiriting"
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
                  <p className="text-xs text-gray-500">{form.photo?.name}</p>
                </div>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 28, color: "#9ca3af", mb: 0.5 }} />
                  <p className="text-gray-500 text-sm">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-400">JPG or PNG (max. 2 mb)</p>
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
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.full_name.trim()}
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
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[420px] max-h-[500px] flex flex-col z-10 border border-gray-100 dark:border-slate-800">

            {/* Modal Header */}
            <div className="p-5 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Guruhga biriktirish</h3>
                  <p className="text-sm text-gray-400">Bir yoki bir nechta guruhni tanlang</p>
                </div>
                <button
                  onClick={() => setIsGroupModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
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

            {/* Group List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {filteredGroups.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Guruh topilmadi</p>
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
                    <span className="text-sm text-gray-700 font-medium">{g.name}</span>
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
    </>
  );
}
