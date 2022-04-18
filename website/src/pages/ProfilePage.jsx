import React from 'react';
import axios from 'axios';
import LoginNavBar from './LoginNavBar';
import Footer from './Footer';

import { useRef, useState, useEffect } from 'react';
import "../styles/ProfilePage.css"

export const ProfilePage = () => {

    return (

        <>
            <LoginNavBar />
            <div class="wrapper">
                <div class="main">
                    <LeftBody />
                </div>
                <div class="sidebar">
                    <RightBody />
                </div>
            </div>
            <Footer />
        </>
    )
}

function RightBody() {

    return (
        <>
            <div className="user-details">
                <div class="card-body" id="yui_3_17_2_1_1650266273621_24">
                    <h3 class="lead">User details</h3>
                    <ul id="yui_3_17_2_1_1650266273621_23">
                        <li class="editprofile"><span><a href="http://localhost:3000/profile">Save Changes</a></span></li>

                        <li class="contentnode">
                            <dl>
                                <dt>Name</dt>
                                <dd>Master</dd>

                                <dt>Surname</dt>
                                <dd>Splinter</dd>

                                <dt>Email address</dt>
                                <dd><a href="mailto:oguz.altas@metu.edu.tr">oguz.altas@metu.edu.tr</a></dd>


                            </dl>
                        </li>

                        <li className='vessels-operating'>
                            <label for="cars">Choose a vessel to remove:</label>
                            <select name="cars" id="cars">
                                <option value="Girne Donatello">Girne Donatello</option>
                                <option value="Karpaz Donatello">Karpaz Donatello</option>
                                <option value="Lefke Donatello">Lefke Donatello</option>
                                <option value="Magusa Donatello">Magusa Donatello</option>
                            </select>
                        </li>

                    </ul></div>
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