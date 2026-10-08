import { useEffect, useState } from "react";

import {
    getServices,
    createService,
    updateService
} from "../../services/services";

import { useAuth } from "../../context/Authcontext";

function ManageServices() {
    const { token } = useAuth();

    const [services, setServices] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function loadServices() {
        try {
            setError("");

            const data = await getServices();
            setServices(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadServices();
    }, []);

    function clearForm() {
        setName("");
        setDescription("");
        setPrice("");
        setEditingId(null);
        setError("");
        setMessage("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        if (!name.trim()) {
            setError("Please enter a service name.");
            return;
        }

        if (!price || Number(price) <= 0) {
            setError("Please enter a valid price.");
            return;
        }

        setSaving(true);

        try {
            const serviceData = {
                name: name.trim(),
                description: description.trim(),
                price: Number(price)
            };

            if (editingId) {
                const updatedService = await updateService(
                    editingId,
                    serviceData,
                    token
                );

                setServices((currentServices) =>
                    currentServices.map((service) =>
                        service.id === updatedService.id
                            ? updatedService
                            : service
                    )
                );

                setMessage("Service updated successfully.");
            } else {
                const newService = await createService(
                    serviceData,
                    token
                );

                setServices((currentServices) => [
                    ...currentServices,
                    newService
                ]);

                setMessage("Service created successfully.");
            }

            setName("");
            setDescription("");
            setPrice("");
            setEditingId(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(service) {
        setEditingId(service.id);
        setName(service.name);
        setDescription(service.description || "");
        setPrice(service.price);

        setError("");
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    async function handleToggle(service) {
        try {
            setError("");
            setMessage("");

            const updatedService = await updateService(
                service.id,
                {
                    active: service.active === 1 ? 0 : 1
                },
                token
            );

            setServices((currentServices) =>
                currentServices.map((currentService) =>
                    currentService.id === updatedService.id
                        ? updatedService
                        : currentService
                )
            );

            setMessage(
                updatedService.active === 1
                    ? "Service activated successfully."
                    : "Service deactivated successfully."
            );
        } catch (error) {
            setError(error.message);
        }
    }

    if (loading) {
        return (
            <div className="page-container">
                <p>Loading services...</p>
            </div>
        );
    }

    const activeServices = services.filter(
        (service) => service.active === 1
    );

    const inactiveServices = services.filter(
        (service) => service.active !== 1
    );

    return (
        <div className="page-container">
            <div className="services-header">
                <div>
                    <h1 className="page-title">
                        Manage Services
                    </h1>

                    <p className="page-subtitle">
                        Create, update and manage the services
                        available to customers.
                    </p>
                </div>

                <div className="service-count">
                    {activeServices.length} Active
                </div>
            </div>

            <section className="admin-service-form card">
                <div className="admin-form-header">
                    <div>
                        <h2>
                            {editingId
                                ? "Edit Service"
                                : "Add New Service"}
                        </h2>

                        <p>
                            {editingId
                                ? "Update the details of this service."
                                : "Create a service that customers can book."}
                        </p>
                    </div>

                    {editingId && (
                        <button
                            type="button"
                            className="text-button"
                            onClick={clearForm}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="admin-service-form-grid">
                        <div className="form-group">
                            <label htmlFor="serviceName">
                                Service Name
                            </label>

                            <input
                                id="serviceName"
                                type="text"
                                placeholder="e.g. AC Repair"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="servicePrice">
                                Price
                            </label>

                            <input
                                id="servicePrice"
                                type="number"
                                min="1"
                                step="1"
                                placeholder="e.g. 800"
                                value={price}
                                onChange={(event) =>
                                    setPrice(event.target.value)
                                }
                            />
                        </div>

                        <div className="form-group admin-service-description">
                            <label htmlFor="serviceDescription">
                                Description
                            </label>

                            <textarea
                                id="serviceDescription"
                                rows="3"
                                placeholder="Describe what this service includes..."
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="form-success">
                            {message}
                        </div>
                    )}

                    <div className="admin-form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                ? "Update Service"
                                : "Add Service"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={clearForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">
                            All Services
                        </h2>

                        <p className="section-description">
                            {services.length}{" "}
                            {services.length === 1
                                ? "service"
                                : "services"}{" "}
                            configured
                        </p>
                    </div>
                </div>

                {services.length === 0 ? (
                    <div className="empty-card">
                        <h2>No services yet</h2>

                        <p>
                            Create your first service using the
                            form above.
                        </p>
                    </div>
                ) : (
                    <div className="admin-services-grid">
                        {services.map((service) => (
                            <div
                                className={`admin-service-card ${
                                    service.active !== 1
                                        ? "admin-service-inactive"
                                        : ""
                                }`}
                                key={service.id}
                            >
                                <div className="admin-service-card-top">
                                    <span
                                        className={`status ${
                                            service.active === 1
                                                ? "status-completed"
                                                : "status-rejected"
                                        }`}
                                    >
                                        {service.active === 1
                                            ? "Available"
                                            : "Inactive"}
                                    </span>

                                    <span className="service-number">
                                        #{service.id}
                                    </span>
                                </div>

                                <div className="admin-service-card-content">
                                    <h3>{service.name}</h3>

                                    <p>
                                        {service.description ||
                                            "No description provided."}
                                    </p>
                                </div>

                                <div className="admin-service-card-footer">
                                    <div>
                                        <span className="admin-service-price">
                                            ₹{service.price}
                                        </span>

                                        <span className="admin-service-price-label">
                                            Service price
                                        </span>
                                    </div>
                                </div>

                                <div className="admin-service-actions">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            handleEdit(service)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className={
                                            service.active === 1
                                                ? "btn btn-danger"
                                                : "btn btn-primary"
                                        }
                                        onClick={() =>
                                            handleToggle(service)
                                        }
                                    >
                                        {service.active === 1
                                            ? "Deactivate"
                                            : "Activate"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ManageServices;
