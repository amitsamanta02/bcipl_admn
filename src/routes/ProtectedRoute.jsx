import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
    const { accessToken } = useSelector((state) => state.auth);
    // const accessToken = false;
    //If no token, redirect to login
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    //Otherwise, allow access to nested routes (like home/channels)
    return <Outlet />;
};

export default ProtectedRoute;