import { useSidebar } from "../contexts/SidebarContext";
import StudentSidebar from "./StudentSidebar";
import Navbar from "./Navbar";

export default function StudentLayout({ children }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      {/* Student Sidebar */}
      <StudentSidebar />
      
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
