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
                                <p>Oguz Kagan</p>
                                <input id="text"/>
                                <dt>Surname</dt>
                                <p>Altas</p>
                                <input id="text"/>
                                <dt>Email address</dt>
                                <dd><a href="mailto:oguz.altas@metu.edu.tr">oguz.altas@metu.edu.tr</a></dd>
                                <input id="text"/>


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
                <ProfilePic />
            </div>
        </>
    )
}

function ProfilePic() {
    
    function handleOnClick(event){
        var image = document.getElementById("output");
        image.src = URL.createObjectURL(event.target.files[0]);
      };

    return (
        <>

            <div class="profile-pic">
                <img src="https://i.pinimg.com/originals/22/94/0c/22940c5d7d3e464f4bff0112c401888a.jpg" id="output" width="200" />
                <br>
                </br>
                <label class="-label" for="file">
                    <span>Change Image</span>
                </label>
                <input id="file" type="file" onChange={handleOnClick} />

            </div>
        </>
    )
}


export default ProfilePage