import type { FunctionComponent, JSX } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

interface RoleGuardProps {
    allowedRoles: string[];
    children: JSX.Element;
}

const RoleGuard: FunctionComponent<RoleGuardProps> = ({children, allowedRoles}) => {
    const { user, isAuthenticated, loading } = useAuth();
    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" />; 
    }

    return children;
    
}
 
export default RoleGuard;

