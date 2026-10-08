import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getServices } from "../../services/services";


function Services() {

    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        getServices()
            .then((data) => setServices(data))
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));

    }, []);


    if (loading) {
        return (
            <div className="page-container">
                <p>Loading services...</p>
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


    const activeServices = services.filter(
        (service) => service.active === 1
    );


    return (

        <div className="page-container">

            <div className="services-header">

                <h1 className="page-title">
                    Our Services
                </h1>

                <p className="page-subtitle">
                    Choose a service and book it at a time that works for you.
                </p>

            </div>


            {activeServices.length === 0 ? (

                <div className="empty-card">
                    <p>
                        No services are currently available.
                    </p>
                </div>

            ) : (

                <div className="services-grid">

                    {activeServices.map((service) => (

                        <div
                            className="service-card"
                            key={service.id}
                        >

                            <div className="service-card-content">

                                <h2 className="service-name">
                                    {service.name}
                                </h2>

                                <p className="service-description">
                                    {service.description ||
                                        "Professional service provided by our team."}
                                </p>

                            </div>


                            <div className="service-card-footer">

                                <div>

                                    <span className="service-price">
                                        ₹{service.price}
                                    </span>

                                    <span className="service-price-label">
                                        starting price
                                    </span>

                                </div>

                                <span className="status status-completed">
                                    Available
                                </span>

                            </div>


                            <button
                                className="btn btn-primary service-book-button"
                                onClick={() =>
                                    navigate(
                                        "/customer/book",
                                        {
                                            state: {
                                                service
                                            }
                                        }
                                    )
                                }
                            >
                                Book Now →
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}


export default Services;