import { useEffect, useState } from "react";

import {
    getAllBookings,
    updateBookingStatus
} from "../../services/bookings";

import { useAuth } from "../../context/Authcontext";

function ManageBookings() {
    const { token } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        loadBookings();
    }, [token]);

    async function loadBookings() {
        try {
            setError("");

            const data = await getAllBookings(token);

            setBookings(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusUpdate(bookingId, newStatus) {
        try {
            setError("");
            setUpdatingId(bookingId);

            const updatedBooking = await updateBookingStatus(
                bookingId,
                newStatus,
                token
            );

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === updatedBooking.id
                        ? {
                              ...booking,
                              status: updatedBooking.status
                          }
                        : booking
                )
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setUpdatingId(null);
        }
    }

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

    function formatDate(date) {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function formatTime(date) {
        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function renderActions(booking) {
        const isUpdating = updatingId === booking.id;

        if (booking.status === "PENDING") {
            return (
                <div className="booking-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            handleStatusUpdate(booking.id, "CONFIRMED")
                        }
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Updating..." : "Confirm"}
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={() =>
                            handleStatusUpdate(booking.id, "REJECTED")
                        }
                        disabled={isUpdating}
                    >
                        Reject
                    </button>
                </div>
            );
        }

        if (booking.status === "CONFIRMED") {
            return (
                <button
                    className="btn btn-primary"
                    onClick={() =>
                        handleStatusUpdate(booking.id, "IN_PROGRESS")
                    }
                    disabled={isUpdating}
                >
                    {isUpdating ? "Updating..." : "Start Service"}
                </button>
            );
        }

        if (booking.status === "IN_PROGRESS") {
            return (
                <button
                    className="btn btn-primary"
                    onClick={() =>
                        handleStatusUpdate(booking.id, "COMPLETED")
                    }
                    disabled={isUpdating}
                >
                    {isUpdating ? "Updating..." : "Complete Service"}
                </button>
            );
        }

        return (
            <span className="booking-action-complete">
                No action required
            </span>
        );
    }

    if (loading) {
        return (
            <div className="page-container">
                <p>Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="bookings-header">
                <div>
                    <h1 className="page-title">Manage Bookings</h1>

                    <p className="page-subtitle">
                        Review customer bookings and manage their service
                        status.
                    </p>
                </div>

                <div className="booking-count">
                    {bookings.length}{" "}
                    {bookings.length === 1 ? "Booking" : "Bookings"}
                </div>
            </div>

            {error && (
                <div className="form-error booking-page-error">
                    {error}
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="empty-card">
                    <h2>No bookings found</h2>

                    <p>
                        Customer bookings will appear here when they create
                        an appointment.
                    </p>
                </div>
            ) : (
                <div className="admin-bookings-list">
                    {bookings.map((booking) => (
                        <div
                            className="admin-booking-card"
                            key={booking.id}
                        >
                            <div className="admin-booking-card-header">
                                <div>
                                    <span className="booking-id">
                                        Booking #{booking.id}
                                    </span>

                                    <h2>{booking.service_name}</h2>
                                </div>

                                <span
                                    className={`status ${getStatusClass(
                                        booking.status
                                    )}`}
                                >
                                    {formatStatus(booking.status)}
                                </span>
                            </div>

                            <div className="admin-booking-details">
                                <div className="admin-booking-detail">
                                    <span className="detail-label">
                                        Customer
                                    </span>

                                    <strong>
                                        {booking.customer_name}
                                    </strong>

                                    <span>
                                        {booking.customer_email}
                                    </span>
                                </div>

                                <div className="admin-booking-detail">
                                    <span className="detail-label">
                                        Appointment
                                    </span>

                                    <strong>
                                        {formatDate(
                                            booking.booking_date
                                        )}
                                    </strong>

                                    <span>
                                        {formatTime(
                                            booking.booking_date
                                        )}
                                    </span>
                                </div>

                                <div className="admin-booking-detail">
                                    <span className="detail-label">
                                        Service Price
                                    </span>

                                    <strong className="admin-booking-price">
                                        ₹{booking.service_price}
                                    </strong>
                                </div>
                            </div>

                            <div className="admin-booking-card-footer">
                                <span className="booking-status-help">
                                    {booking.status === "PENDING" &&
                                        "Waiting for your confirmation."}

                                    {booking.status === "CONFIRMED" &&
                                        "Ready to start the service."}

                                    {booking.status === "IN_PROGRESS" &&
                                        "Service is currently in progress."}

                                    {booking.status === "COMPLETED" &&
                                        "This booking has been completed."}

                                    {booking.status === "REJECTED" &&
                                        "This booking was rejected."}
                                </span>

                                <div>
                                    {renderActions(booking)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageBookings;