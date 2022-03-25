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
    return(
        <>
        <div className="body-div">

            <ul className="info-list">
                <li>
                    <InformativeCard
                        header="About us"        
                        text="Donatello Kamplubaga is a..."                   
                        img={donatelloLogo} />
                </li>
                    
                </ul>

            </div>
    </>
    );
    
}
