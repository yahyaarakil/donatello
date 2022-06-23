import React from "react";
import InformativeCard from "./InformativeCard";
import NavBar from "./NavBar";
import Footer from "./Footer"
import "../styles/InformationPage.css"
import donatelloLogo from "../images/donatello-logo.png"
import donatello2 from "../images/donatello2.png";
import donatello3 from "../images/donatello3.png";

export default function InformationPage() {
    return (
        <>
            <NavBar />
            <Body />
            <div>
                <footer className="footer">
                    <nav className="footer-nav-bar">
                        <p></p>
                    </nav>
                </footer>
            </div>
        </>
    );
}

function Body() {
    return (
        <>
            <div className="container mt-5">
                <div className="row mb-10">
                    <div className="col-4">
                        <InformativeCard
                            header="What is Donatello?"
                            text="Donatello is an autonomous, solar powered sea vessel coming with remote control, scheduling and dashboard application which can perform cleaning operations on water."
                            img={donatelloLogo} />
                    </div>
                    <div className="col-4">
                        <InformativeCard
                            header="Why is Donatello?"
                            text="Donatello is an easy to deploy, cost effective vessel which is flexible and maneuverable."
                            img={donatelloLogo} />
                    </div>
                    <div className="col-4">
                        <InformativeCard
                            header="How is Donatello?"
                            text="Donatello is a modular vessel which is powered by different components. It is controllable through web application and runned by Raspberry Pi. For further information please contact us! "
                            img={donatelloLogo} />
                    </div>
                </div>
            </div>
            <br />
            <br />
            <br />
            <div className="container">
                <div id="items" className="carousel slide" data-bs-ride="true">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#items" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#items" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#items" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img className="d-block w-100" src={donatello2} alt="First slide" />
                        </div>

                        <div className="carousel-item">
                            <img className="d-block w-100" src={donatello3} alt="Third slide" />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#items" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span>Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#items" data-bs-slide="next">
                        <span>Next</span>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>

                    </button>

                </div>
            </div>

        </>
    );
}

