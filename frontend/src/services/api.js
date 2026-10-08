const API_BASE_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        options
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
            errorData.detail || "Something went wrong"
        );
    }

    return response.json();
}

export async function healthCheck() {
    return request("/api/health");
}

export async function registerUser(userData) {
    return request("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });
}

export async function loginUser(email, password) {
    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    return request("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
    });
}

export async function getCurrentUser(token) {
    return request("/api/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}