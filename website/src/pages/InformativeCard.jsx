import React from "react";
import "../styles/InformativeCard.css"
export default function InformativeCard(props) {
    return (
        <div className="informative-card">
            <h1>{props.header}</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum tempora delectus ad sapiente perferendis voluptatum voluptates, porro, enim officiis, neque praesentium deserunt repellat soluta itaque cumque! Excepturi blanditiis dolor quo.</p>
            <img src={props.img} alt="img"/>
        </div>
    );
}
