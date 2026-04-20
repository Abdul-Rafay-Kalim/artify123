import { Navigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAdmin();

  if (!isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
