import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
    const { accessToken } = useSelector((state) => state.auth);
    // const accessToken = false;
    //If user is logged in, redirect to home
    if (accessToken) {
        return <Navigate to="/home" replace />;
    }

    //Otherwise, allow access to public routes like /login or /otp-verification
    return <Outlet />;
};

export default PublicRoute;