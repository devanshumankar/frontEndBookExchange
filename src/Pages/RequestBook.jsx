import React, { useEffect, useState } from 'react';
import RequestCard from "./RequestCard";

const RequestBook = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL; // <-- environment variable

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await fetch(`${API_URL}/api/requests/pending`);
                const data = await response.json();
                setPendingRequests(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching pending requests:", error);
                setLoading(false);
            }
        };

        fetchPendingRequests();
    }, [API_URL]);

    if (loading) {
        return <p>Loading pending requests...</p>;
    }

    return (
        <div className='request-book'>
            <h1>Pending Requests for Your Books</h1>
            <div className="req-book-card">
                {pendingRequests.length === 0 ? (
                    <p>No pending requests.</p>
                ) : (
                    pendingRequests.map((request) => (
                        <RequestCard key={request._id} request={request} />
                    ))
                )}
            </div>
        </div>
    );
};

export default RequestBook;
