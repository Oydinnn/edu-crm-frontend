import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TeachersPage from "../components/TeachersPage";

export default function Dashboard() {
  return (
    <div>
      <Sidebar />
      <Navbar />
      <TeachersPage />
    </div>
  );
}
