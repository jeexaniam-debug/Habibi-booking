const API_BASE_URL = "http://127.0.0.1:8000";

export async function getServices() {
    const response = await fetch(
        `${API_BASE_URL}/api/services/`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch services");
    }

    return response.json();
}


export async function createService(
    serviceData,
    token
) {
    const response = await fetch(
        `${API_BASE_URL}/api/services/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(serviceData)
        }
    );

    if (!response.ok) {
        const errorData =
            await response.json().catch(() => ({}));

        throw new Error(
            errorData.detail ||
            "Failed to create service"
        );
    }

    return response.json();
}


export async function updateService(
    serviceId,
    serviceData,
    token
) {
    const response = await fetch(
        `${API_BASE_URL}/api/services/${serviceId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(serviceData)
        }
    );

    if (!response.ok) {
        const errorData =
            await response.json().catch(() => ({}));

        throw new Error(
            errorData.detail ||
            "Failed to update service"
        );
    }

    return response.json();
}