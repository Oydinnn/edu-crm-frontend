import { useEffect, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../services/axios";

export default function Rooms() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState({ name: "", capacity: "" });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);

  // 🔔 Toast bildirishnomasi holati
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Xonalarni yuklash
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rooms");
      if (res.status === 200) {
        setRooms(res.data.data);
      }
    } catch (error) {
      console.error("Xonalarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔔 Toast ko'rsatish funksiyasi
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  // 🆕 Yangi xona qo'shish
  const addRoom = async (roomData) => {
    try {
      const res = await api.post("/rooms", {
        name: roomData.name,
        capacity: roomData.capacity,
      });
      if (res.status === 201 || res.data?.success) {
        await fetchRooms();
        setSearchTerm("");
        showToast("Xona muvaffaqiyatli qo'shildi", "success");
        return true;
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Xona qo'shishda xatolik yuz berdi",
        "error",
      );
      return false;
    }
  };

  // ✏️ Xona tahrirlash
  const updateRoom = async (id, roomData) => {
    try {
      const res = await api.patch(`/rooms/${id}`, {
        name: roomData.name,
        capacity: roomData.capacity,
      });
      if (res.status === 200 || res.data?.success) {
        await fetchRooms();
        showToast("Xona muvaffaqiyatli yangilandi", "success");
        return true;
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Xona yangilashda xatolik yuz berdi",
        "error",
      );
      return false;
    }
  };

  // 🗑️ Xona o'chirish
  const deleteRoom = async (id) => {
    try {
      const res = await api.delete(`/rooms/${id}`);
      if (res.status === 200 || res.data?.success) {
        await fetchRooms();
        showToast("Xona o'chirildi", "success");
        return true;
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Xona o'chirishda xatolik yuz berdi",
        "error",
      );
      return false;
    }
  };

  const filteredRooms = (rooms || []).filter((r) => {
    const query = searchTerm?.toLowerCase() || "";
    return r?.name?.toLowerCase().includes(query);
  });

  const openAddDrawer = () => {
    setEditRoom(null);
    setForm({ name: "", capacity: "" });
    setDrawerOpen(true);
  };

  const openEditDrawer = (room) => {
    setEditRoom(room);
    setForm({ name: room.name, capacity: room.capacity });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditRoom(null);
    setForm({ name: "", capacity: "" });
  };

  // 💾 Saqlash
  const handleSave = async () => {
    if (!form.name.trim() || !form.capacity) return;
    setSaving(true);

    if (editRoom) {
      await updateRoom(editRoom.id, {
        name: form.name,
        capacity: Number(form.capacity),
      });
    } else {
      await addRoom({
        name: form.name,
        capacity: Number(form.capacity),
      });
    }

    setSaving(false);
    closeDrawer();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ushbu xonani o'chirmoqchimisiz?")) {
      await deleteRoom(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f39a1]"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* ✨ CSS-animatsiya */}
      <style>{`
        @keyframes roomFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .room-enter {
          animation: roomFadeIn 0.4s ease-out both;
        }
      `}</style>

      {/* 🔔 Toast bildirishnomasi */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-[100] px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 transition-all duration-300 transform ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          } ${toast.show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
        >
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-5 gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <h2 className="text-base font-semibold text-gray-800 dark:text-blue-400">
              Xonalar
            </h2>
            <button
              onClick={fetchRooms}
              className="text-gray-400 hover:text-[#1f39a1] transition-colors duration-200"
              title="Yangilash"
            >
              <RefreshIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Xona nomi bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/20 focus:border-[#1f39a1] transition-all"
            />
          </div>

          <button
            onClick={openAddDrawer}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#1f39a1] hover:bg-[#162870] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <AddIcon className="w-5 h-5" />
            Xona qo'shish
          </button>
        </div>

        {/* Rooms grid */}
        {filteredRooms.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">
            Xonalar mavjud emas
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="room-enter flex items-center justify-between bg-white hover:bg-[#f0f4ff] border border-gray-100 hover:border-[#1f39a1]/20 rounded-xl px-4 py-3 transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-medium text-[#4a5568] dark:text-blue-400">
                    {room.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">
                    Sig'imi: {room.capacity}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50/70 text-gray-400 hover:text-red-500 transition-all duration-200"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditDrawer(room)}
                    className="p-1.5 rounded-lg hover:bg-[#f0f4ff] text-gray-400 hover:text-[#1f39a1] transition-all duration-200"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overlay & Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/60 z-40"
          onClick={closeDrawer}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <h3 className="font-semibold text-gray-800 dark:text-blue-400">
            {editRoom ? "Xonani tahrirlash" : "Xonani qo'shish"}
          </h3>
          <button
            onClick={closeDrawer}
            className="text-gray-400 dark:text-slate-500 hover:text-[#1f39a1] dark:hover:text-blue-400 transition-colors duration-200"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1.5">
              Nomi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Xona nomi"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-800 dark:text-slate-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 dark:focus:ring-blue-500/30 focus:border-[#1f39a1] dark:focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1.5">
              Sig'imi
            </label>
            <input
              type="number"
              placeholder="Masalan: 20"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-800 dark:text-slate-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 dark:focus:ring-blue-500/30 focus:border-[#1f39a1] dark:focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-800">
          <button
            onClick={closeDrawer}
            className="px-4 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim() || !form.capacity || saving}
            className="px-5 py-2 text-sm font-medium text-white bg-[#1f39a1] hover:bg-[#162870] dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saqlanmoqda...
              </div>
            ) : (
              "Saqlash"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
