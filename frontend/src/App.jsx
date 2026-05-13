import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AIWidget from "./components/ui/AIWidget";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminResourcePage from "./pages/admin/AdminResourcePage";
import Analytics from "./pages/admin/Analytics";
import Login from "./pages/admin/Login";
import Reports from "./pages/admin/Reports";
import Achievements from "./pages/public/Achievements";
import Events from "./pages/public/Events";
import Home from "./pages/public/Home";
import Internships from "./pages/public/Internships";
import Placements from "./pages/public/Placements";

const App = () => (
  <>
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="internships" element={<Internships />} />
          <Route path="placements" element={<Placements />} />
        </Route>

        <Route path="admin/login" element={<Login />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminResourcePage resource="events" />} />
          <Route path="achievements" element={<AdminResourcePage resource="achievements" />} />
          <Route path="internships" element={<AdminResourcePage resource="internships" />} />
          <Route path="placements" element={<AdminResourcePage resource="placements" />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
    <AIWidget />
  </>
);

export default App;
