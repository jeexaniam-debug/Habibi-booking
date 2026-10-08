import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createBooking } from "../../services/bookings";
import { useAuth } from "../../context/Authcontext";


function CreateBooking() {

    const location = useLocation();
    const navigate = useNavigate();

    const { token } = useAuth();

    const service = location.state?.service;

    const [bookingDate, setBookingDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        if (!service) {
            setError("No service selected.");
            return;
        }

        if (!bookingDate) {
            setError("Please select a booking date and time.");
            return;
        }

        setLoading(true);

        try {

            await createBooking(
                service.id,
                new Date(bookingDate).toISOString(),
                token
            );

            navigate("/customer/bookings");

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    }


    if (!service) {

        return (

            <div className="page-container">

                <div className="empty-card">

                    <h2>
                        No service selected
                    </h2>

                    <p>
                        Please choose a service before creating a booking.
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

            </div>
        );
    }


    return (

        <div className="page-container booking-page">

            <div className="booking-header">

                <h1 className="page-title">
                    Book a Service
                </h1>

                <p className="page-subtitle">
                    Choose a date and time for your service.
                </p>

            </div>


            <div className="booking-layout">

                {/* SERVICE SUMMARY */}

                <div className="booking-service-card">

                    <span className="booking-card-label">
                        Selected Service
                    </span>

                    <h2>
                        {service.name}
                    </h2>

                    <p>
                        {service.description ||
                            "Professional service provided by our team."}
                    </p>

                    <div className="booking-price">
                        ₹{service.price}
                    </div>

                </div>


                {/* BOOKING FORM */}

                <form
                    className="booking-form card"
                    onSubmit={handleSubmit}
                >

                    <h2>
                        Schedule Appointment
                    </h2>


                    <div className="form-group">

                        <label htmlFor="bookingDate">
                            Date & Time
                        </label>

                        <input
                            id="bookingDate"
                            type="datetime-local"
                            value={bookingDate}
                            onChange={(event) =>
                                setBookingDate(event.target.value)
                            }
                            min={
                                new Date()
                                    .toISOString()
                                    .slice(0, 16)
                            }
                            required
                        />

                    </div>


                    {error && (

                        <div className="form-error">
                            {error}
                        </div>

                    )}


                    <div className="booking-form-actions">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate("/customer/services")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Booking..."
                                : "Confirm Booking"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default CreateBooking;