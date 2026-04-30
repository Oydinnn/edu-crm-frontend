import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardPage from "../components/DashboardPage";

export default function Dashboard() {
  return (
    <div>
      <Sidebar />
      <Navbar />
      <DashboardPage />
    </div>
  );
}
