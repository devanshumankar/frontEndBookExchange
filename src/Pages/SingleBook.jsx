import React, { useState, useEffect } from 'react';
import { auth } from "../firebase/firebase";

const SingleBook = ({ book, userBooks = [] }) => {
    const [selectedBook, setSelectedBook] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL; // <-- environment variable

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) setCurrentUser(user.uid);
            else setCurrentUser(null);
        });

        return () => unsubscribe();
    }, []);

    const handleExchange = async () => {
        if (!currentUser) return alert("You must be logged in to request a book");
        if (!selectedBook) return;

        try {
            const response = await fetch(`${API_URL}/api/requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requesterId: currentUser,
                    requesteeId: book.ownerUid,
                    requestedBookId: book._id,
                    ownerBookId: selectedBook
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Exchange request sent!");
                setSelectedBook("");
            } else {
                alert(data.message || "Failed to send request");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="book-card">
            <div className="book-image">
                <img
                    src={book.image || "https://images.unsplash.com/photo-1529778873920-4da4926a72c2"}
                    alt={book.title}
                />
            </div>
            <div className="book-title"><h3>Title:</h3><p>{book.title}</p></div>
            <div className="book-author"><h3>Author:</h3><p>{book.author}</p></div>
            <div className="condition"><h3>Condition:</h3><p>{book.condition}</p></div>

            <div className="request">
                <select
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                >
                    <option value="">Select your book to offer</option>
                    {userBooks.map((ub) => (
                        <option key={ub._id} value={ub._id}>{ub.title}</option>
                    ))}
                </select>

                {selectedBook && (
                    <button onClick={handleExchange} style={{ marginLeft: '30px', cursor: 'pointer' }}>
                        Request Exchange
                    </button>
                )}
            </div>
        </div>
    );
};

export default SingleBook;
