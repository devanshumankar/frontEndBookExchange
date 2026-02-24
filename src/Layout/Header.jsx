import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [searchFilter, setSearchFilter] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const query = searchFilter.trim();

        const timer = setTimeout(() => {
            if (query) {
                navigate(`/home/allbook?search=${encodeURIComponent(query)}`);
            } else if (searchFilter !== "") {
                // If the user cleared the search bar, show all books
                navigate(`/home/allbook`);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchFilter, navigate]);

    return (
        <div className='header'>
            <div className="left-header">
                <h2>Book-Swap</h2>
            </div>
            <div className="right-header">
                <div className="search">
                    <input
                        type='text'
                        placeholder='Search books...'
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    />
                </div>

                <div className="my-requests hb">
                    <Link to="/home/myrequests" className='links'>Approved Req</Link>
                </div>

                <div className="request-link-book hb">
                    <Link to="/home/requestbook" className='links'>Requests</Link>
                </div>

                <div className="all-book hb">
                    <Link to="/home/allbook" className='links'>All Books</Link>
                </div>

                <div className="my-book hb">
                    <Link to="/home/mybook" className='links'>My Books</Link>
                </div>

                <div className="add-book hb">
                    <Link to="/home/addbook" className='links'>Add Books</Link>
                </div>

                <div className="profile hb">
                    <Link to="/home/profile" className='links'>Profile</Link>
                </div>
            </div>
        </div>
    );
}

export default Header;
