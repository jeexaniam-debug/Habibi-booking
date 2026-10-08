import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/Authcontext";
import { getAllBookings } from "../../services/bookings";


function AdminDashboard() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const token = localStorage.getItem("token");

        getAllBookings(token)
            .then((data) => setBookings(data))
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));

    }, []);


    const pendingBookings = bookings.filter(
        (booking) => booking.status === "PENDING"
    );

    const activeBookings = bookings.filter(
        (booking) =>
            booking.status === "CONFIRMED" ||
            booking.status === "IN_PROGRESS"
    );

    const completedBookings = bookings.filter(
        (booking) => booking.status === "COMPLETED"
    );

    const rejectedBookings = bookings.filter(
        (booking) => booking.status === "REJECTED"
    );


    const recentBookings = [...bookings]
        .sort(
            (a, b) =>
                new Date(b.booking_date) -
                new Date(a.booking_date)
        )
        .slice(0, 5);


    function getStatusClass(status) {

        const statusClasses = {
            PENDING: "status-pending",
            CONFIRMED: "status-confirmed",
            IN_PROGRESS: "status-progress",
            COMPLETED: "status-completed",
            REJECTED: "status-rejected"
        };

        return statusClasses[status] || "";
    }


    function formatStatus(status) {

        const labels = {
            PENDING: "Pending",
            CONFIRMED: "Confirmed",
            IN_PROGRESS: "In Progress",
            COMPLETED: "Completed",
            REJECTED: "Rejected"
        };

        return labels[status] || status;
    }


    if (loading) {

        return (
            <div className="page-container">
                <p>Loading admin dashboard...</p>
            </div>
        );
    }


    if (error) {

        return (
            <div className="page-container">
                <p>{error}</p>
            </div>
        );
    }


    return (

        <div className="page-container">

            {/* HEADER */}

            <div className="dashboard-header">

                <h1 className="page-title">
                    Welcome back, {user.name} 👋
                </h1>

                <p className="page-subtitle">
                    Here's an overview of your service business.
                </p>

            </div>


            {/* STATISTICS */}

            <div className="stats-grid">

                <div className="stat-card">
                    <span className="stat-label">
                        Total Bookings
                    </span>

                    <span className="stat-value">
                        {bookings.length}
                    </span>
                </div>


                <div className="stat-card">
                    <span className="stat-label">
                        Pending
                    </span>

                    <span className="stat-value">
                        {pendingBookings.length}
                    </span>
                </div>


                <div className="stat-card">
                    <span className="stat-label">
                        Active
                    </span>

                    <span className="stat-value">
                        {activeBookings.length}
                    </span>
                </div>


                <div className="stat-card">
                    <span className="stat-label">
                        Completed
                    </span>

                    <span className="stat-value">
                        {completedBookings.length}
                    </span>
                </div>


                <div className="stat-card">
                    <span className="stat-label">
                        Rejected
                    </span>

                    <span className="stat-value">
                        {rejectedBookings.length}
                    </span>
                </div>

            </div>


            {/* QUICK ACTIONS */}

            <section className="dashboard-section">

                <h2 className="section-title">
                    Quick Actions
                </h2>

                <div className="quick-actions">

                    <button
                        className="action-card"
                        onClick={() =>
                            navigate("/admin/bookings")
                        }
                    >
                        <span>
                            Manage Bookings
                        </span>

                        <span className="action-arrow">
                            →
                        </span>
                    </button>


                    <button
                        className="action-card"
                        onClick={() =>
                            navigate("/admin/services")
                        }
                    >
                        <span>
                            Manage Services
                        </span>

                        <span className="action-arrow">
                            →
                        </span>
                    </button>

                </div>

            </section>


            {/* RECENT BOOKINGS */}

            <section className="dashboard-section">

                <div className="section-header">

                    <h2 className="section-title">
                        Recent Bookings
                    </h2>

                    {bookings.length > 5 && (

                        <button
                            className="text-button"
                            onClick={() =>
                                navigate("/admin/bookings")
                            }
                        >
                            View all
                        </button>

                    )}

                </div>


                {recentBookings.length === 0 ? (

                    <div className="empty-card">
                        <p>
                            No bookings found.
                        </p>
                    </div>

                ) : (

                    <div className="admin-booking-list">

                        {recentBookings.map((booking) => (

                            <div
                                className="admin-booking-row"
                                key={booking.id}
                            >

                                <div className="admin-booking-main">

                                    <div className="admin-booking-title">

                                        <h3>
                                            {booking.service_name}
                                        </h3>

                                        <span>
                                            Booking #{booking.id}
                                        </span>

                                    </div>

                                    <p>
                                        {booking.customer_name}
                                        {" · "}
                                        {booking.customer_email}
                                    </p>

                                    <p>
                                        {new Date(
                                            booking.booking_date
                                        ).toLocaleString()}
                                    </p>

                                </div>


                                <div className="admin-booking-right">

                                    <strong>
                                        ₹{booking.service_price}
                                    </strong>

                                    <span
                                        className={`status ${getStatusClass(
                                            booking.status
                                        )}`}
                                    >
                                        {formatStatus(
                                            booking.status
                                        )}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}


export default AdminDashboard;