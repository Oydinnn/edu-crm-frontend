import { useMemo, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlashOnIcon from "@mui/icons-material/FlashOn";

const STATUS_TABS = [
  { key: "waiting", label: "Kutayotganlar", count: null },
  { key: "returned", label: "Qaytarilganlar", count: null },
  { key: "accepted", label: "Qabul qilinganlar", count: 12 },
  { key: "not_done", label: "Bajarilmagan", count: null },
];

function formatExamDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month}, ${year} ${hour}:${minute}`;
}

function buildExamTime(startAt, endAt) {
  return `${formatExamDate(startAt)} - ${formatExamDate(endAt)}`;
}

const acceptedStudents = [
  {
    id: 1,
    name: "Dilshodbek O'ktamjon o'g'li Tokhirov",
    submitted_at: "2026-04-24T12:56:00",
    checked_at: "2026-04-27T10:30:00",
    score: 65,
    file_count: 0,
    answer: "https://finsweet-na8zmwyg-n27.vercel.app",
    status: "Qabul qilindi",
  },
  {
    id: 2,
    name: "Rahmonbergan Otabek o'g'li Mahmudov",
    submitted_at: "2026-04-24T10:42:00",
    checked_at: "2026-04-24T11:32:00",
    score: 85,
    file_count: 1,
    answer: "figma.com/design/ra1Ax8fdHFqVufDIjvYCZ0/AP-BOOTSTRAP",
    status: "Qabul qilindi",
  },
  {
    id: 3,
    name: "Mirsaid Abduqulov",
    submitted_at: "2026-04-24T11:59:00",
    checked_at: "2026-04-24T14:50:00",
    score: 70,
    file_count: 0,
    answer: "Loyiha havolasi yuborildi",
    status: "Qabul qilindi",
  },
  {
    id: 4,
    name: "Oydin Kamolovna Qalandarova",
    submitted_at: "2026-04-24T09:27:00",
    checked_at: "2026-04-29T12:17:00",
    score: 100,
    file_count: 2,
    answer: "https://www.figma.com/design/qQTcMCAxugyDWfLXNTGe17/G8--Copy--Copy",
    status: "Qabul qilindi",
  },
  {
    id: 5,
    name: "Guliza Ayitqulova",
    submitted_at: "2026-04-24T12:41:00",
    checked_at: "2026-04-24T16:40:00",
    score: 70,
    file_count: 0,
    answer: "https://finsweet-na8zmwyg-n27.vercel.app",
    status: "Qabul qilindi",
  },
  {
    id: 6,
    name: "Nozima Abdugapparova",
    submitted_at: "2026-04-24T09:27:00",
    checked_at: "2026-04-24T09:47:00",
    score: 85,
    file_count: 1,
    answer: "Imtihon topshirildi",
    status: "Qabul qilindi",
  },
  {
    id: 7,
    name: "Nosirxon Ziyovutdinov",
    submitted_at: "2026-04-24T10:14:00",
    checked_at: "2026-04-24T10:31:00",
    score: 90,
    file_count: 0,
    answer: "https://finsweet-na8zmwyg-n27.vercel.app",
    status: "Qabul qilindi",
  },
  {
    id: 8,
    name: "Abdulaziz Azizov",
    submitted_at: "2026-04-24T12:07:00",
    checked_at: "2026-04-24T14:43:00",
    score: 95,
    file_count: 0,
    answer: "Loyiha tugallandi",
    status: "Qabul qilindi",
  },
];

function EmptyState() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
      <Inventory2OutlinedIcon className="text-gray-200" sx={{ fontSize: 54 }} />
      <p className="mt-4 text-sm font-medium text-gray-400">Ma'lumot topilmadi</p>
    </div>
  );
}

function ExamResult({ student, onBack }) {
  return (
    <div className="w-full max-w-[1100px]">
      <button
        type="button"
        onClick={onBack}
        className="mb-12 inline-flex items-center gap-4 text-left"
      >
        <span className="text-2xl font-bold text-gray-900">Qabul qilinganlar</span>
        <span className="text-3xl font-light text-gray-400">/</span>
        <span className="text-2xl font-medium text-[#4a5568]">Imtihon</span>
      </button>

      <div className="mb-10 rounded-xl border border-gray-100 bg-white p-7 shadow-sm">
        <h3 className="mb-6 text-2xl font-bold text-gray-800">Imtihon vazifasi</h3>
        <div className="rounded-lg bg-gray-50/70 px-8 py-7">
          <p className="mb-3 text-xl font-medium text-gray-400">Imtihon izohi:</p>
          <div className="space-y-7 text-xl font-medium leading-10 text-gray-800">
            <p>loyihalar</p>
            <p>
              1) https://www.figma.com/design/RKfTUD7MP5SbWeB4tRJObc/Finsweet-Agency--Copy---Copy-?node-id=1-2057&amp;t=LsoIYD5d086yfbme-0
            </p>
            <p>
              2) figma.com/design/ra1Ax8fdHFqVufDIjvYCZ0/AP-BOOTSTRAP?node-id=0-1&amp;p=f&amp;t=Hr520yGTgVzY9jZY-0
            </p>
            <p>
              3) https://www.figma.com/design/qQTcMCAxugyDWfLXNTGe17/G8--Copy---Copy-?node-id=0-1&amp;p=f&amp;t=RH1gcoXrXi3CpoKo-0
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-[#f5f6fb] p-7 shadow-sm">
        <h3 className="mb-8 text-2xl font-bold text-gray-800">{student.name}</h3>

        <div className="mb-6 grid grid-cols-3 gap-10 rounded-xl bg-white px-8 py-7 shadow-sm">
          <div>
            <p className="mb-2 text-xl font-medium text-gray-400">Vaqti:</p>
            <p className="text-xl font-semibold text-gray-800">{formatExamDate(student.submitted_at)}</p>
          </div>
          <div>
            <p className="mb-2 text-xl font-medium text-gray-400">Fayllar soni:</p>
            <p className="text-xl font-semibold text-gray-800">{student.file_count}</p>
          </div>
          <div>
            <p className="mb-2 text-xl font-medium text-gray-400">Status:</p>
            <span className="inline-flex rounded-md border border-[#1f39a1]/20 bg-white px-3 py-1 text-lg font-semibold text-[#1f39a1]">
              {student.status}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white px-8 py-8 shadow-sm">
          <div className="rounded-lg border-l-4 border-[#1f39a1] bg-gray-50/70 px-7 py-6">
            <p className="mb-3 text-xl font-medium text-gray-400">Uyga vazifa izohi:</p>
            <p className="break-words text-xl font-semibold leading-9 text-gray-800">{student.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AcceptedStudentsTable({ onStudentSelect }) {
  return (
    <div>
      <div className="grid grid-cols-[1.7fr_1fr_1fr_180px_50px] border-b border-gray-100 px-5 py-6 text-sm font-semibold text-[#4a5568]">
        <div>O'quvchi ismi</div>
        <div>Topshirilgan vaqti</div>
        <div>Tekshirilgan vaqti</div>
        <div>Ball</div>
        <div />
      </div>

      <div className="divide-y divide-gray-100">
        {acceptedStudents.map((student, idx) => (
          <div
            key={student.id}
            className={`grid grid-cols-[1.7fr_1fr_1fr_180px_50px] items-center px-5 py-5 text-sm transition-colors ${
              idx === 1 ? "bg-gray-50" : "bg-white"
            } hover:bg-[#f0f4ff]/40`}
          >
            <button
              type="button"
              onClick={() => onStudentSelect(student)}
              className="text-left font-medium text-gray-900 hover:text-[#1f39a1] hover:underline"
            >
              {student.name}
            </button>
            <div className="font-medium text-gray-800">{formatExamDate(student.submitted_at)}</div>
            <div className="font-medium text-gray-800">{formatExamDate(student.checked_at)}</div>
            <div className="flex items-center gap-1 font-medium text-gray-900">
              <FlashOnIcon className="text-orange-400" sx={{ fontSize: 16 }} />
              {student.score}
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#4a5568] transition-colors hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
              aria-label="Tahrirlash"
            >
              <EditIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExaminationDetail({ exam, onBack }) {
  const [activeTab, setActiveTab] = useState("accepted");
  const [selectedStudent, setSelectedStudent] = useState(null);

  if (selectedStudent) {
    return (
      <ExamResult
        student={selectedStudent}
        onBack={() => {
          setSelectedStudent(null);
          setActiveTab("accepted");
        }}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#4a5568] transition-all hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
          aria-label="Orqaga"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Examination</h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-6 border-b border-gray-100 px-7 py-6">
          <div className="flex flex-wrap gap-x-16 gap-y-5">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#4a5568]">Mavzu</p>
              <p className="text-lg font-semibold text-gray-800">{exam.title}</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-[#4a5568]">Imtihon vaqti</p>
              <p className="text-lg font-semibold text-gray-800">
                {buildExamTime(exam.start_at, exam.end_at)}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled
            className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-gray-300"
          >
            E'lon qilish
          </button>
        </div>

        <div className="px-7 pt-7">
          <div className="flex items-center gap-10 border-b border-gray-100">
            {STATUS_TABS.map((tab) => (
              <button
                type="button"
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative pb-4 text-sm font-semibold transition-all ${
                  activeTab === tab.key ? "text-gray-800" : "text-[#4a5568] hover:text-gray-800"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-gray-800">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#1f39a1]" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "accepted" ? (
            <AcceptedStudentsTable onStudentSelect={setSelectedStudent} />
          ) : (
            <>
              <div className="grid grid-cols-[1fr_1.5fr] border-b border-gray-100 px-5 py-6 text-sm font-semibold text-[#4a5568]">
                <div>O'quvchi ismi</div>
                <div>Imtihon jo'natilgan vaqt</div>
              </div>

              <EmptyState />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ExaminationList({ exams, onSelect }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="grid grid-cols-[1.4fr_1.8fr_130px_90px] items-center border-b border-gray-200 bg-[#f0f4ff] px-5 py-3.5 text-sm font-semibold text-[#1f39a1]">
        <div>Mavzu</div>
        <div>Imtihon vaqti</div>
        <div className="text-center">Holat</div>
        <div className="text-center">Amallar</div>
      </div>

      <div className="divide-y divide-gray-50">
        {exams.map((exam) => (
          <button
            type="button"
            key={exam.id}
            onClick={() => onSelect(exam)}
            className="grid w-full grid-cols-[1.4fr_1.8fr_130px_90px] items-center px-5 py-5 text-left transition-all hover:bg-[#f0f4ff]/40"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">{exam.title}</p>
              <p className="mt-1 text-xs font-medium text-[#4a5568]">{exam.description}</p>
            </div>
            <div className="text-sm font-medium text-[#4a5568]">
              {buildExamTime(exam.start_at, exam.end_at)}
            </div>
            <div className="text-center">
              <span className="inline-flex rounded-md border border-[#1f39a1]/10 bg-[#f0f4ff] px-2.5 py-0.5 text-xs font-semibold text-[#1f39a1]">
                {exam.status}
              </span>
            </div>
            <div className="flex justify-center">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400">
                <MoreVertIcon sx={{ fontSize: 18 }} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Examination({ guruh }) {
  const [selectedExam, setSelectedExam] = useState(null);

  const exams = useMemo(
    () => [
      {
        id: 1,
        title: "Examination",
        description: guruh?.name || "Guruh imtihoni",
        start_at: "2026-04-24T09:25:00",
        end_at: "2026-04-24T13:00:00",
        status: "Tayyor",
      },
    ],
    [guruh?.name],
  );

  if (selectedExam) {
    return <ExaminationDetail exam={selectedExam} onBack={() => setSelectedExam(null)} />;
  }

  return <ExaminationList exams={exams} onSelect={setSelectedExam} />;
}
