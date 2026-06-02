import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import InfoIcon from "@mui/icons-material/Info";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MicIcon from "@mui/icons-material/Mic";
import api from "../../services/axios";

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month}, ${year} ${hours}:${minutes}`;
}

const getFileUrl = (filename) => {
  if (!filename) return "";
  const base = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:3000";
  return `${base}/files/files/${filename}`;
};

// URL yoki oddiy matnligini tekshirish
const renderDescriptionText = (text) => {
  if (!text) return "—";
  if (text.startsWith("http://") || text.startsWith("https://")) {
    return (
      <a
        href={text}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#1f39a1] hover:underline break-all font-medium inline-flex items-center gap-1"
      >
        {text}
      </a>
    );
  }
  return text;
};

export default function HomeworkPending() {
  const { id: groupId, homeworkId, studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const homeworkState = location.state?.homework || null;

  const [studentResult, setStudentResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [grade, setGrade] = useState(60);
  const [comment, setComment] = useState("");

  // Get student result info
  useEffect(() => {
    if (!groupId || !homeworkId || !studentId) return;
    setLoading(true);
    api
      .get(`/group/${groupId}/homework/${homeworkId}/results/${studentId}`)
      .then((res) => {
        setStudentResult(res.data?.data || null);
      })
      .catch((err) => {
        console.error("Error loading student result", err);
      })
      .finally(() => setLoading(false));
  }, [groupId, homeworkId, studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentResult) return;
    setSubmitting(true);

    const payload = {
      grade: Number(grade),
      title: comment || "Vazifa tekshirildi",
      homework_answer_id: studentResult.id,
    };

    try {
      await api.post(`/group/${groupId}/homework/${homeworkId}/check`, payload);
      // Navigate back to checking list
      navigate(`/groups/${groupId}/homework/${homeworkId}/checking`, {
        state: { homework: homeworkState },
      });
    } catch (err) {
      console.error("Error checking homework", err);
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/groups/${groupId}/homework/${homeworkId}/checking`, {
      state: { homework: homeworkState },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1f39a1] border-t-transparent" />
          <p className="text-sm font-semibold text-gray-500">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const hasFile = !!studentResult?.file;
  const isImage = hasFile && /\.(jpg|jpeg|png|gif|webp)$/i.test(studentResult.file);
  const fileUrl = getFileUrl(studentResult?.file);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
      <div className="w-full lg:w-1/2 mr-auto ml-0">
        {/* Navigation Breadcrumb */}
        <button
          type="button"
          onClick={handleCancel}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-[#1f39a1]"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
          <span>Kutayotganlar</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Uyga vazifa</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Uy vazifasi info */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Uy vazifasi</h3>
            <div className="rounded-xl bg-gray-50/70 p-4 border border-gray-100/50">
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Izoh:
              </span>
              <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                {homeworkState?.topic || homeworkState?.title || "Homework tekshirish qismini qilish backend"}
              </p>
            </div>
          </div>

          {/* Section: Student Submission */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              {studentResult?.students?.full_name || "Talaba ismi"}
            </h3>

            {/* Submission metadata */}
            <div className="mb-6 grid grid-cols-3 gap-4 rounded-xl bg-gray-50/50 p-4 border border-gray-100/50">
              <div>
                <span className="block text-xs font-bold text-gray-400 mb-1">Vaqti:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {formatDateTime(studentResult?.created_at)}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400 mb-1">Fayllar soni:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {hasFile ? 1 : 0}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400 mb-1">Status:</span>
                <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-600 border border-amber-200/50">
                  Kutayabti
                </span>
              </div>
            </div>

            {/* Files block */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-500">
                Fayl: {hasFile ? 1 : 0}
              </h4>
              
              {hasFile ? (
                <div className="flex flex-col gap-4">
                  {isImage ? (
                    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white max-w-xs shadow-sm transition-all hover:border-gray-300">
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block">
                        <img
                          src={fileUrl}
                          alt="Student submission"
                          className="h-auto w-full object-cover max-h-48 transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-white uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/35">
                            Rasm ko'rish
                          </span>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300"
                    >
                      <CloudUploadIcon className="text-gray-400" />
                      <span>{studentResult.file}</span>
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm italic text-gray-400">Fayllar biriktirilmagan</p>
              )}

              {/* Student text/links comments */}
              <div className="mt-4 border-l-4 border-[#1f39a1] bg-[#f0f4ff]/40 p-4 rounded-r-xl">
                <span className="block text-xs font-bold text-[#1f39a1]/80 mb-1.5 uppercase tracking-wide">
                  Uyga vazifa izohi:
                </span>
                <p className="text-sm font-semibold text-gray-800 leading-relaxed break-words">
                  {renderDescriptionText(studentResult?.title)}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Grading & Review */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            {/* Info Tip Banner */}
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-blue-50/50 p-4 text-sm text-[#1e40af] border border-blue-100/50 leading-normal">
              <InfoIcon className="text-[#3b82f6] shrink-0" sx={{ fontSize: 20 }} />
              <span className="font-medium">
                60-100 oralig'ida ball qo'yilgan vazifa <strong className="font-semibold text-green-700">"Qabul qilingan"</strong>, 
                0-59 oralig'ida ball qo'yilgan vazifa <strong className="font-semibold text-red-600">"Qaytarilgan"</strong> hisoblanadi.
              </span>
            </div>

            {/* Ball Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-base font-bold text-gray-800">Ball</label>
                <div className="flex h-10 w-16 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-base font-bold text-gray-900">
                  {grade}
                </div>
              </div>

              {/* Gradient slider background wrapper */}
              <div className="relative pt-4 pb-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#10b981] transition-all hover:bg-gray-300"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`,
                  }}
                />
                <span className="block mt-2 text-center text-xs font-semibold text-gray-400">
                  O'tish bali
                </span>
              </div>
            </div>

            {/* Drag & Drop Visual (Mockup representation) */}
            <div className="mt-6 space-y-3">
              <label className="block text-sm font-bold text-gray-700">Fayllar</label>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center transition-all hover:border-[#10b981]/50">
                <CloudUploadIcon className="text-[#10b981] mb-2" sx={{ fontSize: 32 }} />
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Faylni yuklash uchun ushbu hudud ustiga bosing yoki faylni shu yerga olib keling
                </p>
                <p className="text-xs text-gray-400">
                  .jpg, .png, .pdf, .mp4, .docs formatlaridan birida bo'lishi mumkin
                </p>
              </div>
            </div>

            {/* Feedback comment input */}
            <div className="mt-6 space-y-3">
              <label htmlFor="teacher-comment" className="block text-sm font-bold text-gray-700">
                Izohingiz
              </label>
              <div className="relative flex items-center rounded-xl border border-gray-200 bg-white px-3 focus-within:border-[#10b981] focus-within:ring-2 focus-within:ring-[#10b981]/15 transition-all">
                <textarea
                  id="teacher-comment"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Vazifa bo'yicha fikr va fikr-mulohazalaringizni yozing..."
                  className="w-full resize-none py-3 pr-10 text-sm font-semibold text-gray-800 placeholder-gray-400 outline-none"
                />
                <button
                  type="button"
                  aria-label="Mikrofon orqali kiritish"
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <MicIcon sx={{ fontSize: 20 }} />
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pb-12">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center min-w-[120px] px-6 py-2.5 text-sm font-bold text-white bg-[#10b981] hover:bg-[#0d9488] rounded-xl transition-all shadow-md shadow-emerald-100 disabled:opacity-50 active:scale-[0.98]"
            >
              {submitting ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
