import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Layout from "./components/Layout";
import TeacherLayout from "./components/TeacherLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Sahifalar
import Login from "./pages/Login";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Teachers = lazy(() => import("./pages/Teachers"));
const Groups = lazy(() => import("./pages/Groups/index.jsx"));
const GroupInner = lazy(() => import("./pages/Groups/GroupInner"));
const GroupAddHomework = lazy(() => import("./pages/Groups/groupAddHomework"));
const HomeworkChecking = lazy(() => import("./pages/Groups/homeworkChecking"));
const HomeworkPending = lazy(() => import("./pages/Groups/HomeworkPending"));
const Students = lazy(() => import("./pages/Students"));
const Courses = lazy(() => import("./pages/Settings/Courses"));
const Rooms = lazy(() => import("./pages/Settings/Rooms"));
const Staff = lazy(() => import("./pages/Settings/Staff"));
const Messages = lazy(() => import("./pages/Settings/Messages"));
const SettingsIndex = lazy(() => import("./pages/Settings/Index"));

// Teacher sahifalari
const TeacherGroups = lazy(() => import("./pages/Teacher/TeacherGroups"));
const TeacherGatheringGroups = lazy(() => import("./pages/Teacher/TeacherGatheringGroups"));
const TeacherProfile = lazy(() => import("./pages/Teacher/TeacherProfile"));

// Loading komponenti
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full w-full py-20">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Role Guard — faqat ruxsat berilgan rollar uchun
function RoleGuard({ allowedRoles, children }) {
  const { role } = useAuth();
  const userRole = role || localStorage.getItem("role") || "";

  if (!allowedRoles.includes(userRole)) {
    // Role mos kelmasa, to'g'ri sahifaga yo'naltirish
    if (userRole === "TEACHER") {
      return <Navigate to="/teacher/groups" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  // Agar auth yuklanayotgan bo'lsa (null bo'lsa), loading yoki bo'sh joy qaytaring
  if (isAuthenticated === null) return null;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Role asosida yo'naltirish
  const userRole = role || localStorage.getItem("role") || "";
  if (userRole === "TEACHER") {
    return <Navigate to="/teacher/groups" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              {/* 1. Login har doim eng tepada */}
              <Route path="/login" element={<Login />} />

              {/* 2. Teacher paneli yo'llari */}
              <Route
                path="/teacher/*"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={["TEACHER"]}>
                      <SidebarProvider>
                        <TeacherLayout>
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              <Route path="groups" element={<TeacherGroups />} />
                              <Route path="groups/:id" element={<GroupInner />} />
                              <Route
                                path="groups/:id/homework/create"
                                element={<GroupAddHomework />}
                              />
                              <Route
                                path="groups/:id/homework/new"
                                element={<GroupAddHomework />}
                              />
                              <Route
                                path="groups/:id/homework/:homeworkId/checking"
                                element={<HomeworkChecking />}
                              />
                              <Route
                                path="groups/:id/homework/:homeworkId/pending/:studentId"
                                element={<HomeworkPending />}
                              />
                              <Route path="gathering-groups" element={<TeacherGatheringGroups />} />
                              <Route path="profile" element={<TeacherProfile />} />
                              <Route path="*" element={<Navigate to="/teacher/groups" replace />} />
                            </Routes>
                          </Suspense>
                        </TeacherLayout>
                      </SidebarProvider>
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              {/* 3. Admin/Superadmin paneli yo'llari */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={["ADMIN", "SUPERADMIN", ""]}>
                      <SidebarProvider>
                        <Layout>
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              {/* Bosh sahifaga kirganda auth holatiga ko'ra yo'naltirish */}
                              <Route path="/" element={<RootRedirect />} />

                              <Route path="dashboard" element={<Dashboard />} />
                              <Route path="teachers" element={<Teachers />} />
                              <Route path="groups" element={<Groups />} />
                              <Route
                                path="groups/:id/homework/create"
                                element={<GroupAddHomework />}
                              />
                              <Route
                                path="groups/:id/homework/new"
                                element={<GroupAddHomework />}
                              />
                              <Route
                                path="groups/:id/homework/:homeworkId/checking"
                                element={<HomeworkChecking />}
                              />
                              <Route
                                path="groups/:id/homework/:homeworkId/pending/:studentId"
                                element={<HomeworkPending />}
                              />
                              <Route path="groups/:id" element={<GroupInner />} />
                              <Route path="students" element={<Students />} />

                              {/* Settings (Boshqarish) nested yo'llari */}
                              <Route path="settings" element={<SettingsIndex />}>
                                <Route
                                  index
                                  element={<Navigate to="courses" replace />}
                                />
                                <Route path="courses" element={<Courses />} />
                                <Route path="rooms" element={<Rooms />} />
                                <Route path="staff" element={<Staff />} />
                                <Route path="messages" element={<Messages />} />
                              </Route>

                              {/* Noma'lum yo'llarni dashboardga qaytarish */}
                              <Route
                                path="*"
                                element={<Navigate to="/dashboard" replace />}
                              />
                            </Routes>
                          </Suspense>
                        </Layout>
                      </SidebarProvider>
                    </RoleGuard>
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
