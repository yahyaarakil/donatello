import React from 'react';
import axios from 'axios';
import LoginNavBar from './LoginNavBar';
import Footer from './Footer';

import { useRef, useState, useEffect } from 'react';
import "../styles/ProfilePage.css"

export const ProfilePage = () => {

    return (

        <>
            <LoginNavBar/>
            <div class="wrapper">
                <div class="main">
                    <LeftBody />
                </div>
                <div class="sidebar">
                    <RightBody />
                </div>
            </div>
            <Footer/>
        </>
    )
}

function RightBody() {

    return (
        <>
            <div className="user-details">
                <p>Email Address</p>
            </div>
        </>
    )


}

function LeftBody() {

    return (
        <>
            <div>
                <p>
                    hello
                </p>
            </div>
        </>
    )
}



export default ProfilePage