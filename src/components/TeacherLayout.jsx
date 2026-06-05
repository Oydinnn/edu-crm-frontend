import { useSidebar } from "../contexts/SidebarContext";
import TeacherSidebar from "./TeacherSidebar";
import Navbar from "./Navbar";

export default function TeacherLayout({ children }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      {/* Teacher Sidebar */}
      <TeacherSidebar />
      
      {/* Asosiy maydon */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Navbar />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
