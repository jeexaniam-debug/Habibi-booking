import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

function ProtectedRoute({ children, allowedRole }) {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        if (user.role === "ADMIN") {
            return <Navigate to="/admin" replace />;
        }

        return <Navigate to="/customer" replace />;
    }

    return children || <Outlet />;
}

export default ProtectedRoute;