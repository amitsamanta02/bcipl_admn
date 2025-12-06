import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Dashboard from './pages/app/home/Dashboard';
import Login from './pages/auth/login/Login';
import ForgotPassword from './pages/auth/resetPassword/ForgotPassword';
import ResetPassword from './pages/auth/resetPassword/ResetPassword';



import Layout from './components/Layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';


function App() {

  const { accessToken ,refreshToken} = useSelector((state) => state.auth);
  console.log(accessToken, "accessToken in app")
  console.log(refreshToken, "refreshToken in app")

  // const accessToken = false;


  return (
    <Router>
      <Routes>

        {/* ---------- Public Routes (not logged in) ---------- */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>


        {/* ---------- Protected Routes (requires token) ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Dashboard />} />
          </Route>
        </Route>


        {/* Catch-all route (optional) */}
        <Route path="*" element={<Navigate to={accessToken ? "/home" : "/login"} replace />} />

      </Routes>
    </Router>
  );
}

export default App;