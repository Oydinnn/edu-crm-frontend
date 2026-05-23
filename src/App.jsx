import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Sahifalar
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teachers from "./pages/Teachers";
import Groups from "./pages/Groups/index.jsx";
import GroupInner from "./pages/Groups/GroupInner";
import Students from "./pages/Students";
import Courses from "./pages/Settings/Courses";
import Rooms from "./pages/Settings/Rooms";
import Staff from "./pages/Settings/Staff";
import Messages from "./pages/Settings/Messages";
import SettingsIndex from "./pages/Settings/Index";

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  // Agar auth yuklanayotgan bo'lsa (null bo'lsa), loading yoki bo'sh joy qaytaring
  if (isAuthenticated === null) return null; 
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <BrowserRouter>
        <Routes>
          {/* 1. Login har doim eng tepada va wildcard yo'ldan tashqarida bo'lishi shart */}
          <Route path="/login" element={<Login />} />

          {/* 2. Barcha himoyalangan sahifalar bitta '/*' bloki ichida */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Layout>
                    <Routes>
                      {/* Bosh sahifaga kirganda (/) auth holatiga ko'ra yo'naltirish */}
                      <Route path="/" element={<RootRedirect />} />
                      
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="teachers" element={<Teachers />} />
                      <Route path="groups" element={<Groups />} />
                      <Route path="groups/:id" element={<GroupInner />} />
                      <Route path="students" element={<Students />} />

                      {/* Settings (Boshqarish) nested yo'llari */}
                      <Route path="settings" element={<SettingsIndex />}>
                        <Route index element={<Navigate to="courses" replace />} />
                        <Route path="courses" element={<Courses />} />
                        <Route path="rooms" element={<Rooms />} />
                        <Route path="staff" element={<Staff />} />
                        <Route path="messages" element={<Messages />} />
                      </Route>

                      {/* Noma'lum yo'llarni dashboardga qaytarish */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;