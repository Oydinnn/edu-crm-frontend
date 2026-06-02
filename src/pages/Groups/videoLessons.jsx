import { useEffect, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import api from "../../services/axios";
import AddVideolesson from "./AddVideolesson";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const mon = [
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
  ][d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${mon}, ${year}`;
}

const getVideoUrl = (filename) => {
  if (!filename) return "";
  const base = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:3000";
  return `${base}/files/files/${filename}`;
};

export default function VideoLessons({ guruh }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchVideos = () => {
    if (!guruh?.id) return;
    setLoading(true);
    api
      .get(`/files/${guruh.id}`)
      .then((res) => {
        setVideos(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Error loading group videos", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVideos();
  }, [guruh?.id]);

  function formatSize(mb) {
    if (mb === undefined || mb === null) return "0.00 MB";
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f39a1]" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Upper header section with Qo'shish button (Matches first image top-right alignment inside tabs row) */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2 text-sm font-semibold text-white bg-[#1f39a1] rounded-lg shadow-md shadow-blue-200 hover:bg-[#162870] transition-all duration-200"
        >
          Qo'shish
        </button>
      </div>

      {/* Videos List Table */}
      <div className="w-full overflow-x-auto border border-gray-100 rounded-xl bg-white shadow-sm">
        <div className="min-w-[980px]">
          {/* Table header */}
          <div className="flex items-center px-4 py-3.5 border-b border-gray-200 bg-[#f0f4ff]">
            <div className="w-64 text-sm font-semibold text-[#1f39a1]">Video nomi</div>
            <div className="flex-1 text-sm font-semibold text-[#1f39a1] pl-4">Dars nomi</div>
            <div className="w-24 text-sm font-semibold text-[#1f39a1] text-center">Status</div>
            <div className="w-36 text-sm font-semibold text-[#1f39a1] text-center">Dars sanasi</div>
            <div className="w-28 text-sm font-semibold text-[#1f39a1] text-center">Hajmi</div>
            <div className="w-36 text-sm font-semibold text-[#1f39a1] text-center">Qo'shilgan vaqti</div>
            <div className="w-20 text-sm font-semibold text-[#1f39a1] text-center">Harakatlar</div>
          </div>

          {/* Table rows */}
          <div className="bg-white divide-y divide-gray-50">
            {videos.length > 0 ? (
              videos.map((video, idx) => (
                <div
                  key={video.id || idx}
                  className="flex items-center px-4 py-3.5 even:bg-gray-50/70 hover:bg-[#f0f4ff]/40 transition-colors"
                >
                  <div className="w-64 min-w-0">
                    <button
                      type="button"
                      onClick={() => setActiveVideo(video)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f39a1] hover:text-[#162870] hover:underline cursor-pointer truncate max-w-full text-left"
                    >
                      <PlayArrowIcon style={{ fontSize: 18 }} />
                      <span className="truncate">{video.originalname || video.video_url || "—"}</span>
                    </button>
                  </div>
                  <div className="flex-1 min-w-0 pl-4">
                    <span className="text-sm font-medium text-gray-800 truncate block">
                      {video.lesson?.topic || "—"}
                    </span>
                  </div>
                  <div className="w-24 text-center">
                    <span className="inline-flex items-center rounded-md bg-[#f0f4ff] px-2.5 py-0.5 text-xs font-semibold text-[#1f39a1] border border-[#1f39a1]/10">
                      Tayyor
                    </span>
                  </div>
                  <div className="w-36 text-center text-sm font-medium text-[#4a5568]">
                    {formatDate(video.lesson?.created_at)}
                  </div>
                  <div className="w-28 text-center text-sm font-semibold text-[#4a5568]">
                    {formatSize(video.size_mb)}
                  </div>
                  <div className="w-36 text-center text-sm font-medium text-[#4a5568]">
                    {formatDate(video.created_at)}
                  </div>
                  <div className="w-20 flex justify-center">
                    <button
                      type="button"
                      aria-label="Amallar"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                      <MoreVertIcon style={{ fontSize: 18 }} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-12 text-center text-sm text-gray-400">
                Hozircha videolar mavjud emas
              </div>
            )}
          </div>
        </div>
      </div>

      <AddVideolesson
        open={isUploadOpen}
        guruh={guruh}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={fetchVideos}
      />

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <h3 className="text-base font-bold text-gray-800 truncate pr-8">
                {activeVideo.lesson?.topic || activeVideo.originalname || activeVideo.video_url || "Video player"}
              </h3>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <span className="text-xl font-medium">&times;</span>
              </button>
            </div>

            {/* Modal Content - Video Player */}
            <div className="bg-black flex-1 flex items-center justify-center p-1">
              <video
                src={getVideoUrl(activeVideo.video_url)}
                controls
                autoPlay
                className="w-full h-auto max-h-[70vh] rounded-b-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
