import React from "react";
import NavBar from "./NavBar";
import donatelloLogo from "../images/donatello-logo.png"
import InformativeCard from "./InformativeCard";
import Footer from "./Footer"

export default function ContactPage() {
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

                    </div>
                    <div className="col-4">
                        <InformativeCard
                            header="About us"
                            text="Donatello is an autonomous, solar powered sea vessel coming with remote control, scheduling and dashboard application which can perform cleaning operations on water. It is built by a graduation team from METU Northern Cyprus Campus."
                            img={donatelloLogo} />
                    </div>
                    <div className="col-4">

                    </div>
                </div>
            </div>

        </>
    );

}
