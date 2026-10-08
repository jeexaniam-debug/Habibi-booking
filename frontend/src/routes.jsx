import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import CustomerDashboard
    from "./pages/customer/CustomerDashboard";

import Services
    from "./pages/customer/Services";

import CreateBooking
    from "./pages/customer/CreateBooking";

import MyBookings
    from "./pages/customer/MyBookings";

import AdminDashboard
    from "./pages/admin/AdminDashboard";

import ManageServices
    from "./pages/admin/ManageServices";

import ManageBookings
    from "./pages/admin/ManageBookings";

import ProtectedRoute
    from "./components/ProtectedRoute";

import AppLayout
    from "./components/AppLayout";


function AppRoutes() {
    return (
        <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================== */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =========================
                CUSTOMER ROUTES
            ========================== */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRole="CUSTOMER"
                    >
                        <AppLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/customer"
                    element={<CustomerDashboard />}
                />

                <Route
                    path="/customer/services"
                    element={<Services />}
                />

                <Route
                    path="/customer/book"
                    element={<CreateBooking />}
                />

                <Route
                    path="/customer/bookings"
                    element={<MyBookings />}
                />

            </Route>


            {/* =========================
                ADMIN ROUTES
            ========================== */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >
                        <AppLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/services"
                    element={<ManageServices />}
                />

                <Route
                    path="/admin/bookings"
                    element={<ManageBookings />}
                />

            </Route>

        </Routes>
    );
}

export default AppRoutes;