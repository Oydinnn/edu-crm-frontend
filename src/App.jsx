// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Teachers from "./pages/Teachers";
// import Classes from "./pages/Classes";
// import Students from "./pages/Students";
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";

// // Settings va uning ichidagi componentalar
// import Settings from "./pages/Settings/Index";
// import Courses from "./pages/Settings/Courses";
// import Rooms from "./pages/Settings/Rooms";
// import Staff from "./pages/Settings/Staff";
// import Messages from "./pages/Settings/Messages";

// // Layout - Sidebar va Navbar bilan
// function Layout({ children }) {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 ml-64 flex flex-col">
//         <Navbar />
//         <main className="flex-1 p-6 bg-gray-50 min-h-screen">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Login - Sidebar yo'q */}
//         <Route path="/login" element={<Login />} />
//         // App.jsx ga bitta qator qo'shing
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />

//         {/* Barcha sahifalar Layout bilan */}
//         <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
//         <Route path="/teachers" element={<Layout><Teachers /></Layout>} />
//         <Route path="/classes" element={<Layout><Classes /></Layout>} />
//         <Route path="/students" element={<Layout><Students /></Layout>} />

//         {/* Settings - nested routes */}
//         <Route path="/settings" element={<Layout><Settings /></Layout>}>
//           <Route path="courses" element={<Courses />} />
//           <Route path="rooms" element={<Rooms />} />
//           <Route path="staff" element={<Staff />} />
//           <Route path="messages" element={<Messages />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// // App.jsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { SidebarProvider } from "./contexts/SidebarContext";
// import Layout from "./components/Layout";

// // Sahifalar
// import Dashboard from "./pages/Dashboard";
// import Teachers from "./pages/Teachers";
// import Classes from "./pages/Classes";
// import Students from "./pages/Students";
// import Courses from "./pages/settings/Courses";
// import Rooms from "./pages/settings/Rooms";
// import Staff from "./pages/settings/Staff";
// import Messages from "./pages/settings/Messages";

// function App() {
//   return (
//     <SidebarProvider>
//       <BrowserRouter>
//         <Layout>
//           <Routes>
//                     {/* Root yo'nalish — dashboard'ga yo'naltirish */}
//             <Route path="/" element={<Navigate to="/login" replace />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/teachers" element={<Teachers />} />
//             <Route path="/classes" element={<Classes />} />
//             <Route path="/students" element={<Students />} />
//             <Route path="/settings/courses" element={<Courses />} />
//             <Route path="/settings/rooms" element={<Rooms />} />
//             <Route path="/settings/staff" element={<Staff />} />
//             <Route path="/settings/messages" element={<Messages />} />
//             <Route path="/" element={<Dashboard />} />
//           </Routes>
//         </Layout>
//       </BrowserRouter>
//     </SidebarProvider>
//   );
// }

// export default App;











// // src/App.jsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { SidebarProvider } from "./contexts/SidebarContext";
// import { AuthProvider, useAuth } from "./contexts/AuthContext";
// import Layout from "./components/Layout";
// import ProtectedRoute from "./components/ProtectedRoute";

// // Sahifalar
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Teachers from "./pages/Teachers";
// import Classes from "./pages/Classes";
// import Students from "./pages/Students";
// import Courses from "./pages/settings/Courses";
// import Rooms from "./pages/settings/Rooms";
// import Staff from "./pages/settings/Staff";
// import Messages from "./pages/settings/Messages";
// import SettingsIndex from "./pages/Settings/Index";
// import Index from "./pages/Settings/Index";

// // Root yo'naltirish — auth holatiga qarab
// function RootRedirect() {
//   const { isAuthenticated } = useAuth();
//   return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
// }

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Login — Layout'siz, ochiq */}
//           <Route path="/login" element={<Login />} />

//           {/* Himoyalangan sahifalar — Layout bilan */}
//           <Route
//             path="/*"
//             element={
//               <ProtectedRoute>
//                 <SidebarProvider>
//                   <Layout>
//                     <Routes>
//                       <Route path="/" element={<RootRedirect />} />
//                       <Route path="/dashboard" element={<Dashboard />} />
//                       <Route path="/teachers" element={<Teachers />} />
//                       <Route path="/classes" element={<Classes />} />
//                       <Route path="/students" element={<Students />} />

//                       <Route path="/settings" element={<Index />}>
//                         {/* /settings o'ziga kirganda avtomatik Kurslarga yuboradi */}
//                         <Route
//                           index
//                           element={<Navigate to="courses" replace />}
//                         />
//                         <Route path="courses" element={<Courses />} />
//                         <Route path="rooms" element={<Rooms />} />
//                         <Route path="staff" element={<Staff />} />
//                         <Route path="messages" element={<Messages />} />
//                       </Route>

//                       {/* <Route path="/settings/courses" element={<Courses />} />
//                       <Route path="/settings/rooms" element={<Rooms />} />
//                       <Route path="/settings/staff" element={<Staff />} />
//                       <Route path="/settings/messages" element={<Messages />} /> */}

//                       <Route
//                         path="*"
//                         element={<Navigate to="/dashboard" replace />}
//                       />
//                     </Routes>
//                   </Layout>
//                 </SidebarProvider>
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;










import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Sahifalar
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Students from "./pages/Students";
import Courses from "./pages/settings/Courses";
import Rooms from "./pages/settings/Rooms";
import Staff from "./pages/settings/Staff";
import Messages from "./pages/settings/Messages";
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
                      <Route path="classes" element={<Classes />} />
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
    </AuthProvider>
  );
}

export default App;