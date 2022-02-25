import React from "react";
import "../styles/UserMainPage.css";
import donatelloLogo from "../images/donatello-logo.png";



export const UserMainPage = () => {



    return (
        <>
            <NavigationBar />
            <div class="wrapper">
                <div class="main">
                    Main content
                </div>
                <div class="sidebar">
                    <Body />
                </div>
            </div>
        </>
    );
}


function NavigationBar() {
    return (
        <div>
            <nav className="nav-bar">
                <ul>
                    <img src={donatelloLogo} className="nav-logo" alt="donatello-logo" />
                    <li><a href="settings">Settings</a></li>
                    <li><a href="profile"><i class="gg-profile"></i></a></li>
                    <li><a href="notifications"><i class="gg-bell"></i></a></li>
                    <li><a href="logout"><i class="gg-log-out"></i></a></li>
                </ul>
            </nav>
        </div>
    );
}


function Body() {
    return (
        <div className="body-div">
            <ul className="mission-list">
                <li>
                    <Container name="Create Mission" />
                </li>
                <li>
                    <Container name="Edit Mission" />
                </li>
                <li>
                    <Container name="Review Mission" />
                </li>
            </ul>
        </div>
    )
}


function Container(props) {
    return (
        <div className="mission-container">
            <img src={donatelloLogo} width="200px" alt="img" />
            <p>{props.name}</p>
        </div>
    )
}




export default UserMainPage;
