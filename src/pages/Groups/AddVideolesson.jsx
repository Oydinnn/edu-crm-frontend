import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import api from "../../services/axios";

const videoFormats = ".mp4, .webm, .mpeg, .avi, .mkv, .m4v, .ogm, .mov, .mpg";

export default function AddVideolesson({ open, guruh, onClose, onUploaded }) {
  const fileInputRef = useRef(null);
  const lessonDropdownRef = useRef(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoName, setVideoName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [lessonDropdownOpen, setLessonDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (!open || !guruh?.id) return;

    api
      .get(`/homework/group/${guruh.id}`)
      .then((res) => {
        const data = res.data?.data ?? {};
        const groupLessons = Array.isArray(data.groupFormated) ? data.groupFormated : [];
        setLessons(groupLessons);
        setSelectedLessonId(groupLessons[0]?.id ? String(groupLessons[0].id) : "");
      })
      .catch((err) => {
        console.error("Error loading lessons", err);
      });
  }, [open, guruh?.id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!lessonDropdownRef.current?.contains(e.target)) {
        setLessonDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!open) return null;

  const selectedLesson = lessons.find((lesson) => String(lesson.id) === String(selectedLessonId));

  const handleClose = () => {
    if (uploading) return;
    setSelectedFile(null);
    setVideoName("");
    setUploadError("");
    setLessonDropdownOpen(false);
    onClose();
  };

  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setVideoName(file.name);
    setUploadError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Fayl tanlanmagan");
      return;
    }
    if (!selectedLessonId) {
      setUploadError("Dars tanlanmagan");
      return;
    }

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("originalname", videoName.trim() || selectedFile.name);

    try {
      await api.post(`/files/upload?groupId=${guruh.id}&lessonId=${selectedLessonId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded?.();
      handleClose();
    } catch (err) {
      console.error("Upload error", err);
      setUploadError("Video yuklashda xatolik yuz berdi. Faqat video formatlari ruxsat etiladi.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/45 px-4 py-6">
      <div className="w-full max-w-5xl rounded-xl bg-white shadow-2xl border border-gray-100 overflow-visible">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Qo'shish</h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all disabled:opacity-50"
            aria-label="Yopish"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <div className="px-6">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex min-h-[156px] w-full flex-col items-center justify-center rounded-lg border border-gray-100 bg-white px-6 text-center transition-all ${
              dragActive ? "border-[#1f39a1] bg-[#f0f4ff]" : "hover:border-[#1f39a1]/30 hover:bg-[#f0f4ff]/30"
            }`}
          >
            <Inventory2OutlinedIcon className="text-[#1f39a1]" sx={{ fontSize: 42 }} />
            <span className="mt-5 text-sm font-semibold text-gray-800">
              Videofaylni yuklash uchun ushbu hudud ustiga bosing yoki faylni shu yerga olib keling
            </span>
            <span className="mt-2 text-sm font-medium text-[#4a5568]">
              Videofayl {videoFormats} formatlaridan birida bo'lishi kerak
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </div>

        {selectedFile && (
          <div className="mt-2 border-t border-gray-100">
            <div className="hidden grid-cols-[minmax(160px,1fr)_minmax(220px,1.4fr)_minmax(220px,1.4fr)_80px] items-start gap-4 px-8 py-4 text-sm font-semibold text-[#1f39a1] md:grid">
              <div>File name</div>
              <div>
                <span className="text-red-500">*</span> Dars
              </div>
              <div>
                <span className="text-red-500">*</span> Video nomi
              </div>
              <div>Actions</div>
            </div>

            <div className="grid grid-cols-1 items-center gap-4 px-6 pb-8 pt-4 text-sm text-[#4a5568] md:grid-cols-[minmax(160px,1fr)_minmax(220px,1.4fr)_minmax(220px,1.4fr)_80px] md:px-8 md:pt-0">
              <div className="min-w-0 truncate font-medium text-gray-800">{selectedFile.name}</div>
              <div ref={lessonDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setLessonDropdownOpen((value) => !value)}
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-gray-100 bg-white px-3 text-left text-sm font-medium text-[#4a5568] outline-none transition-all hover:bg-gray-50 focus:border-[#1f39a1] focus:ring-2 focus:ring-[#f0f4ff]"
                >
                  <span className="truncate">{selectedLesson?.topic || "Darsni tanlang"}</span>
                  <KeyboardArrowDownIcon className="text-gray-400" sx={{ fontSize: 20 }} />
                </button>
                {lessonDropdownOpen && (
                  <div className="absolute left-0 right-0 top-11 z-[90] max-h-64 overflow-y-auto rounded-lg border border-gray-100 bg-white py-1 shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLessonId("");
                        setLessonDropdownOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm font-medium transition-all ${
                        !selectedLessonId
                          ? "bg-[#f0f4ff] text-[#1f39a1]"
                          : "text-[#4a5568] hover:bg-gray-50"
                      }`}
                    >
                      Darsni tanlang
                    </button>
                    {lessons.map((lesson) => (
                      <button
                        type="button"
                        key={lesson.id}
                        onClick={() => {
                          setSelectedLessonId(String(lesson.id));
                          setLessonDropdownOpen(false);
                        }}
                        className={`block w-full px-3 py-2 text-left text-sm font-medium transition-all ${
                          String(lesson.id) === String(selectedLessonId)
                            ? "bg-[#f0f4ff] text-[#1f39a1]"
                            : "text-[#4a5568] hover:bg-gray-50"
                        }`}
                      >
                        {lesson.topic || "Nomsiz dars"}
                      </button>
                    ))}
                  </div>
                )}
                <KeyboardArrowDownIcon
                  className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 text-gray-300"
                  sx={{ fontSize: 20 }}
                />
              </div>
              <input
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-100 bg-white px-3 text-sm font-medium text-[#4a5568] outline-none transition-all focus:border-[#1f39a1] focus:ring-2 focus:ring-[#f0f4ff]"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setVideoName("");
                  setUploadError("");
                }}
                disabled={uploading}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 text-gray-500 hover:border-red-100 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
                aria-label="Faylni olib tashlash"
              >
                <DeleteOutlineIcon sx={{ fontSize: 20 }} />
              </button>
            </div>
          </div>
        )}

        {uploadError && (
          <div className="px-8 pb-2 text-sm font-semibold text-red-500">{uploadError}</div>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
            className="h-10 rounded-lg border border-gray-100 bg-white px-5 text-sm font-semibold text-[#4a5568] hover:bg-gray-50 hover:text-gray-800 transition-all disabled:opacity-50"
          >
            Bekor qilish
          </button>
          {selectedFile && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || !selectedLessonId}
              className="h-10 rounded-lg bg-[#1f39a1] px-5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-[#162870] transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Yuklanmoqda..." : "Fayllarni yuklash"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
