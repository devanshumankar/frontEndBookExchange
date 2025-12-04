import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SingleBook from './SingleBook';
import { auth } from '../firebase/firebase';

const AllBooks = () => {
    const [books, setBooks] = useState([]);
    const [userBooks, setUserBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search')?.toLowerCase() || "";

    const API_URL = import.meta.env.VITE_API_URL; // <-- environment variable

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) setUser(currentUser);
            else setUser(null);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            if (!user) return;

            try {
                const resAll = await fetch(`${API_URL}/api/books`);
                const allBooks = await resAll.json();

                const resUser = await fetch(`${API_URL}/api/books/user/${user.uid}`);
                const myBooks = await resUser.json();

                const otherUsersBooks = allBooks
                    .filter(b => b.ownerUid !== user.uid)
                    .filter(b => !searchQuery || b.title.toLowerCase().includes(searchQuery));

                setBooks(otherUsersBooks);
                setUserBooks(myBooks.filter(ub => ub.status === "available"));
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch books:", err);
                setLoading(false);
            }
        };

        fetchBooks();
    }, [user, searchQuery, location.key, API_URL]);

    if (loading) return <p>Loading books...</p>;

    return (
        <div className="all-book-container">
            <h1>All Available Books</h1>
            <div className="all-books">
                {books.length > 0 ? (
                    books.map(book => (
                        <SingleBook
                            key={book._id}
                            book={book}
                            userBooks={userBooks.filter(ub => ub._id !== book._id)}
                        />
                    ))
                ) : (
                    <p>No books found</p>
                )}
            </div>
        </div>
    );
};

export default AllBooks;
