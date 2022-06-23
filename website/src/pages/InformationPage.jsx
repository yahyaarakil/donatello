import React from "react";
import InformativeCard from "./InformativeCard";
import NavBar from "./NavBar";
import Footer from "./Footer"
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
            <div className="container mt-5">
                <div className="row">
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

        </>
    );
}

