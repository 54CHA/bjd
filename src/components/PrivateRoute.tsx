import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/nickname" replace />;
  }

  return children;
};
