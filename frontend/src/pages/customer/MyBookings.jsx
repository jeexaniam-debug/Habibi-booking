import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyBookings } from "../../services/bookings";
import { useAuth } from "../../context/Authcontext";


function MyBookings() {

    const { token } = useAuth();
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
                <p>Loading bookings...</p>
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

            <div className="bookings-header">

                <h1 className="page-title">
                    My Bookings
                </h1>

                <p className="page-subtitle">
                    View and track all your service appointments.
                </p>

            </div>


            {bookings.length === 0 ? (

                <div className="empty-card">

                    <h2>
                        No bookings yet
                    </h2>

                    <p>
                        You haven't booked any services yet.
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

                <div className="bookings-list">

                    {bookings.map((booking) => (

                        <div
                            className="booking-card"
                            key={booking.id}
                        >

                            <div className="booking-card-header">

                                <div>

                                    <h2>
                                        {booking.service_name}
                                    </h2>

                                    <p className="booking-id">
                                        Booking #{booking.id}
                                    </p>

                                </div>


                                <span
                                    className={`status ${getStatusClass(
                                        booking.status
                                    )}`}
                                >
                                    {formatStatus(booking.status)}
                                </span>

                            </div>


                            <div className="booking-card-details">

                                <div className="booking-detail">

                                    <span className="detail-label">
                                        Date & Time
                                    </span>

                                    <span>
                                        {new Date(
                                            booking.booking_date
                                        ).toLocaleString()}
                                    </span>

                                </div>


                                <div className="booking-detail">

                                    <span className="detail-label">
                                        Service Price
                                    </span>

                                    <span className="booking-price-text">
                                        ₹{booking.service_price}
                                    </span>

                                </div>

                            </div>


                            {booking.status === "PENDING" && (

                                <div className="booking-message">
                                    Your booking is waiting for confirmation.
                                </div>

                            )}


                            {booking.status === "CONFIRMED" && (

                                <div className="booking-message booking-message-blue">
                                    Your booking has been confirmed.
                                </div>

                            )}


                            {booking.status === "IN_PROGRESS" && (

                                <div className="booking-message booking-message-blue">
                                    Your service is currently in progress.
                                </div>

                            )}


                            {booking.status === "COMPLETED" && (

                                <div className="booking-message booking-message-green">
                                    This service has been completed.
                                </div>

                            )}


                            {booking.status === "REJECTED" && (

                                <div className="booking-message booking-message-red">
                                    Unfortunately, this booking was rejected.
                                </div>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}


export default MyBookings;