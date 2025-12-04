import React, { useEffect, useState } from 'react';

const MyRequest = () => {
    const [requests, setRequests] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL; // <-- environment variable

    useEffect(() => {
        const fetchApprovedRequests = async () => {
            try {
                const res = await fetch(`${API_URL}/api/requests/approved`);
                const data = await res.json();
                if (res.ok) setRequests(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchApprovedRequests();
    }, [API_URL]);

    return (
        <div className="approved-requests">
            <h1 className="approved-title">Approved Requests</h1>

            {requests.map((r) => (
                <div key={r._id} className="approved-card">

                    <div className="req-section">
                        <h3 className="section-title">Requested Book</h3>
                        <p><span>Title:</span> {r.requestedBookId?.title}</p>
                        <p><span>Owner:</span> {r.requesteeUser?.userName}</p>
                        <p><span>Phone:</span> {r.requesteeUser?.phone}</p>
                    </div>

                    <div className="req-section">
                        <h3 className="section-title">Offered Book</h3>
                        <p><span>Title:</span> {r.ownerBookId?.title}</p>
                        <p><span>Requester:</span> {r.requesterUser?.userName}</p>
                        <p><span>Phone:</span> {r.requesterUser?.phone}</p>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default MyRequest;
