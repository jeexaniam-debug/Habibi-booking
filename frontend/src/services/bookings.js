const API_BASE_URL = "http://127.0.0.1:8000";

export async function createBooking(
    serviceId,
    bookingDate,
    token
) {
    const response = await fetch(
        `${API_BASE_URL}/api/bookings/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                service_id: serviceId,
                booking_date: bookingDate
            })
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
            errorData.detail || "Failed to create booking"
        );
    }

    return response.json();
}
export async function getMyBookings(token) {
    const response = await fetch(
        `${API_BASE_URL}/api/bookings/my`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const errorData =
            await response.json().catch(() => ({}));

        throw new Error(
            errorData.detail ||
            "Failed to fetch bookings"
        );
    }

    return response.json();
}
export async function getAllBookings(token) {
    const response = await fetch(
        `${API_BASE_URL}/api/bookings/all`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const errorData =
            await response.json().catch(() => ({}));

        throw new Error(
            errorData.detail ||
            "Failed to fetch all bookings"
        );
    }

    return response.json();
}
export async function updateBookingStatus(
    bookingId,
    status,
    token
) {
    const response = await fetch(
        `${API_BASE_URL}/api/bookings/${bookingId}/status`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                status: status
            })
        }
    );

    if (!response.ok) {
        const errorData =
            await response.json().catch(() => ({}));

        throw new Error(
            errorData.detail ||
            "Failed to update booking status"
        );
    }

    return response.json();
}