import { Close, Edit } from "@mui/icons-material";

function getPhotoUrl(photo) {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  const base =
    import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
    "http://localhost:3000";
  return `${base}/uploads/${photo}`;
}

const AVATAR_COLORS = [
  { bg: "#ede9fe", color: "#5b21b6" },
  { bg: "#ecfdf5", color: "#065f46" },
  { bg: "#fef3c7", color: "#92400e" },
  { bg: "#fee2e2", color: "#991b1b" },
  { bg: "#e0f2fe", color: "#0c4a6e" },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function StudentShowModal({ student, onClose, onEdit }) {
  const data = student;
  const av = data
    ? AVATAR_COLORS[data.id % AVATAR_COLORS.length]
    : AVATAR_COLORS[0];

  // Hide Edit button when onEdit is a no-op empty function or not provided
  const showEdit =
    typeof onEdit === "function" &&
    onEdit.toString().replace(/\s/g, "") !== "()=>{}";

  if (!student) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            {data?.photo ? (
              <img
                src={getPhotoUrl(data.photo)}
                alt="Avatar"
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl"
                style={{ backgroundColor: av.bg, color: av.color }}
              >
                {getInitials(data?.full_name)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-[#1f39a1] dark:text-blue-400">
                {data?.full_name || "—"}
              </h2>
              <p className="text-sm text-gray-400 mt-1">Talaba</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
          >
            <Close />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {data ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Telefon</p>
                  <p className="font-semibold text-[#4a5568] dark:text-gray-200">
                    {data.phone || "—"}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <p
                    className={`font-bold text-[15px] ${
                      (data.status || "active").toLowerCase() === "active"
                        ? "text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                        : "text-gray-500"
                    }`}
                  >
                    {data.status || "active"}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Tug'ilgan sana</p>
                  <p className="font-semibold text-[#4a5568] dark:text-gray-200">
                    {formatDate(data.birth_date)}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Ro'yxatga olingan</p>
                  <p className="font-semibold text-[#4a5568] dark:text-gray-200">
                    {formatDate(data.created_at)}
                  </p>
                </div>

                {data.email && (
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <p className="font-semibold text-[#4a5568] dark:text-gray-200 break-all">
                      {data.email}
                    </p>
                  </div>
                )}

                {data.address && (
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Manzil</p>
                    <p className="font-semibold text-[#4a5568] dark:text-gray-200">
                      {data.address}
                    </p>
                  </div>
                )}
              </div>

              {data.groups?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Guruhlar
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.groups.map((g, i) => (
                      <span
                        key={g.id || i}
                        className="px-3 py-1 rounded-full bg-[#1f39a1] dark:bg-blue-600 text-white text-xs font-semibold"
                      >
                        {g.name || `Guruh ${i + 1}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 dark:border-slate-800 flex gap-3 bg-gray-50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className={`py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
              showEdit ? "flex-1" : "w-full"
            }`}
          >
            Yopish
          </button>
          {showEdit && (
            <button
              onClick={() => onEdit(data)}
              disabled={!data}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1f39a1] rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit style={{ fontSize: 18 }} />
              Tahrirlash
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
