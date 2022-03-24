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
                        header="Contact Information"        
                        text="You can reach us from: "                   
                        img={donatelloLogo} />
                </li>
                    
                </ul>

            </div>
    </>
    );
    
}
