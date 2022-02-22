import React from "react";
import InformativeCard from "./InformativeCard";
import NavBar from "./NavBar";
import "../styles/Loginpage.css"
import donatelloLogo from "../images/donatello-logo.png"

export default function LoginPage() {
    return (
        <>
            <NavBar />
            <Body />
            <Footer />
        </>
    );
}

function Body() {
    return (
        <>
            <div className="body-div">

                <ul className="info-list">
                    <li>
                        <InformativeCard
                            header="why is donatello?"
                            img={donatelloLogo} />
                    </li>
                    <li>
                        <InformativeCard
                            header="why is donatello?"
                            img={donatelloLogo} />
                    </li>
                    <li>
                        <InformativeCard
                            header="why is donatello?"
                            img={donatelloLogo} />
                    </li>
                </ul>

            </div>
        </>
    );
}

function Footer() {
    return (
        <>
            <div>
                <footer className="footer">
                    <nav className="nav-bar">
                        <ul>
                            <li><a href="contact">Contact</a></li>
                            <li><a href="about">About</a></li>
                            <li><a href="login">Login</a></li>
                        </ul>
                    </nav>
                </footer>
            </div>
        </>
    );
}