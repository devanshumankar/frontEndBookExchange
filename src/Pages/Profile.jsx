import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase/firebase";

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [bookCount, setBookCount] = useState(0);
    const [exchangeCount, setExchangeCount] = useState(0);

    const uid = auth.currentUser?.uid; // added optional chaining
    const API_URL = import.meta.env.VITE_API_URL; // <-- environment variable

    useEffect(() => {
        if (!uid) return;

        const fetchData = async () => {
            try {
                const resUser = await fetch(`${API_URL}/api/user/${uid}`);
                const userData = await resUser.json();
                setProfile(userData);

                const resBooks = await fetch(`${API_URL}/api/books/user/${uid}`);
                const books = await resBooks.json();
                setBookCount(books.length);

                const resEx = await fetch(`${API_URL}/api/requests/approved/user/${uid}`);
                const exchanges = await resEx.json();
                setExchangeCount(exchanges.length);

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [uid, API_URL]);

    if (!profile) {
        return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
    }

    return (
        <div className="profile-page-container">
            <div className='profile-page'>
                <h1>About</h1>

                <div className="profile-full-name profile-div">
                    <h3>Full Name</h3>
                    <p>{profile.userName}</p>
                </div>

                <div className="profile-email profile-div">
                    <h3>Email</h3>
                    <p>{profile.email}</p>
                </div>

                <div className="profile-phone profile-div">
                    <h3>Phone</h3>
                    <p>{profile.phone}</p>
                </div>

                <div className="profile-total-books profile-div">
                    <h3>Total Books</h3>
                    <p>{bookCount}</p>
                </div>

                <div className="profile-success-exchange profile-div">
                    <h3>Successful Exchanges</h3>
                    <p>{exchangeCount}</p>
                </div>

                <div className="profile-buttons">
                    <button className='edit-btn' onClick={() => navigate("/home/mybook")}>My Books</button>
                    <button className='logout-btn' onClick={() => navigate("/")}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
