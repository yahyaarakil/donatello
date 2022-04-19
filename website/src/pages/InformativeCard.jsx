import React from "react";
import "../styles/InformativeCard.css"
export default function InformativeCard(props) {
    return (
        <div className="informative-card">
            <h1 align="center">{props.header}</h1>
            <p>{props.text}</p>
            <img src={props.img} alt="img"/>
        </div>
    );
}
