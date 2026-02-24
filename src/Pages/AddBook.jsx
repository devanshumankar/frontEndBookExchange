import React, { useState } from 'react';
import { auth } from "../firebase/firebase";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [condition, setCondition] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // <-- environment variable

  const convertToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !author || !condition) {
      return setError("Please fill all required fields");
    }

    setIsSubmitting(true);
    try {
      const ownerUid = auth.currentUser?.uid;
      if (!ownerUid) {
        setIsSubmitting(false);
        return setError("User not logged in");
      }

      let imageDataUrl = "";
      if (image) {
        if (image.size > 2 * 1024 * 1024) {
          setIsSubmitting(false);
          return setError("Image too large. Please select a file under 2MB");
        }
        imageDataUrl = await convertToDataUrl(image);
      }

      const bookData = {
        ownerUid,
        title,
        author,
        condition,
        image: imageDataUrl,
        status: "available"
      };

      const res = await fetch(`${API_URL}/api/books/addBooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
      });

      const data = await res.json();

      if (!res.ok) {
        setIsSubmitting(false);
        return setError(data.error || "Server error");
      }

      setSuccess("Book added successfully!");
      setTitle("");
      setAuthor("");
      setCondition("");
      setImage(null);
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again later");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='add-book-page'>
      <form onSubmit={handleSubmit}>
        <h2>Add Book</h2>
        <div className="book-title">
          <input type='text' placeholder='enter book name' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="book-author">
          <input type='text' placeholder='enter author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>

        <div className="book-image">
          <label htmlFor='img-book'>Upload Image</label>
          <input type='file' id='img-book' onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <div className="book-condition">
          <label htmlFor='cond'>Select Condition</label><br />
          <select value={condition} onChange={(e) => setCondition(e.target.value)} id='cond'>
            <option value="">--select--</option>
            <option value="Good">Good</option>
            <option value="Bad">Bad</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        {error && <p className='errors'>{error}</p>}
        {success && <p className='success'>{success}</p>}

        <div className="add-book">
          <button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBook;
