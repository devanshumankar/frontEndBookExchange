import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from "react-router-dom"
const Layout = () => {
    return (
        <div className='layout'>
            <Header></Header>
            <div className="outlet">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Layout;
