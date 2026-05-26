import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import api from "../../services/axios";

const toolbarIcons = [
  { label: "B", icon: <FormatBoldIcon fontSize="inherit" /> },
  { label: "I", icon: <FormatItalicIcon fontSize="inherit" /> },
  { label: "U", icon: <FormatUnderlinedIcon fontSize="inherit" /> },
  { label: "S", icon: <StrikethroughSIcon fontSize="inherit" /> },
  { label: "Quote", icon: <FormatQuoteIcon fontSize="inherit" /> },
  { label: "Code", icon: <CodeIcon fontSize="inherit" /> },
  { label: "Bulleted list", icon: <FormatListBulletedIcon fontSize="inherit" /> },
  { label: "Numbered list", icon: <FormatListNumberedIcon fontSize="inherit" /> },
  { label: "Indent decrease", icon: <FormatIndentDecreaseIcon fontSize="inherit" /> },
  { label: "Indent increase", icon: <FormatIndentIncreaseIcon fontSize="inherit" /> },
  { label: "Link", icon: <InsertLinkIcon fontSize="inherit" /> },
];

export default function GroupAddHomework() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/groups/${id}/lessons`)
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        const list = Array.isArray(data) ? data : [];
        const params = new URLSearchParams(location.search);
        const lessonParam = params.get("lesson");

        setLessons(list);
        if (lessonParam) setSelectedLesson(lessonParam);
      })
      .catch(() => setLessons([]));
  }, [id, location.search]);

  const selectedLessonTitle = useMemo(() => {
    const lesson = lessons.find((item) => String(item.id) === String(selectedLesson));
    return lesson?.topic || lesson?.name || "Uyga vazifa";
  }, [lessons, selectedLesson]);

  const onPublish = async (e) => {
    e.preventDefault();

    if (!selectedLesson) {
      alert("Iltimos, mavzu tanlang");
      return;
    }

    const fd = new FormData();
    fd.append("lesson_id", selectedLesson);
    fd.append("group_id", id);
    fd.append("title", selectedLessonTitle);
    if (description.trim()) fd.append("description", description.trim());
    if (file) fd.append("file", file);

    setLoading(true);
    try {
      const res = await api.post(`/groups/${id}/homework/create`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data?.message || "E'lon qilindi");
      navigate(`/groups/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] bg-white px-0 py-0 text-[#1f2937] dark:bg-slate-950 dark:text-white">
      <form onSubmit={onPublish} className="w-full max-w-[472px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-[18px] font-bold text-gray-800 transition-colors hover:text-[#1f39a1] dark:text-white dark:hover:text-blue-400"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 16 }} className="text-gray-400 dark:text-gray-500" />
          Yangi uyga vazifa yaratish
        </button>

        <label className="mb-7 block">
          <span className="mb-2 block text-[13px] font-bold text-gray-800 dark:text-white">
            <span className="text-red-500">*</span> Mavzu
          </span>
          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[13px] text-gray-800 outline-none transition focus:border-[#1f39a1] focus:ring-2 focus:ring-[#1f39a1]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
          >
            <option value="">Mavzulardan birini tanlang</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.topic || lesson.name || `Lesson ${lesson.id}`}
              </option>
            ))}
          </select>
        </label>

        <label className="mb-12 block">
          <span className="mb-2 block text-[13px] font-bold text-gray-800 dark:text-white">
            <span className="text-red-500">*</span> Izoh
          </span>
          <div className="overflow-hidden border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-14 flex-wrap items-center gap-x-3 gap-y-1 border-b border-gray-200 bg-[#f0f4ff]/60 px-3 text-[13px] text-gray-800 dark:border-slate-700 dark:bg-slate-700/50 dark:text-blue-400">
              <button type="button" className="font-bold">H1</button>
              <button type="button" className="font-bold">H2</button>
              <button type="button">Sans Serif</button>
              <span className="text-gray-400">↕</span>
              <button type="button">Normal</button>
              <span className="text-gray-400">↕</span>
              {toolbarIcons.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  aria-label={item.label}
                  title={item.label}
                  className="inline-flex h-5 w-5 items-center justify-center rounded text-[16px] text-gray-700 transition-colors hover:bg-white hover:text-[#1f39a1] dark:text-blue-400 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                >
                  {item.icon}
                </button>
              ))}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-[38px] w-full resize-none bg-white px-3 py-2 text-[13px] text-gray-800 outline-none dark:bg-slate-900 dark:text-white"
            />
          </div>
        </label>

        <label className="mb-7 flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-gray-200 bg-white text-[13px] font-medium text-[#4a5568] transition-colors hover:border-[#1f39a1]/30 hover:bg-[#f0f4ff]/60 hover:text-[#1f39a1] dark:border-slate-700 dark:bg-slate-900 dark:text-gray-400 dark:hover:border-blue-500/30 dark:hover:bg-slate-700/50 dark:hover:text-blue-400">
          <CloudUploadOutlinedIcon sx={{ fontSize: 16 }} />
          {file ? file.name : "Yuklash"}
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="h-8 rounded-md border border-gray-200 bg-white px-4 text-[13px] font-medium text-[#4a5568] transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-8 rounded-md bg-[#1f39a1] px-4 text-[13px] font-semibold text-white shadow-md shadow-blue-200 transition-colors hover:bg-[#162870] disabled:opacity-60 dark:bg-blue-600 dark:shadow-none dark:hover:bg-blue-700"
          >
            {loading ? "Yuklanmoqda..." : "E'lon qilish"}
          </button>
        </div>
      </form>
    </div>
  );
}
