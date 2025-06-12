import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.contexts";
interface RouteProps {
  children: JSX.Element;
}

// 🔐 Protected route
const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// 🔓 Public-only route
export const PublicOnlyRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

export const HelperLogout = () => {
  const { logout } = useAuth();
  return logout();
};
export default ProtectedRoute;
