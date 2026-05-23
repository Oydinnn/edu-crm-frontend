// // showicon ishlagani faqat table widthi kichraydi

// import { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   IconButton,
//   Avatar,
//   Stack,
//   Divider,
//   Chip,
//   Button,
//   CircularProgress,
//   Skeleton,
// } from "@mui/material";
// import {
//   Close,
//   Edit,
//   Phone,
//   Email,
//   Cake,
//   LocationOn,
//   CalendarToday,
//   Person,
// } from "@mui/icons-material";
// import api from "../../services/axios";

// function getPhotoUrl(photo) {
//   if (!photo) return null;
//   if (photo.startsWith("http")) return photo;
//   const base =
//     import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
//     "http://localhost:3000";
//   return `${base}/uploads/${photo}`;
// }

// const AVATAR_COLORS = [
//   { bg: "#ede9fe", color: "#5b21b6" },
//   { bg: "#ecfdf5", color: "#065f46" },
//   { bg: "#fef3c7", color: "#92400e" },
//   { bg: "#fee2e2", color: "#991b1b" },
//   { bg: "#e0f2fe", color: "#0c4a6e" },
// ];

// function getInitials(name = "") {
//   return name
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// function formatDate(iso) {
//   if (!iso) return "—";
//   return new Date(iso).toLocaleDateString("uz-UZ", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// }

// // ─── Info Row ────────────────────────────────────────────────────────────────
// function InfoRow({ icon, label, value }) {
//   return (
//     <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 1.2 }}>
//       <Box
//         sx={{
//           width: 32,
//           height: 32,
//           borderRadius: 1.5,
//           bgcolor: "#f3f4f6",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexShrink: 0,
//         }}
//       >
//         {icon}
//       </Box>
//       <Box>
//         <Typography
//           fontSize={11}
//           color="text.secondary"
//           fontWeight={500}
//           mb={0.2}
//         >
//           {label}
//         </Typography>
//         <Typography fontSize={13} fontWeight={500} color="#111827">
//           {value || "—"}
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

// // ─── Modal ────────────────────────────────────────────────────────────────────
// export default function StudentShowModal({ student, onClose, onEdit }) {
//   const [detail, setDetail] = useState(null);
//   const [loading, setLoading] = useState(false);
//   console.log(student, onClose, onEdit);

//   useEffect(() => {
//     if (!student?.id) return;
//     setDetail(null);
//     setLoading(true);
//     api
//       .get(`/students/${student.id}`)
//       .then((res) => {
//         const d = res.data.data;
//         // created_at detail da yo'q, listdagini olish
//         setDetail({ ...d, created_at: d.created_at || student.created_at });
//       })
//       .catch(() => setDetail(student))
//       .finally(() => setLoading(false));
//   }, [student?.id]);

//   const data = detail || student;
//   const av = data
//     ? AVATAR_COLORS[data.id % AVATAR_COLORS.length]
//     : AVATAR_COLORS[0];

//   return (
//     <Drawer
//       anchor="right"
//       open={!!student}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: { xs: "100%", sm: 420 },
//           display: "flex",
//           flexDirection: "column",
//         },
//       }}
//     >
//       {/* ── Header ── */}
//       <Box
//         sx={{
//           px: 3,
//           py: 2.5,
//           borderBottom: "1px solid #e5e7eb",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Typography fontWeight={600} fontSize={16}>
//           Talaba ma'lumotlari
//         </Typography>
//         <IconButton size="small" onClick={onClose}>
//           <Close fontSize="small" />
//         </IconButton>
//       </Box>

//       {/* ── Body ── */}
//       <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 3 }}>
//         {loading ? (
//           <Stack spacing={2}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <Skeleton variant="circular" width={64} height={64} />
//               <Box sx={{ flex: 1 }}>
//                 <Skeleton width="60%" height={22} />
//                 <Skeleton width="40%" height={18} />
//               </Box>
//             </Box>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <Skeleton key={i} height={48} sx={{ borderRadius: 2 }} />
//             ))}
//           </Stack>
//         ) : data ? (
//           <>
//             {/* Avatar + ism */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 2,
//                 bgcolor: "#f9fafb",
//                 borderRadius: 3,
//                 p: 2,
//                 mb: 3,
//               }}
//             >
//               {data.photo ? (
//                 <Avatar
//                   src={getPhotoUrl(data.photo)}
//                   sx={{ width: 64, height: 64 }}
//                 />
//               ) : (
//                 <Avatar
//                   sx={{
//                     width: 64,
//                     height: 64,
//                     bgcolor: av.bg,
//                     color: av.color,
//                     fontSize: 22,
//                     fontWeight: 700,
//                   }}
//                 >
//                   {getInitials(data.full_name)}
//                 </Avatar>
//               )}
//               <Box>
//                 <Typography fontWeight={700} fontSize={16}>
//                   {data.full_name || "—"}
//                 </Typography>
//                 <Chip
//                   label={data.status || "active"}
//                   size="small"
//                   sx={{
//                     mt: 0.5,
//                     fontSize: 11,
//                     height: 20,
//                     bgcolor: "#dcfce7",
//                     color: "#166534",
//                     fontWeight: 600,
//                   }}
//                 />
//               </Box>
//             </Box>

//             <Divider sx={{ mb: 2 }} />

//             {/* Ma'lumotlar */}
//             <Stack divider={<Divider flexItem />}>
//               <InfoRow
//                 icon={<Phone sx={{ fontSize: 15, color: "#6b7280" }} />}
//                 label="Telefon raqam"
//                 value={data.phone}
//               />
//               <InfoRow
//                 icon={<Email sx={{ fontSize: 15, color: "#6b7280" }} />}
//                 label="Email"
//                 value={data.email}
//               />
//               <InfoRow
//                 icon={<LocationOn sx={{ fontSize: 15, color: "#6b7280" }} />}
//                 label="Manzil"
//                 value={data.address}
//               />
//               <InfoRow
//                 icon={<Cake sx={{ fontSize: 15, color: "#6b7280" }} />}
//                 label="Tug'ilgan sana"
//                 value={formatDate(data.birth_date)}
//               />
//               <InfoRow
//                 icon={<CalendarToday sx={{ fontSize: 15, color: "#6b7280" }} />}
//                 label="Ro'yxatga olingan"
//                 value={formatDate(data.created_at)}
//               />
//             </Stack>

           

//             {data.groups?.length > 0 && (
//               <Box sx={{ mt: 3 }}>
//                 <Typography
//                   fontSize={12}
//                   fontWeight={600}
//                   color="text.secondary"
//                   mb={1}
//                 >
//                   GURUHLAR
//                 </Typography>
//                 <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.8}>
//                   {data.groups.map((g, i) => (
//                     <Chip 
//                     key={g.id || i} 
//                     label={g.name || `Guruh ${i + 1}`} 
//                     size="small"
//                       sx={{
//                         bgcolor: "#ede9fe",
//                         color: "#5b21b6",
//                         fontSize: 12,
//                         fontWeight: 500,
//                       }}
//                     />
//                   ))}
//                 </Stack>
//               </Box>
//             )}
//           </>
//         ) : null}
//       </Box>

//       {/* ── Footer ── */}
//       <Box
//         sx={{
//           px: 3,
//           py: 2,
//           borderTop: "1px solid #e5e7eb",
//           display: "flex",
//           gap: 1.5,
//           bgcolor: "#fafafa",
//         }}
//       >
//         <Button
//           fullWidth
//           variant="outlined"
//           onClick={onClose}
//           sx={{
//             textTransform: "none",
//             borderRadius: 2,
//             borderColor: "#d1d5db",
//             color: "#374151",
//           }}
//         >
//           Yopish
//         </Button>
//         <Button
//           fullWidth
//           variant="contained"
//           startIcon={<Edit fontSize="small" />}
//           onClick={() => onEdit(data)}
//           disabled={loading || !data}
//           sx={{
//             textTransform: "none",
//             borderRadius: 2,
//             bgcolor: "#1f39a1",
//             "&:hover": { bgcolor: "#162d80" },
//           }}
//         >
//           Tahrirlash
//         </Button>
//       </Box>
//     </Drawer>
//   );
// }





























// // boshqarish dropdown ishladi, belgilanganda bitta-bitta belgilanyapti 14.05.2026


// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useRef, useEffect } from "react";
// import Logo from "../assets/imgs/logo.png";

// // MUI Icons import
// import HomeIcon from "@mui/icons-material/Home";
// import SchoolIcon from "@mui/icons-material/School";
// import GroupIcon from "@mui/icons-material/Group";
// import PersonIcon from "@mui/icons-material/Person";
// import SettingsIcon from "@mui/icons-material/Settings";
// import BookIcon from "@mui/icons-material/Book";
// import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
// import PeopleIcon from "@mui/icons-material/People";
// import EmailIcon from "@mui/icons-material/Email";
// import WarningIcon from "@mui/icons-material/Warning";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { useSidebar } from "../contexts/SidebarContext";

// export default function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isCollapsed, setIsCollapsed, isSettingsOpen, setIsSettingsOpen } =
//     useSidebar();

//   const dropdownRef = useRef(null);
//   const prevSettingsActive = useRef(false);

//   const menuItems = [
//     { id: "dashboard", name: "Asosiy", icon: HomeIcon, path: "/dashboard" },
//     {
//       id: "teachers",
//       name: "O'qituvchilar",
//       icon: SchoolIcon,
//       path: "/teachers",
//     },
//     { id: "groups", name: "Guruhlar", icon: GroupIcon, path: "/groups" },
//     { id: "students", name: "Talabalar", icon: PersonIcon, path: "/students" },
//   ];

//   const settingsItems = [
//     {
//       id: "courses",
//       name: "Kurslar",
//       icon: BookIcon,
//       path: "/settings/courses",
//     },
//     {
//       id: "rooms",
//       name: "Xonalar",
//       icon: MeetingRoomIcon,
//       path: "/settings/rooms",
//     },
//     {
//       id: "staff",
//       name: "Hodimlar",
//       icon: PeopleIcon,
//       path: "/settings/staff",
//     },
//     {
//       id: "messages",
//       name: "Xabar Yuborish",
//       icon: EmailIcon,
//       path: "/settings/messages",
//     },
//   ];

//   const isSettingsActive = location.pathname.startsWith("/settings");
  

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsSettingsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [setIsSettingsOpen]);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//     if (!isCollapsed) setIsSettingsOpen(false);
//   };

//   const handleBoshqarishClick = (e) => {
//     e.preventDefault();

//     // 1. Sidebar yopiq bo'lsa, ochamiz
//     if (isCollapsed) setIsCollapsed(false);

//     // 2. Dropdown holatini o'zgartiramiz (ochish/yopish)
//     setIsSettingsOpen(!isSettingsOpen);

    
//   };

//   return (
//     <div className="flex bg-gray-50/50">
//       <aside
//         className={`bg-white shadow-lg fixed h-screen top-0 left-0 flex flex-col justify-between transition-all duration-300 z-50 ${isCollapsed ? "w-20" : "w-64"}`}
//       >
//         <div
//           className={`${isCollapsed ? "p-3" : "p-6"} flex-1 overflow-y-auto no-scrollbar`}
//         >
//           <div
//             className={`flex items-center mb-8 ${isCollapsed ? "flex-col gap-3" : "justify-between"}`}
//           >
//             <NavLink
//               to="/dashboard"
//               onClick={() => setIsSettingsOpen(false)}
//               className="flex items-center gap-2 p-2"
//             >
//               <img src={Logo} className="w-8 h-8" alt="Logo" />
//               {!isCollapsed && (
//                 <h1 className="text-xl font-bold text-[#4a5568]">EduCRM</h1>
//               )}
//             </NavLink>
//             <button
//               onClick={toggleSidebar}
//               className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1f39a1] text-white"
//             >
//               {isCollapsed ? (
//                 <ChevronRightIcon className="w-5 h-5" />
//               ) : (
//                 <ChevronLeftIcon className="w-5 h-5" />
//               )}
//             </button>
//           </div>

//           <nav>
//             <ul className="space-y-2">
//               {/* Asosiy menyu elementlari */}
//               {menuItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive =
//   (item.path === "/dashboard" &&
//     (location.pathname === "/dashboard" || location.pathname === "/")) ||
//   location.pathname === item.path;

//                 return (
//                   <li key={item.id}>
//                     <NavLink
//                       to={item.path}
//                       onClick={() => setIsSettingsOpen(false)}
//                       className={`w-full flex items-center rounded-lg transition-all duration-300 outline-none 
//                       ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"}
//                      ${isActive && !isSettingsOpen
//                         ? "bg-[#1f39a1] text-white shadow-md"
//                         : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                       }`}
//                     >
//                       <Icon className="w-5 h-5" />
//                       {!isCollapsed && <span>{item.name}</span>}
//                     </NavLink>
//                   </li>
//                 );
//               })}

//               {/* Boshqarish tugmasi va Dropdown */}
//               <li ref={dropdownRef} className="relative">
//                 <button
//                   onClick={handleBoshqarishClick}
//                   className={`w-full flex items-center rounded-lg transition-all duration-500 outline-none ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"} 
//                   ${isSettingsActive || isSettingsOpen  ? "bg-[#1f39a1] text-white shadow-md" : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"}`}
//                 >
//                   <SettingsIcon
//                     className={`w-5 h-5 transition-transform ${isSettingsOpen && !isCollapsed ? "rotate-90" : ""}`}
//                   />
//                   {!isCollapsed && (
//                     <span className="flex-1 text-left">Boshqarish</span>
//                   )}
//                   {!isCollapsed && (
//                     <span
//                       className={`text-[10px] transition-transform ${isSettingsOpen ? "" : "rotate-90"}`}
//                     >
//                       ▶
//                     </span>
//                   )}
//                 </button>

//                 {/* Dropdown menyu */}
//                 {!isCollapsed && (
//                   <div
//                     className={`fixed left-64 top-0 w-64 h-full bg-white shadow-2xl z-20 py-3 border-l border-gray-100 flex flex-col 
//     transition-all duration-500 ease-in-out transform
//     ${isSettingsOpen ? "translate-x-0 opacity-100 visible" : "-translate-x-4 opacity-0 invisible"}`}
//                   >
//                     {/* Sarlavha qismi */}
//                     <div className="px-4 pb-3 border-b font-semibold text-gray-800 flex justify-between items-center">
//                       <span>Menu</span>
//                       <button
//                         className="text-gray-400 hover:text-red-500 transition-colors"
//                         onClick={() => setIsSettingsOpen(false)}
//                       >
//                         ✕
//                       </button>
//                     </div>

//                     {/* Elementlar ro'yxati */}
//                     <div className="mt-4 space-y-1">
//                       {settingsItems.map((item) => (
//                         <NavLink
//                           key={item.id}
//                           to={item.path}
//                           onClick={() => setIsSettingsOpen(false)}
//                           className={({ isActive }) =>
//                             `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all duration-300
//                             ${isActive && !isSettingsOpen  ? "bg-[#1f39a1] text-white" : "text-gray-600 hover:bg-blue-50"}`
//                           }
//                         >
//                           <item.icon className="w-4 h-4" />
//                           {item.name}
//                         </NavLink>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//               </li>
//             </ul>
//           </nav>
//         </div>

//         {/* Obuna kartasi (Tolov qismi) */}
//         {!isCollapsed && (
//           <div className="p-6">
//             <div className="bg-gradient-to-r from-[#f0f4ff] to-red-50 rounded-xl shadow-sm p-4">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">Obuna</h3>
//                   <p className="text-gray-600 text-sm">Obunangiz tugagan</p>
//                 </div>
//                 <WarningIcon className="text-2xl text-orange-500" />
//               </div>

//               <div className="mb-4">
//                 <div className="flex justify-between text-sm mb-1">
//                   <span>Qolgan kunlar</span>
//                   <span className="font-semibold text-[#1f39a1]">5 / 30</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-[#1f39a1] h-2 rounded-full"
//                     style={{ width: "16%" }}
//                   />
//                 </div>
//               </div>
//               <button className="w-full bg-[#1f39a1] hover:bg-[#162870] text-white font-normal py-2 px-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
//                 <span>🔄</span> Obunani yangilash{" "}
//               </button>

//               <p className="text-xs text-gray-500 text-center mt-3">
//                 Obuna muddati tugashiga 5 kun qoldi{" "}
//               </p>
//             </div>
//           </div>
//         )}
//       </aside>
//     </div>
//   );
// }














// // v1
// dropdown ishladi


// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import Logo from "../assets/imgs/logo.png";

// // MUI Icons import
// import HomeIcon from "@mui/icons-material/Home";
// import SchoolIcon from "@mui/icons-material/School";
// import GroupIcon from "@mui/icons-material/Group";
// import PersonIcon from "@mui/icons-material/Person";
// import SettingsIcon from "@mui/icons-material/Settings";
// import BookIcon from "@mui/icons-material/Book";
// import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
// import BusinessIcon from "@mui/icons-material/Business";
// import PeopleIcon from "@mui/icons-material/People";
// import TagIcon from "@mui/icons-material/Tag";
// import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
// import EmailIcon from "@mui/icons-material/Email";
// import HelpIcon from "@mui/icons-material/Help";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import WarningIcon from "@mui/icons-material/Warning";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// export default function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const dropdownRef = useRef(null);

//   const menuItems = [
//     { id: "dashboard", name: "Asosiy", icon: HomeIcon, path: "/dashboard" },
//     { id: "teachers", name: "O'qituvchilar", icon: SchoolIcon, path: "/teachers" },
//     { id: "groups", name: "Guruhlar", icon: GroupIcon, path: "/classes" },
//     { id: "students", name: "Talabalar", icon: PersonIcon, path: "/students" },
//   ];

//   const settingsItems = [
//     { id: "courses", name: "Kurslar", icon: BookIcon, path: "/settings/courses" },
//     { id: "rooms", name: "Xonalar", icon: MeetingRoomIcon, path: "/settings/rooms" },
//     { id: "staff", name: "Hodimlar", icon: PeopleIcon, path: "/settings/staff" },
//     { id: "messages", name: "Xabar Yuborish", icon: EmailIcon, path: "/settings/messages" },
//   ];

//   // Settings sahifalaridan birida ekanligini tekshirish
//   const isSettingsActive = settingsItems.some(item => location.pathname === item.path) || 
//                            location.pathname.startsWith("/settings");

//   // Settings sahifasida bo'lsa avtomatik ochish
//   useEffect(() => {
//     if (isSettingsActive && !isCollapsed) {
//       setIsSettingsOpen(true);
//     }
//   }, [isSettingsActive, isCollapsed]);

//   // Click tashqarisiga bosilganda yopish
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsSettingsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Sidebar ni yopish/ochish
//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//     if (!isCollapsed) {
//       setIsSettingsOpen(false);
//     }
//   };

//   // Boshqarish ni bosganda
//   const handleBoshqarishClick = (e) => {
//     e.preventDefault();
//     navigate('/settings');
    
//     if (isCollapsed) {
//       setIsCollapsed(false);
//       setIsSettingsOpen(true);
//     } else {
//       setIsSettingsOpen(!isSettingsOpen);
//     }
//   };

//   const isBoshqarishActive = isSettingsActive;

//   return (
//     <div className="flex bg-gray-50/50">
//       <aside 
//         className={`bg-white shadow-lg fixed h-screen top-0 left-0 flex flex-col justify-between transition-all duration-300 z-50 ${
//           isCollapsed ? "w-20" : "w-64"
//         }`}
//       >
//         <div className={`${isCollapsed ? "p-3" : "p-6"} flex-1 overflow-y-auto no-scrollbar`}>
//           {/* Logo va Toggle */}
//           <div className={`flex items-center mb-8 ${isCollapsed ? "flex-col gap-3" : "justify-between"}`}>
//             <NavLink
//               to="/dashboard"
//               className={`flex items-center rounded-lg group cursor-pointer transition-all duration-500 ${
//                 isCollapsed ? "p-1" : "gap-2 p-2"
//               }`}
//             >
//               <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0 transition-all duration-300 group-hover:scale-125">
//                 <img src={Logo} className="w-8 h-8" />
//               </div>
//               {!isCollapsed && (
//                 <h1 className="ml-2 text-xl font-bold text-[#4a5568] transition-all duration-300 group-hover:text-[#1f39a1]">
//                   EduCRM
//                 </h1>
//               )}
//             </NavLink>


//             <button
//               onClick={toggleSidebar}
//               className={`flex items-center justify-center rounded-lg bg-[#1f39a1] text-white hover:bg-[#162870] transition-all duration-300 shadow-md hover:shadow-lg ${
//                 isCollapsed ? "w-8 h-8" : "w-8 h-8"
//               }`}
//             >
//               {isCollapsed ? (
//                 <ChevronRightIcon className="w-5 h-5" />
//               ) : (
//                 <ChevronLeftIcon className="w-5 h-5" />
//               )}
//             </button>
//           </div>

//           {/* Nav */}
//           <nav>
//             <ul className="space-y-2">
//               {menuItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
                
//                 return (
//                   <li key={item.id}>
//                     <NavLink
//                       to={item.path}
//                       onClick={() => setIsSettingsOpen(false)}
//                       className={`flex items-center rounded-lg transition-all duration-300 group ${
//                         isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
//                       } ${
//                         isActive
//                           ? "text-white bg-[#1f39a1] shadow-md"
//                           : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                       }`}
//                       title={isCollapsed ? item.name : ""}
//                     >
//                       <Icon className={`transition-all duration-300 group-hover:scale-110 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
//                       {!isCollapsed && <span>{item.name}</span>}
//                     </NavLink>
//                   </li>
//                 );
//               })}

//               {/* Boshqarish - NavLink */}
//               <li ref={dropdownRef} >
//                 <button
//                   onClick={handleBoshqarishClick}
//                   className={`w-full flex items-center rounded-lg transition-all duration-300 group ${
//                     isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
//                   } ${
//                     isBoshqarishActive
//                       ? "bg-[#1f39a1] text-white shadow-md"
//                       : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                   }`}
//                   title={isCollapsed ? "Boshqarish" : ""}
//                 >
//                   <SettingsIcon className={`transition-all duration-300 ${isSettingsOpen && !isCollapsed ? "rotate-90" : ""} ${isCollapsed ? "w-6 h-6" : "w-5 h-5"} group-hover:scale-110`} />
//                   {!isCollapsed && <span className="flex-1 text-left">Boshqarish</span>}
//                   {/* Yon menyu belgisi */}
//                   {!isCollapsed && (
//                     <span className={`ml-auto text-xs transition-transform duration-200 ${isSettingsOpen ? "" : "rotate-90"}`}>
//                       ▶
//                     </span>
//                   )}
//                 </button>

//                 {/* Dropdown menyu - Boshqarish ichidagi elementlar */}
//                 {!isCollapsed && (
//                   <div
//                     className={`fixed left-64 top-0 ml-0 w-64 h-full overflow-y-auto no-scrollbar bg-white rounded-xl shadow-xl z-20 py-3 border border-gray-100 transition-all duration-500 ease-out ${
//                       isSettingsOpen
//                         ? "opacity-100 translate-x-0 visible"
//                         : "opacity-0 -translate-x-2 invisible"
//                     }`}
//                   >
//                     <div className="flex justify-between items-center px-4 pb-2 mb-1 border-b border-gray-100 sticky top-0 bg-white z-10">
//                       <span className="font-semibold text-sm text-gray-800">Menu</span>
//                       <button
//                         onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(false); }}
//                         className="text-gray-400 hover:text-[#1f39a1] transition-all duration-200 flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100"
//                       >
//                         ✕
//                       </button>
//                     </div>

//                     <div className="space-y-1 mt-2">
//                       {settingsItems.map((item) => {
//                         const Icon = item.icon;
//                         const isActive = location.pathname === item.path;
                        
//                         return (
//                           <NavLink
//                             key={item.id}
//                             to={item.path}
//                             onClick={() => setIsSettingsOpen(false)}
//                             className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-2 transition-all duration-300 ${
//                               isActive
//                                 ? "text-white bg-[#1f39a1] shadow-md"
//                                 : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                             }`}
//                           >
//                             <Icon className="w-4 h-4" />
//                             <span>{item.name}</span>
//                           </NavLink>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </li>
//             </ul>
//           </nav>
//         </div>

//         {/* Obuna kartasi (Tolov qismi) */}
//         {!isCollapsed && (
//           <div className="p-6">
//             <div className="bg-gradient-to-r from-[#f0f4ff] to-red-50 rounded-xl shadow-sm p-4">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">Obuna</h3>
//                   <p className="text-gray-600 text-sm">Obunangiz tugagan</p>
//                 </div>
//                 <WarningIcon className="text-2xl text-orange-500" />
//               </div>

//               <div className="mb-4">
//                 <div className="flex justify-between text-sm mb-1">
//                   <span>Qolgan kunlar</span>
//                   <span className="font-semibold text-[#1f39a1]">5 / 30</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div className="bg-[#1f39a1] h-2 rounded-full" style={{ width: "16%" }} />
//                 </div>
//               </div>

//               <button className="w-full bg-[#1f39a1] hover:bg-[#162870] text-white font-normal py-2 px-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
//                 <span>🔄</span>
//                 Obunani yangilash
//               </button>

//               <p className="text-xs text-gray-500 text-center mt-3">
//                 Obuna muddati tugashiga 5 kun qoldi
//               </p>
//             </div>
//           </div>
//         )}
//       </aside>

//       {/* Sizning loyihangizdagi main (asosiy content) maydoningiz uchun joy */}
//       {/* Sidebar fixed qilingan, shunig uchun main block sidebar kengligiga qarab joylashishi kerak. */}
//       {/* <main className={`transition-all duration-300 ml-${isCollapsed ? '20' : '64'} w-full`}> */}
//       {/* </main> */}

//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </div>
//   );
// }


















// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import Logo from "../assets/imgs/logo.png";

// // // MUI Icons import
// import HomeIcon from "@mui/icons-material/Home";
// import SchoolIcon from "@mui/icons-material/School";
// import GroupIcon from "@mui/icons-material/Group";
// import PersonIcon from "@mui/icons-material/Person";
// import SettingsIcon from "@mui/icons-material/Settings";
// import BookIcon from "@mui/icons-material/Book";
// import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
// import BusinessIcon from "@mui/icons-material/Business";
// import PeopleIcon from "@mui/icons-material/People";
// import TagIcon from "@mui/icons-material/Tag";
// import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
// import EmailIcon from "@mui/icons-material/Email";
// import HelpIcon from "@mui/icons-material/Help";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import WarningIcon from "@mui/icons-material/Warning";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// export default function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const dropdownRef = useRef(null);

//   const menuItems = [
//     { id: "dashboard", name: "Asosiy", icon: HomeIcon, path: "/dashboard" },
//     { id: "teachers", name: "O'qituvchilar", icon: SchoolIcon, path: "/teachers" },
//     { id: "groups", name: "Guruhlar", icon: GroupIcon, path: "/classes" },
//     { id: "students", name: "Talabalar", icon: PersonIcon, path: "/students" },
//   ];

//   const settingsItems = [
//     { id: "courses", name: "Kurslar", icon: BookIcon, path: "/settings/courses" },
//     { id: "rooms", name: "Xonalar", icon: MeetingRoomIcon, path: "/settings/rooms" },
//     { id: "staff", name: "Hodimlar", icon: PeopleIcon, path: "/settings/staff" },
//     { id: "messages", name: "Xabar Yuborish", icon: EmailIcon, path: "/settings/messages" },
//   ];

//   // Settings sahifalaridan birida ekanligini tekshirish
//   const isSettingsActive = settingsItems.some(item => location.pathname === item.path) ||
//                            location.pathname.startsWith("/settings");

//   // Settings sahifasida bo'lsa avtomatik ochish
//   useEffect(() => {
//     if (isSettingsActive && !isCollapsed) {
//       setIsSettingsOpen(true);
//     }
//   }, [isSettingsActive, isCollapsed]);

//   // Click tashqarisiga bosilganda yopish
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsSettingsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Sidebar ni yopish/ochish
//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//     if (!isCollapsed) {
//       setIsSettingsOpen(false);
//     }
//   };

//   // Boshqarish ni bosganda
//   const handleBoshqarishClick = (e) => {
//     e.preventDefault();
//     navigate('/settings');

//     if (isCollapsed) {
//       setIsCollapsed(false);
//       setIsSettingsOpen(true);
//     } else {
//       setIsSettingsOpen(!isSettingsOpen);
//     }
//   };

//   const isBoshqarishActive = isSettingsActive;

//   return (
//     <div className="flex bg-gray-50/50">
//       <aside
//         className={`bg-white shadow-lg fixed h-screen top-0 left-0 flex flex-col justify-between transition-all duration-300 z-50 ${
//           isCollapsed ? "w-20" : "w-64"
//         }`}
//       >
//         <div className={`${isCollapsed ? "p-3" : "p-6"} flex-1 overflow-y-auto no-scrollbar`}>
//           {/* Logo va Toggle */}
//           <div className={`flex items-center mb-8 ${isCollapsed ? "flex-col gap-3" : "justify-between"}`}>
//             <NavLink
//               to="/dashboard"
//               className={`flex items-center rounded-lg group cursor-pointer transition-all duration-500 ${
//                 isCollapsed ? "p-1" : "gap-2 p-2"
//               }`}
//             >
//               <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0 transition-all duration-300 group-hover:scale-125">
//                 <img src={Logo} className="w-8 h-8" />
//               </div>
//               {!isCollapsed && (
//                 <h1 className="ml-2 text-xl font-bold text-[#4a5568] transition-all duration-300 group-hover:text-[#1f39a1]">
//                   EduCRM
//                 </h1>
//               )}
//             </NavLink>

//             <button
//               onClick={toggleSidebar}
//               className={`flex items-center justify-center rounded-lg bg-[#1f39a1] text-white hover:bg-[#162870] transition-all duration-300 shadow-md hover:shadow-lg ${
//                 isCollapsed ? "w-8 h-8" : "w-8 h-8"
//               }`}
//             >
//               {isCollapsed ? (
//                 <ChevronRightIcon className="w-5 h-5" />
//               ) : (
//                 <ChevronLeftIcon className="w-5 h-5" />
//               )}
//             </button>
//           </div>

//           {/* Nav */}
//           <nav>
//             <ul className="space-y-2">
//               {menuItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');

//                 return (
//                   <li key={item.id}>
//                     <NavLink
//                       to={item.path}
//                       onClick={() => setIsSettingsOpen(false)}
//                       className={`flex items-center rounded-lg transition-all duration-300 group ${
//                         isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
//                       } ${
//                         isActive
//                           ? "text-white bg-[#1f39a1] shadow-md"
//                           : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                       }`}
//                       title={isCollapsed ? item.name : ""}
//                     >
//                       <Icon className={`transition-all duration-300 group-hover:scale-110 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
//                       {!isCollapsed && <span>{item.name}</span>}
//                     </NavLink>
//                   </li>
//                 );
//               })}

//               {/* Boshqarish - NavLink */}
//               <li ref={dropdownRef} >
//                 <button
//                   onClick={handleBoshqarishClick}
//                   className={`w-full flex items-center rounded-lg transition-all duration-300 group ${
//                     isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
//                   } ${
//                     isBoshqarishActive
//                       ? "bg-[#1f39a1] text-white shadow-md"
//                       : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                   }`}
//                   title={isCollapsed ? "Boshqarish" : ""}
//                 >
//                   <SettingsIcon className={`transition-all duration-300 ${isSettingsOpen && !isCollapsed ? "rotate-90" : ""} ${isCollapsed ? "w-6 h-6" : "w-5 h-5"} group-hover:scale-110`} />
//                   {!isCollapsed && <span className="flex-1 text-left">Boshqarish</span>}
//                   {/* Yon menyu belgisi */}
//                   {!isCollapsed && (
//                     <span className={`ml-auto text-xs transition-transform duration-200 ${isSettingsOpen ? "" : "rotate-90"}`}>
//                       ▶
//                     </span>
//                   )}
//                 </button>

//                 {/* Dropdown menyu - Boshqarish ichidagi elementlar */}
//                 {!isCollapsed && (
//                   <div
//                     className={`fixed left-64 top-0 ml-0 w-64 h-full overflow-y-auto no-scrollbar bg-white rounded-xl shadow-xl z-20 py-3 border border-gray-100 transition-all duration-500 ease-out ${
//                       isSettingsOpen
//                         ? "opacity-100 translate-x-0 visible"
//                         : "opacity-0 -translate-x-2 invisible"
//                     }`}
//                   >
//                     <div className="flex justify-between items-center px-4 pb-2 mb-1 border-b border-gray-100 sticky top-0 bg-white z-10">
//                       <span className="font-semibold text-sm text-gray-800">Menu</span>
//                       <button
//                         onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(false); }}
//                         className="text-gray-400 hover:text-[#1f39a1] transition-all duration-200 flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100"
//                       >
//                         ✕
//                       </button>
//                     </div>

//                     <div className="space-y-1 mt-2">
//                       {settingsItems.map((item) => {
//                         const Icon = item.icon;
//                         const isActive = location.pathname === item.path;

//                         return (
//                           <NavLink
//                             key={item.id}
//                             to={item.path}
//                             onClick={() => setIsSettingsOpen(false)}
//                             className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-2 transition-all duration-300 ${
//                               isActive
//                                 ? "text-white bg-[#1f39a1] shadow-md"
//                                 : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                             }`}
//                           >
//                             <Icon className="w-4 h-4" />
//                             <span>{item.name}</span>
//                           </NavLink>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </li>
//             </ul>
//           </nav>
//         </div>

//         {/* Obuna kartasi (Tolov qismi) */}
//         {!isCollapsed && (
//           <div className="p-6">
//             <div className="bg-gradient-to-r from-[#f0f4ff] to-red-50 rounded-xl shadow-sm p-4">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">Obuna</h3>
//                   <p className="text-gray-600 text-sm">Obunangiz tugagan</p>
//                 </div>
//                 <WarningIcon className="text-2xl text-orange-500" />
//               </div>

//               <div className="mb-4">
//                 <div className="flex justify-between text-sm mb-1">
//                   <span>Qolgan kunlar</span>
//                   <span className="font-semibold text-[#1f39a1]">5 / 30</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div className="bg-[#1f39a1] h-2 rounded-full" style={{ width: "16%" }} />
//                 </div>
//               </div>

//               <button className="w-full bg-[#1f39a1] hover:bg-[#162870] text-white font-normal py-2 px-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
//                 <span>🔄</span>
//                 Obunani yangilash
//               </button>

//               <p className="text-xs text-gray-500 text-center mt-3">
//                 Obuna muddati tugashiga 5 kun qoldi
//               </p>
//             </div>
//           </div>
//         )}
//       </aside>

//       {/* Sizning loyihangizdagi main (asosiy content) maydoningiz uchun joy */}
//       {/* Sidebar fixed qilingan, shunig uchun main block sidebar kengligiga qarab joylashishi kerak. */}
//       {/* <main className={`transition-all duration-300 ml-${isCollapsed ? '20' : '64'} w-full`}> */}
//       {/* </main> */}

//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </div>
//   );
// }

// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import Logo from "../assets/imgs/logo.png";

// // MUI Icons import
// import HomeIcon from "@mui/icons-material/Home";
// import SchoolIcon from "@mui/icons-material/School";
// import GroupIcon from "@mui/icons-material/Group";
// import PersonIcon from "@mui/icons-material/Person";
// import SettingsIcon from "@mui/icons-material/Settings";
// import BookIcon from "@mui/icons-material/Book";
// import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
// import BusinessIcon from "@mui/icons-material/Business";
// import PeopleIcon from "@mui/icons-material/People";
// import TagIcon from "@mui/icons-material/Tag";
// import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
// import EmailIcon from "@mui/icons-material/Email";
// import HelpIcon from "@mui/icons-material/Help";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import WarningIcon from "@mui/icons-material/Warning";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { useSidebar } from "../contexts/SidebarContext";

// export default function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   // const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   // const [isCollapsed, setIsCollapsed] = useState(false);
//   const { isCollapsed, setIsCollapsed, isSettingsOpen, setIsSettingsOpen } = useSidebar();

//   const dropdownRef = useRef(null);
//   const prevSettingsActive = useRef(false);

//   const menuItems = [
//     { id: "dashboard", name: "Asosiy", icon: HomeIcon, path: "/dashboard" },
//     { id: "teachers", name: "O'qituvchilar", icon: SchoolIcon, path: "/teachers" },
//     { id: "groups", name: "Guruhlar", icon: GroupIcon, path: "/classes" },
//     { id: "students", name: "Talabalar", icon: PersonIcon, path: "/students" },
//   ];

//   const settingsItems = [
//     { id: "courses", name: "Kurslar", icon: BookIcon, path: "/settings/courses" },
//     { id: "rooms", name: "Xonalar", icon: MeetingRoomIcon, path: "/settings/rooms" },
//     { id: "staff", name: "Hodimlar", icon: PeopleIcon, path: "/settings/staff" },
//     { id: "messages", name: "Xabar Yuborish", icon: EmailIcon, path: "/settings/messages" },
//   ];

//   // Settings sahifalaridan birida ekanligini tekshirish
//   const isSettingsActive = settingsItems.some(item => location.pathname === item.path) ||
//                            location.pathname.startsWith("/settings");

//   // Settings sahifasida bo'lsa avtomatik ochish
//   useEffect(() => {
//     if (isSettingsActive && !isCollapsed && !prevSettingsActive.current) {
//       setIsSettingsOpen(true);
//     }
//     prevSettingsActive.current = isSettingsActive;
//   }, [isSettingsActive, isCollapsed]);

//   // Click tashqarisiga bosilganda yopish
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsSettingsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Sidebar ni yopish/ochish
//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//     if (!isCollapsed) {
//       setIsSettingsOpen(false);
//     }
//   };

//   const handleBoshqarishClick = (e) => {
//     e.preventDefault();
//     setIsSettingsOpen(!isSettingsOpen);
//   };
//   // Boshqarish ni bosganda
//   //  const handleBoshqarishClick = (e) => {
//   //   e.preventDefault();

//   //   if (isCollapsed) {
//   //     setIsCollapsed(false);
//   //     setIsSettingsOpen(true);
//   //     // navigate('/settings');
//   //   } else {
//   //     if (isSettingsOpen) {
//   //       setIsSettingsOpen(false);
//   //     } else {
//   //       setIsSettingsOpen(true);
//   //       // navigate('/settings');
//   //     }
//   //   }
//   // };

//   const isBoshqarishActive = isSettingsActive;

//   return (
//     <div className="flex bg-gray-50/50">
//       <aside
//         className={`bg-white shadow-lg fixed h-screen top-0 left-0 flex flex-col justify-between transition-all duration-300 z-50 ${
//           isCollapsed ? "w-20" : "w-64"
//         }`}
//       >
//         <div className={`${isCollapsed ? "p-3" : "p-6"} flex-1 overflow-y-auto no-scrollbar`}>
//           {/* Logo va Toggle */}
//           <div className={`flex items-center mb-8 ${isCollapsed ? "flex-col gap-3" : "justify-between"}`}>
//             <NavLink
//               to="/dashboard"
//               className={`flex items-center rounded-lg group cursor-pointer transition-all duration-500 ${
//                 isCollapsed ? "p-1" : "gap-2 p-2"
//               }`}
//             >
//               <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0 transition-all duration-300 group-hover:scale-125">
//                 <img src={Logo} className="w-8 h-8" />
//               </div>
//               {!isCollapsed && (
//                 <h1 className="ml-2 text-xl font-bold text-[#4a5568] transition-all duration-300 group-hover:text-[#1f39a1]">
//                   EduCRM
//                 </h1>
//               )}
//             </NavLink>

//             <button
//               onClick={toggleSidebar}
//               className={`flex items-center justify-center rounded-lg bg-[#1f39a1] text-white hover:bg-[#162870] transition-all duration-300 shadow-md hover:shadow-lg ${
//                 isCollapsed ? "w-8 h-8" : "w-8 h-8"
//               }`}
//             >
//               {isCollapsed ? (
//                 <ChevronRightIcon className="w-5 h-5" />
//               ) : (
//                 <ChevronLeftIcon className="w-5 h-5" />
//               )}
//             </button>
//           </div>

//           {/* Nav */}
//           <nav>
//             <ul className="space-y-2">
//               {menuItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');

//                 return (
//                   <li key={item.id}>
//                     <NavLink
//                       to={item.path}
//                       onClick={() => setIsSettingsOpen(false)}
//                       className={`flex items-center rounded-lg transition-all duration-300 group ${
//                         isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
//                       } ${
//                         isActive
//                           ? "text-white bg-[#1f39a1] shadow-md"
//                           : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                       }`}
//                       title={isCollapsed ? item.name : ""}
//                     >
//                       <Icon className={`transition-all duration-300 group-hover:scale-110 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
//                       {!isCollapsed && <span>{item.name}</span>}
//                     </NavLink>
//                   </li>
//                 );
//               })}

//               {/* Boshqarish - NavLink */}
//               <li ref={dropdownRef} >
//                 <button
//                   onClick={handleBoshqarishClick}
//                   className={`w-full flex items-center rounded-lg transition-all duration-300 group ${
//                     isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
//                   } ${
//                     isBoshqarishActive
//                       ? "bg-[#1f39a1] text-white shadow-md"
//                       : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                   }`}
//                   title={isCollapsed ? "Boshqarish" : ""}
//                 >
//                   <SettingsIcon className={`transition-all duration-300 ${isSettingsOpen && !isCollapsed ? "rotate-90" : ""} ${isCollapsed ? "w-6 h-6" : "w-5 h-5"} group-hover:scale-110`} />
//                   {!isCollapsed && <span className="flex-1 text-left">Boshqarish</span>}
//                   {/* Yon menyu belgisi */}
//                   {!isCollapsed && (
//                     <span className={`ml-auto text-xs transition-transform duration-200 ${isSettingsOpen ? "" : "rotate-90"}`}>
//                       ▶
//                     </span>
//                   )}
//                 </button>

//                 {/* Dropdown menyu - Boshqarish ichidagi elementlar */}
//                 {!isCollapsed && (
//                   <div
//                     className={`fixed left-64 top-0 ml-0 w-64 h-full overflow-y-auto no-scrollbar bg-white rounded-xl shadow-xl z-20 py-3 border border-gray-100 transition-all duration-500 ease-out ${
//                       isSettingsOpen
//                         ? "opacity-100 translate-x-0 visible"
//                         : "opacity-0 -translate-x-2 invisible"
//                     }`}
//                   >
//                     <div className="flex justify-between items-center px-4 pb-2 mb-1 border-b border-gray-100 sticky top-0 bg-white z-10">
//                       <span className="font-semibold text-sm text-gray-800">Menu</span>
//                       <button
//                         onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(false); }}
//                         className="text-gray-400 hover:text-[#1f39a1] transition-all duration-200 flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100"
//                       >
//                         ✕
//                       </button>
//                     </div>

//                     <div className="space-y-1 mt-2">
//                       {settingsItems.map((item) => {
//                         const Icon = item.icon;
//                         const isActive = location.pathname === item.path;

//                         return (
//                           <NavLink
//                             key={item.id}
//                             to={item.path}
//                             onClick={() => setIsSettingsOpen(false)}
//                             className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-2 transition-all duration-300 ${
//                               isActive
//                                 ? "text-white bg-[#1f39a1] shadow-md"
//                                 : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                             }`}
//                           >
//                             <Icon className="w-4 h-4" />
//                             <span>{item.name}</span>
//                           </NavLink>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </li>
//             </ul>
//           </nav>
//         </div>

//         {/* Obuna kartasi (Tolov qismi) */}
//         {!isCollapsed && (
//           <div className="p-6">
//             <div className="bg-gradient-to-r from-[#f0f4ff] to-red-50 rounded-xl shadow-sm p-4">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">Obuna</h3>
//                   <p className="text-gray-600 text-sm">Obunangiz tugagan</p>
//                 </div>
//                 <WarningIcon className="text-2xl text-orange-500" />
//               </div>

//               <div className="mb-4">
//                 <div className="flex justify-between text-sm mb-1">
//                   <span>Qolgan kunlar</span>
//                   <span className="font-semibold text-[#1f39a1]">5 / 30</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div className="bg-[#1f39a1] h-2 rounded-full" style={{ width: "16%" }} />
//                 </div>
//               </div>

//               <button className="w-full bg-[#1f39a1] hover:bg-[#162870] text-white font-normal py-2 px-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
//                 <span>🔄</span>
//                 Obunani yangilash
//               </button>

//               <p className="text-xs text-gray-500 text-center mt-3">
//                 Obuna muddati tugashiga 5 kun qoldi
//               </p>
//             </div>
//           </div>
//         )}
//       </aside>

//       {/* Sizning loyihangizdagi main (asosiy content) maydoningiz uchun joy */}
//       {/* Sidebar fixed qilingan, shunig uchun main block sidebar kengligiga qarab joylashishi kerak. */}
//       {/* <main className={`transition-all duration-300 ml-${isCollapsed ? '20' : '64'} w-full`}> */}
//       {/* </main> */}

//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </div>
//   );
// }

// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import Logo from "../assets/imgs/logo.png";

// // MUI Icons import
// import HomeIcon from "@mui/icons-material/Home";
// import SchoolIcon from "@mui/icons-material/School";
// import GroupIcon from "@mui/icons-material/Group";
// import PersonIcon from "@mui/icons-material/Person";
// import SettingsIcon from "@mui/icons-material/Settings";
// import BookIcon from "@mui/icons-material/Book";
// import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
// import BusinessIcon from "@mui/icons-material/Business";
// import PeopleIcon from "@mui/icons-material/People";
// import TagIcon from "@mui/icons-material/Tag";
// import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
// import EmailIcon from "@mui/icons-material/Email";
// import HelpIcon from "@mui/icons-material/Help";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import WarningIcon from "@mui/icons-material/Warning";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { useSidebar } from "../contexts/SidebarContext";

// export default function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isCollapsed, setIsCollapsed, isSettingsOpen, setIsSettingsOpen } = useSidebar();

//   const dropdownRef = useRef(null);
//   const prevSettingsActive = useRef(false);

//   const menuItems = [
//     { id: "dashboard", name: "Asosiy", icon: HomeIcon, path: "/dashboard" },
//     { id: "teachers", name: "O'qituvchilar", icon: SchoolIcon, path: "/teachers" },
//     { id: "groups", name: "Guruhlar", icon: GroupIcon, path: "/classes" },
//     { id: "students", name: "Talabalar", icon: PersonIcon, path: "/students" },
//   ];

//   const settingsItems = [
//     { id: "courses", name: "Kurslar", icon: BookIcon, path: "/settings/courses" },
//     { id: "rooms", name: "Xonalar", icon: MeetingRoomIcon, path: "/settings/rooms" },
//     { id: "staff", name: "Hodimlar", icon: PeopleIcon, path: "/settings/staff" },
//     { id: "messages", name: "Xabar Yuborish", icon: EmailIcon, path: "/settings/messages" },
//   ];

//   // Settings sahifalaridan birida ekanligini tekshirish
//   const isSettingsActive = settingsItems.some(item => location.pathname === item.path) ||
//                            location.pathname === "/settings";

//   // Settings sahifasida bo'lsa avtomatik ochish
//   useEffect(() => {
//     if (isSettingsActive && !isCollapsed && !prevSettingsActive.current) {
//       setIsSettingsOpen(true);
//     }
//     prevSettingsActive.current = isSettingsActive;
//   }, [isSettingsActive, isCollapsed]);

//   // Click tashqarisiga bosilganda yopish
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsSettingsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Sidebar ni yopish/ochish
//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//     if (!isCollapsed) {
//       setIsSettingsOpen(false);
//     }
//   };

//   const handleBoshqarishClick = (e) => {
//     e.preventDefault();

//     if (isCollapsed) {
//       // Agar sidebar collapsed bo'lsa, avval ochamiz
//       setIsCollapsed(false);
//       setIsSettingsOpen(true);
//       navigate('/settings');
//     } else {
//       // Sidebar ochiq holatda
//       if (isSettingsOpen) {
//         // Agar dropdown ochiq bo'lsa, yopamiz va dashboardga o'tamiz
//         setIsSettingsOpen(false);
//         navigate('/dashboard');
//       } else {
//         // Agar dropdown yopiq bo'lsa, ochamiz va settings page ga o'tamiz
//         setIsSettingsOpen(true);
//         navigate('/settings');
//       }
//     }
//   };

//   const isBoshqarishActive = isSettingsActive;

//   return (
//     <div className="flex bg-gray-50/50">
//       <aside
//         className={`bg-white shadow-lg fixed h-screen top-0 left-0 flex flex-col justify-between transition-all duration-300 z-50 ${
//           isCollapsed ? "w-20" : "w-64"
//         }`}
//       >
//         <div className={`${isCollapsed ? "p-3" : "p-6"} flex-1 overflow-y-auto no-scrollbar`}>
//           {/* Logo va Toggle */}
//           <div className={`flex items-center mb-8 ${isCollapsed ? "flex-col gap-3" : "justify-between"}`}>
//             <NavLink
//               to="/dashboard"
//               onClick={() => setIsSettingsOpen(false)}
//               className={`flex items-center rounded-lg group cursor-pointer transition-all duration-500 ${
//                 isCollapsed ? "p-1" : "gap-2 p-2"
//               }`}
//             >
//               <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0 transition-all duration-300 group-hover:scale-125">
//                 <img src={Logo} className="w-8 h-8" alt="Logo" />
//               </div>
//               {!isCollapsed && (
//                 <h1 className="ml-2 text-xl font-bold text-[#4a5568] transition-all duration-300 group-hover:text-[#1f39a1]">
//                   EduCRM
//                 </h1>
//               )}
//             </NavLink>

//             <button
//               onClick={toggleSidebar}
//               className={`flex items-center justify-center rounded-lg bg-[#1f39a1] text-white hover:bg-[#162870] transition-all duration-300 shadow-md hover:shadow-lg ${
//                 isCollapsed ? "w-8 h-8" : "w-8 h-8"
//               }`}
//             >
//               {isCollapsed ? (
//                 <ChevronRightIcon className="w-5 h-5" />
//               ) : (
//                 <ChevronLeftIcon className="w-5 h-5" />
//               )}
//             </button>
//           </div>

//           {/* Nav */}
//           <nav>
//             <ul className="space-y-2">
//               {menuItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');

//                 return (
//                   <li key={item.id}>
//                     <NavLink
//                       to={item.path}
//                       onClick={() => {
//                         setIsSettingsOpen(false);
//                       }}
//                       className={`flex items-center rounded-lg transition-all duration-300 group ${
//                         isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
//                       } ${
//                         isActive
//                           ? "text-white bg-[#1f39a1] shadow-md"
//                           : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                       }`}
//                       title={isCollapsed ? item.name : ""}
//                     >
//                       <Icon className={`transition-all duration-300 group-hover:scale-110 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
//                       {!isCollapsed && <span>{item.name}</span>}
//                     </NavLink>
//                   </li>
//                 );
//               })}

//               {/* Boshqarish - Button */}
//               <li ref={dropdownRef}>
//                 <button
//                   onClick={handleBoshqarishClick}
//                   className={`w-full flex items-center rounded-lg transition-all duration-300 group ${
//                     isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
//                   } ${
//                     isBoshqarishActive
//                       ? "bg-[#1f39a1] text-white shadow-md"
//                       : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                   }`}
//                   title={isCollapsed ? "Boshqarish" : ""}
//                 >
//                   <SettingsIcon className={`transition-all duration-300 ${isSettingsOpen && !isCollapsed ? "rotate-90" : ""} ${isCollapsed ? "w-6 h-6" : "w-5 h-5"} group-hover:scale-110`} />
//                   {!isCollapsed && <span className="flex-1 text-left">Boshqarish</span>}
//                   {/* Yon menyu belgisi */}
//                   {!isCollapsed && (
//                     <span className={`ml-auto text-xs transition-transform duration-200 ${isSettingsOpen ? "rotate-90" : ""}`}>
//                       ▶
//                     </span>
//                   )}
//                 </button>

//                 {/* Dropdown menyu - Boshqarish ichidagi elementlar */}
//                 {!isCollapsed && (
//                   <div
//                     className={`fixed left-64 top-0 ml-0 w-64 h-full overflow-y-auto no-scrollbar bg-white rounded-xl shadow-xl z-20 py-3 border border-gray-100 transition-all duration-500 ease-out ${
//                       isSettingsOpen
//                         ? "opacity-100 translate-x-0 visible"
//                         : "opacity-0 -translate-x-2 invisible"
//                     }`}
//                   >
//                     <div className="flex justify-between items-center px-4 pb-2 mb-1 border-b border-gray-100 sticky top-0 bg-white z-10">
//                       <span className="font-semibold text-sm text-gray-800">Menu</span>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setIsSettingsOpen(false);
//                           navigate('/dashboard');
//                         }}
//                         className="text-gray-400 hover:text-[#1f39a1] transition-all duration-200 flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100"
//                       >
//                         ✕
//                       </button>
//                     </div>

//                     <div className="space-y-1 mt-2">
//                       {settingsItems.map((item) => {
//                         const Icon = item.icon;
//                         const isActive = location.pathname === item.path;

//                         return (
//                           <NavLink
//                             key={item.id}
//                             to={item.path}
//                             onClick={() => {
//                               setIsSettingsOpen(false);
//                             }}
//                             className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-2 transition-all duration-300 ${
//                               isActive
//                                 ? "text-white bg-[#1f39a1] shadow-md"
//                                 : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//                             }`}
//                           >
//                             <Icon className="w-4 h-4" />
//                             <span>{item.name}</span>
//                           </NavLink>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </li>
//             </ul>
//           </nav>
//         </div>

//         {/* Obuna kartasi (Tolov qismi) */}
//         {!isCollapsed && (
//           <div className="p-6">
//             <div className="bg-gradient-to-r from-[#f0f4ff] to-red-50 rounded-xl shadow-sm p-4">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">Obuna</h3>
//                   <p className="text-gray-600 text-sm">Obunangiz tugagan</p>
//                 </div>
//                 <WarningIcon className="text-2xl text-orange-500" />
//               </div>

//               <div className="mb-4">
//                 <div className="flex justify-between text-sm mb-1">
//                   <span>Qolgan kunlar</span>
//                   <span className="font-semibold text-[#1f39a1]">5 / 30</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div className="bg-[#1f39a1] h-2 rounded-full" style={{ width: "16%" }} />
//                 </div>
//               </div>

//               <button className="w-full bg-[#1f39a1] hover:bg-[#162870] text-white font-normal py-2 px-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
//                 <span>🔄</span>
//                 Obunani yangilash
//               </button>

//               <p className="text-xs text-gray-500 text-center mt-3">
//                 Obuna muddati tugashiga 5 kun qoldi
//               </p>
//             </div>
//           </div>
//         )}
//       </aside>

//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </div>
//   );
// }

// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useRef, useEffect } from "react";
// import Logo from "../assets/imgs/logo.png";

// // MUI Icons import
// import HomeIcon from "@mui/icons-material/Home";
// import SchoolIcon from "@mui/icons-material/School";
// import GroupIcon from "@mui/icons-material/Group";
// import PersonIcon from "@mui/icons-material/Person";
// import SettingsIcon from "@mui/icons-material/Settings";
// import BookIcon from "@mui/icons-material/Book";
// import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
// import PeopleIcon from "@mui/icons-material/People";
// import EmailIcon from "@mui/icons-material/Email";
// import WarningIcon from "@mui/icons-material/Warning";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { useSidebar } from "../contexts/SidebarContext";

// export default function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isCollapsed, setIsCollapsed, isSettingsOpen, setIsSettingsOpen } = useSidebar();

//   const dropdownRef = useRef(null);
//   const prevSettingsActive = useRef(false);

//   const menuItems = [
//     { id: "dashboard", name: "Asosiy", icon: HomeIcon, path: "/dashboard" },
//     { id: "teachers", name: "O'qituvchilar", icon: SchoolIcon, path: "/teachers" },
//     { id: "groups", name: "Guruhlar", icon: GroupIcon, path: "/classes" },
//     { id: "students", name: "Talabalar", icon: PersonIcon, path: "/students" },
//   ];

//   const settingsItems = [
//     { id: "courses", name: "Kurslar", icon: BookIcon, path: "/settings/courses" },
//     { id: "rooms", name: "Xonalar", icon: MeetingRoomIcon, path: "/settings/rooms" },
//     { id: "staff", name: "Hodimlar", icon: PeopleIcon, path: "/settings/staff" },
//     { id: "messages", name: "Xabar Yuborish", icon: EmailIcon, path: "/settings/messages" },
//   ];

//   // Qaysi menyu faolligini aniq tekshirish
//   const isSettingsActive = location.pathname.startsWith("/settings");

//   useEffect(() => {
//     if (isSettingsActive && !isCollapsed && !prevSettingsActive.current) {
//       setIsSettingsOpen(true);
//     }
//     prevSettingsActive.current = isSettingsActive;
//   }, [isSettingsActive, isCollapsed, setIsSettingsOpen]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsSettingsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [setIsSettingsOpen]);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//     if (!isCollapsed) setIsSettingsOpen(false);
//   };

//   const handleBoshqarishClick = (e) => {
//     e.preventDefault();
//     if (isCollapsed) {
//       setIsCollapsed(false);
//     }
//       setIsSettingsOpen(!isSettingsOpen);
//       navigate('/settings');
//     }
//   };

//   return (
//     <div className="flex bg-gray-50/50">
//       <aside className={`bg-white shadow-lg fixed h-screen top-0 left-0 flex flex-col justify-between transition-all duration-300 z-50 ${isCollapsed ? "w-20" : "w-64"}`}>
//         <div className={`${isCollapsed ? "p-3" : "p-6"} flex-1 overflow-y-auto no-scrollbar`}>

//           {/* Logo qismi */}
//           <div className={`flex items-center mb-8 ${isCollapsed ? "flex-col gap-3" : "justify-between"}`}>
//             <NavLink to="/dashboard" onClick={() => setIsSettingsOpen(false)} className="flex items-center gap-2 p-2 group">
//               <img src={Logo} className="w-8 h-8" alt="Logo" />
//               {!isCollapsed && <h1 className="text-xl font-bold text-[#4a5568]">EduCRM</h1>}
//             </NavLink>
//             <button onClick={toggleSidebar} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1f39a1] text-white">
//               {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//             </button>
//           </div>

//           <nav>
//             <ul className="space-y-2">
//               {/* Asosiy menyular */}
//               {menuItems.map((item) => {
//                 const Icon = item.icon;
//                 // isActive mantiqi: URL aynan mos kelsa yoki dashboard holatida / bo'lsa
//                 const isActive = (item.path === '/dashboard' && (location.pathname === '/dashboard' || location.pathname === '/'))
//                                  || location.pathname === item.path;

//                 return (
//                   <li key={item.id}>
//                     <NavLink
//                       to={item.path}
//                       onClick={() => setIsSettingsOpen(false)}
//                       className={`flex items-center rounded-lg transition-all duration-300 ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"}
//                       ${isActive ? "text-white bg-[#1f39a1] shadow-md" : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"}`}
//                     >
//                       <Icon className="w-5 h-5" />
//                       {!isCollapsed && <span>{item.name}</span>}
//                     </NavLink>
//                   </li>
//                 );
//               })}

//               {/* Boshqarish tugmasi */}
//               <li ref={dropdownRef} className="relative">
//                 <button
//                   onClick={handleBoshqarishClick}
//                   className={`w-full flex items-center rounded-lg transition-all duration-300 ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"}
//                   ${isSettingsActive ? "bg-[#1f39a1] text-white shadow-md" : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"}`}
//                 >
//                   <SettingsIcon className={`w-5 h-5 ${isSettingsOpen && !isCollapsed ? "rotate-90" : ""}`} />
//                   {!isCollapsed && <span className="flex-1 text-left">Boshqarish</span>}
//                   {!isCollapsed && <span className={`text-xs transition-transform ${isSettingsOpen ? "rotate-90" : ""}`}>▶</span>}
//                 </button>

//                 {/* Dropdown - Faqat sidebar ochiqligida */}
//                 {!isCollapsed && isSettingsOpen && (
//                   <div className="fixed left-64 top-0 w-64 h-full bg-white shadow-xl z-20 py-3 border-l border-gray-100">
//                     <div className="px-4 pb-2 border-b font-semibold text-gray-800 flex justify-between">
//                       <span>Sozlamalar</span>
//                       <button onClick={() => setIsSettingsOpen(false)}>✕</button>
//                     </div>
//                     <div className="mt-2 space-y-1">
//                       {settingsItems.map((item) => (
//                         <NavLink
//                           key={item.id}
//                           to={item.path}
//                           onClick={() => setIsSettingsOpen(false)}
//                           className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all
//                             ${isActive ? "bg-[#1f39a1] text-white" : "text-gray-600 hover:bg-blue-50"}`}
//                         >
//                           <item.icon className="w-4 h-4" />
//                           {item.name}
//                         </NavLink>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>
//     </div>
//   );











import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import Logo from "../assets/imgs/logo.png";

// MUI Icons import
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import BookIcon from "@mui/icons-material/Book";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import WarningIcon from "@mui/icons-material/Warning";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSidebar } from "../contexts/SidebarContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, setIsCollapsed, isSettingsOpen, setIsSettingsOpen } =
    useSidebar();

  const dropdownRef = useRef(null);
  const prevSettingsActive = useRef(false);

  const menuItems = [
    { id: "dashboard", name: "Asosiy", icon: HomeIcon, path: "/dashboard" },
    {
      id: "teachers",
      name: "O'qituvchilar",
      icon: SchoolIcon,
      path: "/teachers",
    },
    { id: "groups", name: "Guruhlar", icon: GroupIcon, path: "/classes" },
    { id: "students", name: "Talabalar", icon: PersonIcon, path: "/students" },
  ];

  const settingsItems = [
    {
      id: "courses",
      name: "Kurslar",
      icon: BookIcon,
      path: "/settings/courses",
    },
    {
      id: "rooms",
      name: "Xonalar",
      icon: MeetingRoomIcon,
      path: "/settings/rooms",
    },
    {
      id: "staff",
      name: "Hodimlar",
      icon: PeopleIcon,
      path: "/settings/staff",
    },
    {
      id: "messages",
      name: "Xabar Yuborish",
      icon: EmailIcon,
      path: "/settings/messages",
    },
  ];

  const isSettingsActive = location.pathname.startsWith("/settings");

  useEffect(() => {
    if (isSettingsActive && !isCollapsed && !prevSettingsActive.current) {
      setIsSettingsOpen(true);
    }
    prevSettingsActive.current = isSettingsActive;
  }, [isSettingsActive, isCollapsed, setIsSettingsOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSettingsOpen]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setIsSettingsOpen(false);
  };

  const handleBoshqarishClick = (e) => {
    e.preventDefault();

    // 1. Sidebar yopiq bo'lsa, ochamiz
    if (isCollapsed) setIsCollapsed(false);

    // 2. Dropdown holatini o'zgartiramiz (ochish/yopish)
    setIsSettingsOpen(!isSettingsOpen);

    // 3. AGAR hozirgi manzil "/settings" bilan boshlanmasa,
    // UNDA navigatsiya qilamiz. Agar allaqachon shu yerda bo'lsak, navigate ishlamaydi.
    if (!location.pathname.startsWith("/settings")) {
      navigate("/settings");
    }
  };

  return (
    <div className="flex bg-gray-50/50">
      <aside
        className={`bg-white shadow-lg fixed h-screen top-0 left-0 flex flex-col justify-between transition-all duration-300 z-50 ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div
          className={`${isCollapsed ? "p-3" : "p-6"} flex-1 overflow-y-auto no-scrollbar`}
        >
          <div
            className={`flex items-center mb-8 ${isCollapsed ? "flex-col gap-3" : "justify-between"}`}
          >
            <NavLink
              to="/dashboard"
              onClick={() => setIsSettingsOpen(false)}
              className="flex items-center gap-2 p-2"
            >
              <img src={Logo} className="w-8 h-8" alt="Logo" />
              {!isCollapsed && (
                <h1 className="text-xl font-bold text-[#4a5568]">EduCRM</h1>
              )}
            </NavLink>
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1f39a1] text-white"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <nav>
            <ul className="space-y-2">
              {/* Asosiy menyu elementlari */}
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  (item.path === "/dashboard" &&
                    (location.pathname === "/dashboard" ||
                      location.pathname === "/")) ||
                  location.pathname === item.path;

                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      onClick={() => setIsSettingsOpen(false)}
                      className={`flex items-center rounded-lg transition-all duration-500 ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"} 
                      ${isActive ? "text-white bg-[#1f39a1] shadow-md" : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"}`}
                    >
                      <Icon className="w-5 h-5" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </NavLink>
                  </li>
                );
              })}

              {/* Boshqarish tugmasi va Dropdown */}
              <li ref={dropdownRef} className="relative">
                <button
                  onClick={handleBoshqarishClick}
                  className={`w-full flex items-center rounded-lg transition-all duration-500 outline-none ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"} 
                  ${isSettingsActive ? "bg-[#1f39a1] text-white shadow-md" : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"}`}
                >
                  <SettingsIcon
                    className={`w-5 h-5 transition-transform ${isSettingsOpen && !isCollapsed ? "rotate-90" : ""}`}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 text-left">Boshqarish</span>
                  )}
                  {!isCollapsed && (
                    <span
                      className={`text-[10px] transition-transform ${isSettingsOpen ? "" : "rotate-90"}`}
                    >
                      ▶
                    </span>
                  )}
                </button>




                {/* Dropdown menyu */}
                {!isCollapsed && (
                  <div
                    className={`fixed left-64 top-0 w-64 h-full bg-white shadow-2xl z-20 py-3 border-l border-gray-100 flex flex-col 
    transition-all duration-500 ease-in-out transform
    ${isSettingsOpen ? "translate-x-0 opacity-100 visible" : "-translate-x-4 opacity-0 invisible"}`}
                  >
                    {/* Sarlavha qismi */}
                    <div className="px-4 pb-3 border-b font-semibold text-gray-800 flex justify-between items-center">
                      <span>Menu</span>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Elementlar ro'yxati */}
                    <div className="mt-4 space-y-1">
                      {settingsItems.map((item) => (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsSettingsOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all duration-300
            ${isActive ? "bg-[#1f39a1] text-white" : "text-gray-600 hover:bg-blue-50"}`
                          }
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}


                

                {/* Dropdown menyu
                {!isCollapsed && isSettingsOpen && (
                  <div className="fixed left-64 top-0 w-64 h-full bg-white shadow-2xl z-20 py-3 border-l border-gray-100 flex flex-col">
                    <div className="px-4 pb-3 border-b font-semibold text-gray-800 flex justify-between items-center">
                      <span>Menu</span>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-4 space-y-1">
                      {settingsItems.map((item) => (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsSettingsOpen(false)}
                          className={({
                            isActive,
                          }) => `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all 
                            ${isActive ? "bg-[#1f39a1] text-white" : "text-gray-600 hover:bg-blue-50"}`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )} */}
              </li>
            </ul>
          </nav>
        </div>

        {/* Obuna kartasi (Tolov qismi) */}
        {!isCollapsed && (
          <div className="p-6">
            <div className="bg-gradient-to-r from-[#f0f4ff] to-red-50 rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Obuna</h3>
                  <p className="text-gray-600 text-sm">Obunangiz tugagan</p>
                </div>
                <WarningIcon className="text-2xl text-orange-500" />
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Qolgan kunlar</span>
                  <span className="font-semibold text-[#1f39a1]">5 / 30</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#1f39a1] h-2 rounded-full"
                    style={{ width: "16%" }}
                  />
                </div>
              </div>
              <button className="w-full bg-[#1f39a1] hover:bg-[#162870] text-white font-normal py-2 px-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <span>🔄</span> Obunani yangilash{" "}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Obuna muddati tugashiga 5 kun qoldi{" "}
              </p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}


// room


// import { useEffect, useState } from "react";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import CloseIcon from "@mui/icons-material/Close";
// import api from "../../services/axios"; 

// // const branches = [
// //   { id: 1, name: "AICoder markazi" },
// //   { id: 2, name: "Fizika va Matematika" },
// //   { id: 3, name: "4-maktab" },
// //   { id: 4, name: "Niner markazi" },
// //   { id: 5, name: "IELTS full mock" },
// //   { id: 6, name: "IELTS full mock centre" },
// //   { id: 7, name: "Arxiv" },
// // ];

// // const initialRooms = [
// //   { id: 1, name: "genious room", capacity: 15, branchId: 1 },
// //   { id: 2, name: "Impact room", capacity: 12, branchId: 1 },
// //   { id: 3, name: "1A", capacity: 25, branchId: 1 },
// //   { id: 4, name: "205-xona", capacity: 32, branchId: 1 },
// //   { id: 5, name: "16-xona", capacity: 18, branchId: 1 },
// //   { id: 6, name: "5 xona", capacity: 30, branchId: 1 },
// //   { id: 7, name: "IELTS with Islombek", capacity: 20, branchId: 1 },
// //   { id: 8, name: "Beginner", capacity: 18, branchId: 1 },
// //   { id: 9, name: "99", capacity: 25, branchId: 1 },
// // ];


// export default function Rooms() {
//   // const [activeBranch, setActiveBranch] = useState(1);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editRoom, setEditRoom] = useState(null);
//   const [form, setForm] = useState({ name: "", capacity: "" });
//   const[rooms, setRooms] = useState([])
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [saving, setSaving] = useState(false);

//  // Xonalarni yuklash
//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/rooms"); // 👈 Token avtomatik qo'shiladi
      
//       if (res.status === 200) {
//         setRooms(res.data.data);
//       }
//     } catch (error) {
//       console.error("Xonalarni yuklashda xatolik:", error);
//       if (error.response?.status === 401) {
//         console.log("Token yo'q yoki eskirgan, qayta login qiling");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };


//     // 🆕 Yangi xona qo'shish (Backendga)
//   const addRoom = async (roomData) => {
//     try {
//       const res = await api.post("/rooms", {
//         name: roomData.name,
//         capacity: roomData.capacity,
//         // branchId: activeBranch,
//       });
//       if (res.status === 201) {
//         setRooms([...rooms, res.data.data]);
//         return true;
//       }
//     } catch (error) {
//       console.error("Xona qo'shishda xatolik:", error);
//       alert(error.response?.data?.message || "Xona qo'shishda xatolik yuz berdi");
//       return false;
//     }
//   };



//     // ✏️ Xona tahrirlash (Backendga)
//   const updateRoom = async (id, roomData) => {
//     try {
//       const res = await api.patch(`/rooms/${id}`, {
//         name: roomData.name,
//         capacity: roomData.capacity,
//       });
//       if (res.status === 200) {
//         setRooms(rooms.map(r => r.id === id ? res.data.data : r));
//         return true;
//       }
//     } catch (error) {
//       console.error("Xona tahrirlashda xatolik:", error);
//       alert(error.response?.data?.message || "Xona tahrirlashda xatolik yuz berdi");
//       return false;
//     }
//   };

//     // 🗑️ Xona o'chirish (Backendga)
//   const deleteRoom = async (id) => {
//     try {
//       const res = await api.delete(`/rooms/${id}`);
//       if (res.status === 200) {
//         setRooms(rooms.filter(r => r.id !== id));
//         return true;
//       }
//     } catch (error) {
//       console.error("Xona o'chirishda xatolik:", error);
//       alert(error.response?.data?.message || "Xona o'chirishda xatolik yuz berdi");
//       return false;
//     }
//   };


//   const filteredRooms = rooms.filter((r) => 
//     r.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const openAddDrawer = () => {
//     setEditRoom(null);
//     setForm({ name: "", capacity: "" });
//     setDrawerOpen(true);
//   };

//   const openEditDrawer = (room) => {
//     setEditRoom(room);
//     setForm({ name: room.name, capacity: room.capacity });
//     setDrawerOpen(true);
//   };

//   const closeDrawer = () => {
//     setDrawerOpen(false);
//     setEditRoom(null);
//     setForm({ name: "", capacity: "" });
//   };

//     // 💾 Saqlash (Backendga yuborish)
//   const handleSave = async () => {
//     if (!form.name.trim() || !form.capacity) return;
    
//     setSaving(true);
    
//     if (editRoom) {
//       // Tahrirlash
//       await updateRoom(editRoom.id, {
//         name: form.name,
//         capacity: Number(form.capacity),
//       });
//     } else {
//       // Yangi qo'shish
//       await addRoom({
//         name: form.name,
//         capacity: Number(form.capacity),
//       });
//     }
    
//     setSaving(false);
//     closeDrawer();
//   };



//     // 🗑️ O'chirish
//   const handleDelete = async (id) => {
//     if (window.confirm("Bu xonani o'chirmoqchimisiz?")) {
//       await deleteRoom(id);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f39a1]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-center justify-between mb-5 gap-4">
//           <div className="flex items-center gap-2 w-full sm:w-auto">
//             <h2 className="text-base font-semibold text-gray-800">Xonalar</h2>

//             <button 
//               onClick={fetchRooms}
//               className="text-gray-400 hover:text-[#1f39a1] transition-colors duration-200"
//               title="Yangilash"
//             >
//               <RefreshIcon className="w-4 h-4" />
//             </button>
//           </div>



//           {/* Qidiruv Inputi (Search) */}
//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Xona nomi bo'yicha qidirish..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-3 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/20 focus:border-[#1f39a1] transition-all"
//             />
//           </div>

//           <button
//             onClick={openAddDrawer}
//             className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#1f39a1] hover:bg-[#162870] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
//           >
//             <AddIcon className="w-5 h-5" />
//             Xona qo'shish
//           </button>
//         </div>

//         {/* Branch tabs */}
//         {/* <div className="flex gap-2 flex-wrap mb-6">
//           {branches.map((branch) => (
//             <button
//               key={branch.id}
//               onClick={() => setActiveBranch(branch.id)}
//               className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
//                 activeBranch === branch.id
//                   ? "bg-[#f0f4ff] text-[#1f39a1] shadow-sm"
//                   : "text-[#4a5568] hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
//               }`}
//             >
//               {branch.name}
//             </button>
//           ))}
//         </div> */}



//         {/* Rooms grid */}
//         {filteredRooms.length === 0 ? (
//           <p className="text-gray-400 text-sm text-center py-12">
//             Xonalar mavjud emas
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//             {filteredRooms.map((room) => (
//               <div
//                 key={room.id}
//                 className="flex items-center justify-between bg-white hover:bg-[#f0f4ff] border border-gray-100 hover:border-[#1f39a1]/20 rounded-xl px-4 py-3 transition-all duration-300 group shadow-sm hover:shadow-md"
//               >
//                 <div>
//                   <p className="text-sm font-medium text-[#4a5568]">
//                     {room.name}
//                   </p>
//                   <p className="text-xs text-gray-400 mt-0.5">
//                     Sig'imi: {room.capacity}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <button
//                     onClick={() => handleDelete(room.id)}
//                     className="p-1.5 rounded-lg hover:bg-red-50/70 text-gray-400 hover:text-red-500 transition-all duration-200"
//                   >
//                     <DeleteIcon className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => openEditDrawer(room)}
//                     className="p-1.5 rounded-lg hover:bg-[#f0f4ff] text-gray-400 hover:text-[#1f39a1] transition-all duration-200"
//                   >
//                     <EditIcon className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>




//       {/* Overlay */}
//       {drawerOpen && (
//         <div className="fixed inset-0 bg-black/20 z-40" onClick={closeDrawer} />
//       )}

//       {/* Drawer */}
//       <div
//         className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
//           drawerOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <h3 className="font-semibold text-gray-800">
//             {editRoom ? "Xonani tahrirlash" : "Xonani qo'shish"}
//           </h3>
//           <button
//             onClick={closeDrawer}
//             className="text-gray-400 hover:text-[#1f39a1] transition-colors duration-200"
//           >
//             <CloseIcon className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="flex-1 px-6 py-6 space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Nomi <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Xona nomi"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 focus:border-[#1f39a1] transition-all duration-200"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Sig'imi <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               placeholder="Masalan: 20"
//               value={form.capacity}
//               onChange={(e) => setForm({ ...form, capacity: e.target.value })}
//               className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 focus:border-[#1f39a1] transition-all duration-200"
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
//           <button
//             onClick={closeDrawer}
//             className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all"
//           >
//             Bekor qilish
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!form.name.trim() || !form.capacity}
//             className="px-5 py-2 text-sm font-medium text-white bg-[#1f39a1] hover:bg-[#162870] rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//           >
//             Saqlash
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }













// import { useEffect, useState } from "react";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import CloseIcon from "@mui/icons-material/Close";
// import api from "../../services/axios";

// export default function Rooms() {
//   const [activeBranch, setActiveBranch] = useState(1);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editRoom, setEditRoom] = useState(null);
//   const [form, setForm] = useState({ name: "", capacity: "" });
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [saving, setSaving] = useState(false);

//   // Xonalarni yuklash
//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/rooms");
//        if (res.status === 200) {
//       console.log("Backend ma'lumotlari:", res.data);
      
//       // Agar ma'lumotlar res.data.data ichida bo'lsa
//       const roomsData = res.data.data || [];
      
//       // Har bir roomda name maydoni borligini tekshirish
//       roomsData.forEach((room, index) => {
//         if (!room.name) {
//           console.warn(`${index}-chi roomda name maydoni yo'q:`, room);
//         }
//       });
      
//       setRooms(roomsData);
//     }
//     } catch (error) {
//       console.error("Xonalarni yuklashda xatolik:", error);
//       if (error.response?.status === 401) {
//         console.log("Token yo'q yoki eskirgan, qayta login qiling");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🆕 Yangi xona qo'shish (Backendga)
//   const addRoom = async (roomData) => {
//     try {
//       const res = await api.post("/rooms", {
//         name: roomData.name,
//         capacity: roomData.capacity,
//         branchId: activeBranch,
//       });
//       if (res.status === 201) {
//         setRooms([...rooms, res.data.data]);
//         return true;
//       }
//     } catch (error) {
//       console.error("Xona qo'shishda xatolik:", error);
//       alert(error.response?.data?.message || "Xona qo'shishda xatolik yuz berdi");
//       return false;
//     }
//   };

//   // ✏️ Xona tahrirlash (Backendga)
//   const updateRoom = async (id, roomData) => {
//     try {
//       const res = await api.patch(`/rooms/${id}`, {
//         name: roomData.name,
//         capacity: roomData.capacity,
//       });
//       if (res.status === 200) {
//         setRooms(rooms.map(r => r.id === id ? res.data.data : r));
//         return true;
//       }
//     } catch (error) {
//       console.error("Xona tahrirlashda xatolik:", error);
//       alert(error.response?.data?.message || "Xona tahrirlashda xatolik yuz berdi");
//       return false;
//     }
//   };

//   // 🗑️ Xona o'chirish (Backendga)
//   const deleteRoom = async (id) => {
//     try {
//       const res = await api.delete(`/rooms/${id}`);
//       if (res.status === 200) {
//         setRooms(rooms.filter(r => r.id !== id));
//         return true;
//       }
//     } catch (error) {
//       console.error("Xona o'chirishda xatolik:", error);
//       alert(error.response?.data?.message || "Xona o'chirishda xatolik yuz berdi");
//       return false;
//     }
//   };

//  // ✅ XAVFSIZ FILTR (xatolikni oldini oladi)
//   const filteredRooms = rooms.filter((room) => {
//     // Agar room yoki room.name mavjud bo'lmasa, filtrlashda o'tkazib yubor
//     if (!room || !room.name) return false;
    
//     const searchLower = searchTerm?.toLowerCase() || '';
//     return room.name.toLowerCase().includes(searchLower);
//   });

//   // ✅ XAVFSIZ RENDER (ma'lumotlar borligini tekshirish)
//   const renderRooms = () => {
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f39a1]"></div>
//         </div>
//       );
//     }

//     if (!rooms || rooms.length === 0) {
//       return (
//         <p className="text-gray-400 text-sm text-center py-12">
//           Xonalar mavjud emas
//         </p>
//       );
//     }

//     if (filteredRooms.length === 0) {
//       return (
//         <p className="text-gray-400 text-sm text-center py-12">
//           Qidiruv bo'yicha xonalar topilmadi
//         </p>
//       );
//     }


//        return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//         {filteredRooms.map((room) => (
//           <div
//             key={room.id}
//             className="flex items-center justify-between bg-white hover:bg-[#f0f4ff] border border-gray-100 hover:border-[#1f39a1]/20 rounded-xl px-4 py-3 transition-all duration-300 group shadow-sm hover:shadow-md"
//           >
//             <div>
//               <p className="text-sm font-medium text-[#4a5568]">
//                 {room.name || 'Noma\'lum'}
//               </p>
//               <p className="text-xs text-gray-400 mt-0.5">
//                 Sig'imi: {room.capacity || 0}
//               </p>
//             </div>
//             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               <button
//                 onClick={() => handleDelete(room.id)}
//                 className="p-1.5 rounded-lg hover:bg-red-50/70 text-gray-400 hover:text-red-500 transition-all duration-200"
//               >
//                 <DeleteIcon className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => openEditDrawer(room)}
//                 className="p-1.5 rounded-lg hover:bg-[#f0f4ff] text-gray-400 hover:text-[#1f39a1] transition-all duration-200"
//               >
//                 <EditIcon className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const openAddDrawer = () => {
//     setEditRoom(null);
//     setForm({ name: "", capacity: "" });
//     setDrawerOpen(true);
//   };

//   const openEditDrawer = (room) => {
//     setEditRoom(room);
//     setForm({ name: room.name, capacity: room.capacity });
//     setDrawerOpen(true);
//   };

//   const closeDrawer = () => {
//     setDrawerOpen(false);
//     setEditRoom(null);
//     setForm({ name: "", capacity: "" });
//   };

//   // 💾 Saqlash (Backendga yuborish)
//   const handleSave = async () => {
//     if (!form.name.trim() || !form.capacity) return;
    
//     setSaving(true);
    
//     if (editRoom) {
//       // Tahrirlash
//       await updateRoom(editRoom.id, {
//         name: form.name,
//         capacity: Number(form.capacity),
//       });
//     } else {
//       // Yangi qo'shish
//       await addRoom({
//         name: form.name,
//         capacity: Number(form.capacity),
//       });
//     }
    
//     setSaving(false);
//     closeDrawer();
//   };

//   // 🗑️ O'chirish
//   const handleDelete = async (id) => {
//     if (window.confirm("Bu xonani o'chirmoqchimisiz?")) {
//       await deleteRoom(id);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f39a1]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-center justify-between mb-5 gap-4">
//           <div className="flex items-center gap-2 w-full sm:w-auto">
//             <h2 className="text-base font-semibold text-gray-800">Xonalar</h2>
//             <button 
//               onClick={fetchRooms}
//               className="text-gray-400 hover:text-[#1f39a1] transition-colors duration-200"
//               title="Yangilash"
//             >
//               <RefreshIcon className="w-4 h-4" />
//             </button>
//           </div>

//           {/* Qidiruv Inputi */}
//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Xona nomi bo'yicha qidirish..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-3 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/20 focus:border-[#1f39a1] transition-all"
//             />
//           </div>

//           <button
//             onClick={openAddDrawer}
//             className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#1f39a1] hover:bg-[#162870] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
//           >
//             <AddIcon className="w-5 h-5" />
//             Xona qo'shish
//           </button>
//         </div>

//         {/* Rooms grid */}
//         {filteredRooms.length === 0 ? (
//           <p className="text-gray-400 text-sm text-center py-12">
//             Xonalar mavjud emas
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//             {filteredRooms.map((room) => (
//               <div
//                 key={room.id}
//                 className="flex items-center justify-between bg-white hover:bg-[#f0f4ff] border border-gray-100 hover:border-[#1f39a1]/20 rounded-xl px-4 py-3 transition-all duration-300 group shadow-sm hover:shadow-md"
//               >
//                 <div>
//                   <p className="text-sm font-medium text-[#4a5568]">
//                     {room.name}
//                   </p>
//                   <p className="text-xs text-gray-400 mt-0.5">
//                     Sig'imi: {room.capacity}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <button
//                     onClick={() => handleDelete(room.id)}
//                     className="p-1.5 rounded-lg hover:bg-red-50/70 text-gray-400 hover:text-red-500 transition-all duration-200"
//                   >
//                     <DeleteIcon className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => openEditDrawer(room)}
//                     className="p-1.5 rounded-lg hover:bg-[#f0f4ff] text-gray-400 hover:text-[#1f39a1] transition-all duration-200"
//                   >
//                     <EditIcon className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Overlay */}
//       {drawerOpen && (
//         <div className="fixed inset-0 bg-black/20 z-40" onClick={closeDrawer} />
//       )}

//       {/* Drawer */}
//       <div
//         className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
//           drawerOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <h3 className="font-semibold text-gray-800">
//             {editRoom ? "Xonani tahrirlash" : "Xonani qo'shish"}
//           </h3>
//           <button
//             onClick={closeDrawer}
//             className="text-gray-400 hover:text-[#1f39a1] transition-colors duration-200"
//           >
//             <CloseIcon className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="flex-1 px-6 py-6 space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Nomi <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Xona nomi"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 focus:border-[#1f39a1] transition-all duration-200"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Sig'imi
//             </label>
//             <input
//               type="number"
//               placeholder="Masalan: 20"
//               value={form.capacity}
//               onChange={(e) => setForm({ ...form, capacity: e.target.value })}
//               className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 focus:border-[#1f39a1] transition-all duration-200"
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
//           <button
//             onClick={closeDrawer}
//             className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all"
//           >
//             Bekor qilish
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!form.name.trim() || !form.capacity || saving}
//             className="px-5 py-2 text-sm font-medium text-white bg-[#1f39a1] hover:bg-[#162870] rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//           >
//             {saving ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Saqlanmoqda...
//               </div>
//             ) : (
//               "Saqlash"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }





// teacher page


// // export default function TeachersPage() {
// //   return (
// //     <>
// //     Teachers
// //     </>

// //   );
// // }

// import { useEffect, useState } from "react";
// import AddIcon from "@mui/icons-material/Add";
// import SearchIcon from "@mui/icons-material/Search";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import CloseIcon from "@mui/icons-material/Close";

// export default function TeachersPage() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [search, setSearch] = useState("");

//   const teachers = Array.from({ length: 38 }, () => ({
//     name: "Qwerty qwert",
//     group: "123 123",
//     phone: "+998 33 408 28 08",
//     date: "24 Jan 2022",
//     date_register: "24 Jan 2022",
//   }));

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // const totalPages = Math.ceil(teachers.length / itemsPerPage);

//   // const currentData = teachers.slice(
//   //   (currentPage - 1) * itemsPerPage,
//   //   currentPage * itemsPerPage,
//   // );

//   const filteredTeachers = teachers.filter((t) =>
//     `${t.name} ${t.phone} ${t.group}`
//       .toLowerCase()
//       .includes(search.toLowerCase()),
//   );

//   const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

//   const currentData = filteredTeachers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   useEffect(() => {
//   setCurrentPage(1);
//   }, [search]);

//   return (
//     <div className=" p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">O'qituvchilar</h1>
//           <p className="text-gray-500 text-sm">
//             O‘qituvchilar ro‘yxati va ma’lumotlari
//           </p>
//         </div>

//         <button
//           onClick={() => setIsOpen(true)}
//           className="bg-[#1f39a1] hover:bg-[#162870] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
//         >
//           <AddIcon />
//           O‘qituvchi qo‘shish
//         </button>
//       </div>

//       {/* Search */}
//       <div className="mb-4 flex justify-between">
//         <div className="relative w-80">
//           <SearchIcon className="absolute top-2.5 left-3 text-gray-400" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Qidirish..."
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f39a1]"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow">
//         <table className="w-full text-sm">
//           <thead className="text-gray-500 ">
//             <tr >
//               <th className="p-3 text-left">Nomi</th>
//               <th className="p-3 text-left">Guruh</th>
//               <th className="p-3 text-left">Telefon raqamlari</th>
//               <th className="p-3 text-left">Tug'ilgan sanasi</th>
//               <th className="p-3 text-left">Yaratilgan sana</th>
//               <th className="p-3"></th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentData.map((t, i) => (
//               <tr key={i} className=" hover:bg-gray-50">
//                 <td className="p-3">{t.name}</td>
//                 <td className="p-3">{t.group}</td>
//                 <td className="p-3">{t.phone}</td>
//                 <td className="p-3">{t.date}</td>
//                 <td className="p-3">{t.date_register}</td>

//                 <td className="p-3 flex gap-3 text-gray-500">
//                   <VisibilityIcon className="cursor-pointer hover:text-blue-500" />
//                   <EditIcon className="cursor-pointer hover:text-green-500" />
//                   <DeleteIcon className="cursor-pointer hover:text-red-500" />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-between items-center p-4">
//         <button
//           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           className="px-3 py-1 border rounded-lg"
//         >
//           Previous
//         </button>

//         <div className="flex gap-2">
//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 rounded-lg ${
//                 currentPage === i + 1 ? "bg-[#1f39a1] text-white" : "border"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//           className="px-3 py-1 border rounded-lg"
//         >
//           Next
//         </button>
//       </div>

//       {/* Drawer (Right panel) */}
//       <div
//         className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transform transition-all duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="font-semibold text-lg">O‘qituvchi qo‘shish</h2>
//           <CloseIcon
//             className="cursor-pointer"
//             onClick={() => setIsOpen(false)}
//           />
//         </div>

//         {/* Form */}
//         <div className="p-4 space-y-4">
//           <input
//             type="text"
//             placeholder="Telefon raqam"
//             className="w-full border p-2 rounded-lg"
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full border p-2 rounded-lg"
//           />

//           <input
//             type="text"
//             placeholder="F.I.O"
//             className="w-full border p-2 rounded-lg"
//           />

//           <input type="date" className="w-full border p-2 rounded-lg" />

//           <select className="w-full border p-2 rounded-lg">
//             <option>Guruh tanlang</option>
//           </select>

//           <div>
//             <label className="text-sm text-gray-600">Jinsi</label>
//             <div className="flex gap-4 mt-2">
//               <label className="flex items-center gap-2">
//                 <input type="radio" name="gender" value="male" />
//                 Erkak
//               </label>
//               <label className="flex items-center gap-2">
//                 <input type="radio" name="gender" value="female" />
//                 Ayol
//               </label>
//             </div>
//           </div>

//           <div>
//             <label className="text-sm text-gray-600">Surati</label>

//             <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
//               <input type="file" className="hidden" id="fileUpload" />
//               <label htmlFor="fileUpload" className="cursor-pointer">
//                 <p className="text-gray-500 text-sm">
//                   Click to upload yoki drag & drop
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   PNG yoki JPG (max 800x800)
//                 </p>
//               </label>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               onClick={() => setIsOpen(false)}
//               className="px-4 py-2 border rounded-lg"
//             >
//               Bekor qilish
//             </button>
//             <button className="px-4 py-2 bg-[#1f39a1] text-white rounded-lg">
//               Saqlash
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// async getAllGroups(search: filterDto) {
//     const { groupName, max_student, status } = search;
//     let searchWhere = {};

//     if (status) {
//       searchWhere["status"] = status;
//     } else {
//       searchWhere["status"] = "active"; // default
//     }

//     if (groupName) searchWhere["name"] = groupName;
//     if (max_student) searchWhere["max_student"] = +max_student;

//     const groups = await this.prisma.group.findMany({
//       where: searchWhere,
//       select: {
//         id: true,
//         name: true,
//         max_student: true,
//         start_date: true,
//         start_time: true,
//         week_day: true,
//         status: true,
//         description:true,
//         courses: {
//           select: {
//             id: true,
//             name: true,
//             duration_month: true, // Kurs necha oy davom etishi
//             duration_hours: true, // Jami dars soatlari
//           },
//         },
//         rooms: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         groupTeachers: {
//           select: {
//             teacher: {
//               select: {
//                 id: true,
//                 full_name: true,
//               },
//             },
//           },
//         },
//         studentGroups: {
//           select: {
//             students: {
//               select: {
//                 _count: true,
//                 id: true,
//                 full_name:true
//               },
//             },
//           },
//         },
//       },
//     });

//     const dataFormatter = groups.map((el) => ({
//       id: el.id,
//       name: el.name,
//       start_date: el.start_date,
//       start_time: el.start_time,
//       weekDay: el.week_day,
//       status: el.status,
//       description: el.description,
//       course: el.courses?.name || "Noma'lum",
//       course_duration_month: el.courses?.duration_month || 0,
//       course_duration_hours: el.courses?.duration_hours || 0,
//       room: el.rooms?.name || "Noma'lum",
//       teachers: el.groupTeachers?.map((gt) => gt.teacher) || [],
//       students: el.studentGroups?.map((sg) => sg.students) || [],
//       student_count: el.studentGroups?.length || 0,
//     }));

//     return {
//       success: true,
//       data: dataFormatter,
//     };
//   }