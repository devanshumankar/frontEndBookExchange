import React, { useState, useEffect } from 'react';
import YourBook from './YourBook';
import EditBook from './EditBook';
import { auth } from '../firebase/firebase';

const MyBook = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL; // <-- environment variable

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const uid = auth.currentUser.uid;
        const res = await fetch(`${API_URL}/api/books/user/${uid}`);
        const data = await res.json();
        setBooks(data.filter(book => book.status === "available"));
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };
    fetchBooks();
  }, [API_URL]);

  const handleDelete = async (bookId) => {
    try {
      await fetch(`${API_URL}/api/books/${bookId}`, { method: 'DELETE' });
      setBooks(books.filter(book => book._id !== bookId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API_URL}/api/books/${editingBook._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBook)
      });
      setBooks(books.map(book => book._id === editingBook._id ? editingBook : book));
      setEditingBook(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="my-book-container">
      {editingBook && (
        <EditBook
          book={editingBook}
          onChange={setEditingBook}
          onUpdate={handleUpdate}
          onCancel={() => setEditingBook(null)}
        />
      )}
      <h1>Your Books</h1>
      <div className="my-books">
        {books.length === 0 ? <p>You have no books added.</p> :
          books.map(book => (
            <YourBook
              key={book._id}
              book={book}
              onDelete={handleDelete}
              onEdit={setEditingBook}
            />
          ))
        }
      </div>
    </div>
  );
};

export default MyBook;
