// export default function Navbar() {
//   return (
//     <main className=" flex-1">
//       <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 -z-10">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">
//             Salom, creator!
//           </h2>
//           <p className="text-gray-500 text-sm">
//             EduCRM platformasiga xush kelibsiz!
//           </p>
//         </div>

//         <div className="flex items-center gap-4">
//           <button className="relative p-2 text-[#4a5568] hover:text-[#1f39a1] hover:bg-[#f0f4ff] rounded-lg transition">
//             <span className="text-xl">🔔</span>
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//           </button>

//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-[#1f39a1] rounded-full flex items-center justify-center text-white font-bold">
//               C
//             </div>
//             <div className="hidden md:block">
//               <p className="text-sm font-medium">Creator</p>
//               <p className="text-xs text-gray-500">Admin</p>
//             </div>
//           </div>
//         </div>
//       </header>
//     </main>
//   );
// }













import { useSidebar } from "../contexts/SidebarContext";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-30">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Salom, creator!
        </h2>
        <p className="text-gray-500 text-sm">
          EduCRM platformasiga xush kelibsiz!
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-[#4a5568] hover:text-[#1f39a1] hover:bg-[#f0f4ff] rounded-lg transition">
          <span className="text-xl">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1f39a1] rounded-full flex items-center justify-center text-white font-bold">
            C
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Creator</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}