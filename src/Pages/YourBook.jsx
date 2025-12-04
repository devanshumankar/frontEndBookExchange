import React from 'react';

const YourBook = ({ book, onDelete, onEdit }) => {
    return (
        <div className="your-book-card">
            <div className="your-book-image">
                <img src={book.image || "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80"} alt={book.title} />
            </div>
            <div className="your-book-title">
                <h3>Title :</h3>
                <p>{book.title}</p>
            </div>
            <div className="your-book-author">
                <h3>Author :</h3>
                <p>{book.author}</p>
            </div>
            <div className="your-book-condition">
                <h3>Condition:</h3>
                <p>{book.condition}</p>
            </div>

            <div className="buttons">
                <button className='del' onClick={() => onDelete(book._id)}>Delete</button>
                <button className='edit' onClick={() => onEdit(book)}>Edit</button>
            </div>
        </div>
    );
}

export default YourBook;
