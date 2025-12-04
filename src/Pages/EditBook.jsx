import React from 'react';

const EditBook = ({ book, onChange, onUpdate, onCancel }) => {
    return (
        <div className="edit-form">
            <h2>Edit Book</h2>
            <input
                type="text"
                value={book.title}
                onChange={(e) => onChange({ ...book, title: e.target.value })}
                placeholder="Title"
            />
            <input
                type="text"
                value={book.author}
                onChange={(e) => onChange({ ...book, author: e.target.value })}
                placeholder="Author"
            />
            <input
                type="text"
                value={book.condition}
                onChange={(e) => onChange({ ...book, condition: e.target.value })}
                placeholder="Condition"
            />
            <div className="button-group">
                <button onClick={onUpdate}>Update</button>
                <button onClick={onCancel}>Cancel</button>
            </div>

        </div>
    );
};

export default EditBook;
