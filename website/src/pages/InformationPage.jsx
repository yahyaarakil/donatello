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
            <div className="body-div">

                <ul className="info-list">
                    <li>
                        <InformativeCard
                            header="why is donatello?"
                            text="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum tempora delectus ad sapiente perferendis voluptatum voluptates, porro, enim officiis, neque praesentium deserunt repellat soluta itaque cumque! Excepturi blanditiis dolor quo."
                            img={donatelloLogo} />
                    </li>
                    <li>
                        <InformativeCard
                            header="why is donatello?"
                            text="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum tempora delectus ad sapiente perferendis voluptatum voluptates, porro, enim officiis, neque praesentium deserunt repellat soluta itaque cumque! Excepturi blanditiis dolor quo."
                            img={donatelloLogo} />
                    </li>
                    <li>
                        <InformativeCard
                            header="why is donatello?"
                            text="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum tempora delectus ad sapiente perferendis voluptatum voluptates, porro, enim officiis, neque praesentium deserunt repellat soluta itaque cumque! Excepturi blanditiis dolor quo."
                            img={donatelloLogo} />
                    </li>
                </ul>

            </div>
        </>
    );
}

