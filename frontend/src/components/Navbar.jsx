import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/Authcontext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    function handleLogout() {
        logout();
        setMenuOpen(false);
        navigate("/login");
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link
                    to={
                        user.role === "ADMIN"
                            ? "/admin"
                            : "/customer"
                    }
                    onClick={closeMenu}
                >
                    Service Booking
                </Link>
            </div>

            <button
                className="navbar-menu-button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={
                    menuOpen
                        ? "Close navigation menu"
                        : "Open navigation menu"
                }
                aria-expanded={menuOpen}
            >
                {menuOpen ? "✕" : "☰"}
            </button>

            <div
                className={`navbar-content ${
                    menuOpen ? "navbar-content-open" : ""
                }`}
            >
                <div className="navbar-links">
                    {user.role === "CUSTOMER" && (
                        <>
                            <NavLink
                                to="/customer"
                                end
                                onClick={closeMenu}
                            >
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/customer/services"
                                onClick={closeMenu}
                            >
                                Services
                            </NavLink>

                            <NavLink
                                to="/customer/bookings"
                                onClick={closeMenu}
                            >
                                My Bookings
                            </NavLink>
                        </>
                    )}

                    {user.role === "ADMIN" && (
                        <>
                            <NavLink
                                to="/admin"
                                end
                                onClick={closeMenu}
                            >
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/admin/bookings"
                                onClick={closeMenu}
                            >
                                Bookings
                            </NavLink>

                            <NavLink
                                to="/admin/services"
                                onClick={closeMenu}
                            >
                                Services
                            </NavLink>
                        </>
                    )}
                </div>

                <div className="navbar-user">
                    <span>{user.name}</span>

                    <button
                        className="btn btn-secondary"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;