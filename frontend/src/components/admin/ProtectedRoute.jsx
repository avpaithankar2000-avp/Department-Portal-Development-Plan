import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { checkingSession, isAuthenticated } = useAuth();
  const location = useLocation();

  if (checkingSession) {
    return <div className="grid min-h-screen place-items-center bg-premium-light text-ink dark:bg-premium-dark dark:text-white">Checking admin session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
