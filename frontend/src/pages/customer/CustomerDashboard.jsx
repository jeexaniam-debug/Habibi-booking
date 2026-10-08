import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/Authcontext";
import { getMyBookings } from "../../services/bookings";


function CustomerDashboard() {

    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        getMyBookings(token)
            .then((data) => setBookings(data))
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));

    }, [token]);


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


    if (loading) {
        return (
            <div className="page-container">
                <p>Loading dashboard...</p>
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

                <div>
                    <h1 className="page-title">
                        Welcome back, {user.name} 👋
                    </h1>

                    <p className="page-subtitle">
                        Here's an overview of your service bookings.
                    </p>
                </div>

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
                            navigate("/customer/services")
                        }
                    >
                        <span>
                            Browse Services
                        </span>

                        <span className="action-arrow">
                            →
                        </span>
                    </button>


                    <button
                        className="action-card"
                        onClick={() =>
                            navigate("/customer/bookings")
                        }
                    >
                        <span>
                            My Bookings
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
                                navigate("/customer/bookings")
                            }
                        >
                            View all
                        </button>
                    )}

                </div>


                {recentBookings.length === 0 ? (

                    <div className="empty-card">
                        <p>
                            You don't have any bookings yet.
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate("/customer/services")
                            }
                        >
                            Browse Services
                        </button>
                    </div>

                ) : (

                    <div className="booking-list">

                        {recentBookings.map((booking) => (

                            <div
                                className="booking-row"
                                key={booking.id}
                            >

                                <div className="booking-info">

                                    <h3>
                                        {booking.service_name}
                                    </h3>

                                    <p>
                                        ₹{booking.service_price}
                                        {" · "}
                                        {new Date(
                                            booking.booking_date
                                        ).toLocaleString()}
                                    </p>

                                </div>


                                <span
                                    className={`status ${getStatusClass(
                                        booking.status
                                    )}`}
                                >
                                    {booking.status}
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}


export default CustomerDashboard;