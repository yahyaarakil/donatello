import React from "react";
export default function InformativeCard(props) {
    return (

        <div className="card" style={{ height: "450px", backgroundColor:"#f0df99"}}>
            <div className="card-body d-flex flex-column">
                <img src={props.img} alt="img" />
                <br />
                <h1 align="center">{props.header}</h1>
                <p align="justify">{props.text}</p>
            </div>
        </div>

    );
}
