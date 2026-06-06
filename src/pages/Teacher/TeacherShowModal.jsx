import { Close, Edit } from "@mui/icons-material";

function getPhotoUrl(photo) {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  const base =
    import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
    "http://localhost:3000";
  return `${base}${photo}`;
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

export default function TeacherShowModal({ teacher, onClose, onEdit }) {
  const data =  teacher;
  const av = data
    ? AVATAR_COLORS[data.id % AVATAR_COLORS.length]
    : AVATAR_COLORS[0];

  if (!teacher) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
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
                style={{
                  backgroundColor: av.bg,
                  color: av.color,
                }}
              >
                {getInitials(data?.full_name)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-[#1f39a1]">
                {data?.full_name || "—"}
              </h2>
              <p className="text-sm text-gray-400 mt-1">O'qituvchi</p>
            </div>
          </div>
          <button onClick={onClose}>
            <Close className="text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          { data ? (
            <>
              {/* Info cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Telefon</p>
                  <p className="font-semibold text-[#4a5568]">
                    {data.phone || "—"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
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

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Ro'yxatga olingan</p>
                  <p className="font-semibold text-[#4a5568]">
                    {formatDate(data.created_at)}
                  </p>
                </div>

                {(data.email || data.address) && (
                  <>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">Email</p>
                      <p className="font-semibold text-[#4a5568]">
                        {data.email || "—"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                      <p className="text-xs text-gray-400 mb-1">Manzil</p>
                      <p className="font-semibold text-[#4a5568]">
                        {data.address || "—"}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Guruhlar */}
              {data.groups?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">
                    Guruhlar
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.groups.map((g, i) => (
                      <span
                        key={g.id || i}
                        className="px-3 py-1 rounded-full bg-[#1f39a1] text-white text-xs"
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
        <div className="p-6 border-t flex gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100"
          >
            Yopish
          </button>
          <button
            onClick={() => onEdit(data)}
            disabled={ !data}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1f39a1] rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Edit style={{ fontSize: 18 }} />
            Tahrirlash
          </button>
        </div>
      </div>
    </div>
  );
}
