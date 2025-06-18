import React from "react";
import { useApp } from "../../context/AppContext";
import { Navigate, useLocation } from "react-router-dom";

const AuthGuard = ({ children }) => {
    const { user } = useApp();
    const location = useLocation();

    if (!user.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AuthGuard;