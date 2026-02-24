import React from 'react';
import { auth } from "../firebase/firebase";

const RequestCard = ({ request, onAction }) => {
    const [isProcessing, setIsProcessing] = React.useState(false);
    const currentUserId = auth.currentUser?.uid;
    const { requestedBookId, ownerBookId, requestStatus } = request;

    const API_URL = import.meta.env.VITE_API_URL; // <-- environment variable

    const handleReject = async (requestId) => {
        setIsProcessing(true);
        try {
            const response = await fetch(`${API_URL}/api/requests/reject/${requestId}`, {
                method: "PATCH",
            });

            const data = await response.json();
            if (response.ok) {
                if (onAction) onAction();
            } else {
                alert(data.message || "Failed to reject request");
                setIsProcessing(false);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
            setIsProcessing(false);
        }
    };

    const handleAccept = async (requestId) => {
        setIsProcessing(true);
        try {
            const response = await fetch(`${API_URL}/api/requests/accept/${requestId}`, {
                method: "PATCH",
            });

            const data = await response.json();
            if (response.ok) {
                if (onAction) onAction();
            } else {
                alert(data.message || "Failed to accept request");
                setIsProcessing(false);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
            setIsProcessing(false);
        }
    };

    return (
        <div className="book-card request-full-card">
            <div className="request-sections-container">
                <div className="request-section-half">
                    <h3>Requested Book</h3>
                    <div className="book-image">
                        <img
                            src={requestedBookId.image || "https://images.unsplash.com/photo-1529778873920-4da4926a72c2"}
                            alt={requestedBookId.title}
                        />
                    </div>
                    <div className="req-details">
                        <p><strong>Title:</strong> {requestedBookId.title}</p>
                        <p><strong>Author:</strong> {requestedBookId.author}</p>
                        <p><strong>Condition:</strong> {requestedBookId.condition}</p>
                    </div>
                </div>

                <div className="exchange-icon-container">
                    <div className="exchange-arrow">⇄</div>
                </div>

                <div className="request-section-half">
                    <h3>Offered Book</h3>
                    <div className="book-image">
                        <img
                            src={ownerBookId.image || "https://images.unsplash.com/photo-1529778873920-4da4926a72c2"}
                            alt={ownerBookId.title}
                        />
                    </div>
                    <div className="req-details">
                        <p><strong>Title:</strong> {ownerBookId.title}</p>
                        <p><strong>Author:</strong> {ownerBookId.author}</p>
                        <p><strong>Condition:</strong> {ownerBookId.condition}</p>
                    </div>
                </div>
            </div>

            <div className="request-footer">
                <div className="status-badge">Status: {requestStatus}</div>
                {currentUserId === request.requesteeId && (
                    <div className="request-page-buttons">
                        <button className='rej' disabled={isProcessing} onClick={() => handleReject(request._id)}>
                            {isProcessing ? '...' : 'Reject'}
                        </button>
                        <button className='acc' disabled={isProcessing} onClick={() => handleAccept(request._id)}>
                            {isProcessing ? '...' : 'Accept'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestCard;
