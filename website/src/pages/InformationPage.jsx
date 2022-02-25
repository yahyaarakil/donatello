import React from "react";
import InformativeCard from "./InformativeCard";
import NavBar from "./NavBar";
import "../styles/InformationPage.css"
import donatelloLogo from "../images/donatello-logo.png"

export default function InformationPage() {
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
                    <nav className="footer-nav-bar">
                        <ul>
                            <li><a href="contact">Contact</a></li>
                            <li><a href="howto">How to Apply</a></li>
                            <li><a href="faqs">FAQs</a></li>
                            <li><a href="developers">Developers</a></li>
                        </ul>
                    </nav>
                </footer>
            </div>
        </>
    );
}