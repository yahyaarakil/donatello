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
                            header="Contact Information"
                            text="You can reach us from following information for any purposes. Email: donatello.kaplumbaga@gmail.com"
                            img={donatelloLogo} />
                    </div>
                    <div className="col-4">

                    </div>
                </div>
            </div>
        </>
    );

}
