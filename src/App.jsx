import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Sahifalar
import Login from "./pages/Login";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Teachers = lazy(() => import("./pages/Teachers"));
const Groups = lazy(() => import("./pages/Groups/index.jsx"));
const GroupInner = lazy(() => import("./pages/Groups/GroupInner"));
const Students = lazy(() => import("./pages/Students"));
const Courses = lazy(() => import("./pages/Settings/Courses"));
const Rooms = lazy(() => import("./pages/Settings/Rooms"));
const Staff = lazy(() => import("./pages/Settings/Staff"));
const Messages = lazy(() => import("./pages/Settings/Messages"));
const SettingsIndex = lazy(() => import("./pages/Settings/Index"));

// Loading komponenti
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full w-full py-20">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

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
                    <Suspense fallback={<PageLoader />}>
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
                    </Suspense>
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