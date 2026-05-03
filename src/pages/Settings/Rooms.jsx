import { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

const branches = [
  { id: 1, name: "AICoder markazi" },
  { id: 2, name: "Fizika va Matematika" },
  { id: 3, name: "4-maktab" },
  { id: 4, name: "Niner markazi" },
  { id: 5, name: "IELTS full mock" },
  { id: 6, name: "IELTS full mock centre" },
  { id: 7, name: "Arxiv" },
];

const initialRooms = [
  { id: 1, name: "genious room", capacity: 15, branchId: 1 },
  { id: 2, name: "Impact room", capacity: 12, branchId: 1 },
  { id: 3, name: "1A", capacity: 25, branchId: 1 },
  { id: 4, name: "205-xona", capacity: 32, branchId: 1 },
  { id: 5, name: "16-xona", capacity: 18, branchId: 1 },
  { id: 6, name: "5 xona", capacity: 30, branchId: 1 },
  { id: 7, name: "IELTS with Islombek", capacity: 20, branchId: 1 },
  { id: 8, name: "Beginner", capacity: 18, branchId: 1 },
  { id: 9, name: "99", capacity: 25, branchId: 1 },
];

export default function Rooms() {
  const [activeBranch, setActiveBranch] = useState(1);
  const [rooms, setRooms] = useState(initialRooms);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState({ name: "", capacity: "" });

  const filteredRooms = rooms.filter((r) => r.branchId === activeBranch);

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

  const handleSave = () => {
    if (!form.name.trim() || !form.capacity) return;
    if (editRoom) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === editRoom.id
            ? { ...r, name: form.name, capacity: Number(form.capacity) }
            : r,
        ),
      );
    } else {
      setRooms((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: form.name,
          capacity: Number(form.capacity),
          branchId: activeBranch,
        },
      ]);
    }
    closeDrawer();
  };

  const handleDelete = (id) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-800">Xonalar</h2>
            {/* <button className="text-gray-400 hover:text-[#1f39a1] transition-colors duration-200">
              <RefreshIcon className="w-5 h-5" />
            </button> */}
          </div>
          <button
            onClick={openAddDrawer}
            className="flex items-center gap-1.5 bg-[#1f39a1] hover:bg-[#162870] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <AddIcon className="w-5 h-5" />
            Xonani qo'shish
          </button>
        </div>

        {/* Branch tabs */}
        {/* <div className="flex gap-2 flex-wrap mb-6">
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setActiveBranch(branch.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeBranch === branch.id
                  ? "bg-[#f0f4ff] text-[#1f39a1] shadow-sm"
                  : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
              }`}
            >
              {branch.name}
            </button>
          ))}
        </div> */}

        {/* Rooms grid */}
        {filteredRooms.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">
            Bu filialda xonalar yo'q
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="flex items-center justify-between bg-white hover:bg-[#f0f4ff] border border-gray-100 hover:border-[#1f39a1]/20 rounded-xl px-4 py-3 transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-medium text-[#4a5568]">
                    {room.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
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

      {/* Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={closeDrawer} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">
            {editRoom ? "Xonani tahrirlash" : "Xonani qo'shish"}
          </h3>
          <button
            onClick={closeDrawer}
            className="text-gray-400 hover:text-[#1f39a1] transition-colors duration-200"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nomi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Xona nomi"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 focus:border-[#1f39a1] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Sig'imi <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Masalan: 20"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 focus:border-[#1f39a1] transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={closeDrawer}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim() || !form.capacity}
            className="px-5 py-2 text-sm font-medium text-white bg-[#1f39a1] hover:bg-[#162870] rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
