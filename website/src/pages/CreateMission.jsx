import React from 'react';
import axios from 'axios';
import LoginNavBar from './LoginNavBar';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { useRef, useState, useEffect } from 'react';
import { EditControl } from "react-leaflet-draw"
import {Navigate} from "react-router-dom";



import "leaflet-draw/dist/leaflet.draw.css"

import "../styles/CreateMission.css"

function Map({ setMyVar }) {
    const [editableFG, setEditableFG] = useState(null);
    // const [coordinate, setCoordinate] = useState([35.247051, 33.024617]);

    function getCorners(layer) {
        const corners = layer.getBounds();

        const northwest = corners.getNorthWest();
        const northeast = corners.getNorthEast();
        const southeast = corners.getSouthEast();
        const southwest = corners.getSouthWest();

        return [northwest, northeast, southeast, southwest];
    }


    const onCreated = e => {

        var type = e.layerType,
            layer = e.layer;
        if (type === 'rectangle') {
            layer.on('mouseover', function () {
                var temp = {
                    pattern: []

                };
            
                temp.pattern = getCorners(layer);
                
                temp.top = temp.pattern[0].lat;
                temp.bottom = temp.pattern[2].lat;
                temp.left = temp.pattern[0].lng;
                temp.right = temp.pattern[2].lng;

                console.log(temp)
                setMyVar(temp);

            });
        }


    };

    const onFeatureGroupReady = reactFGref => {
        // store the ref for future access to content
        setEditableFG(reactFGref);
    };
    

    return (
        <MapContainer center={[35.247051, 33.024617]} zoom={16}>
            <TileLayer
                minZoom={15}
                maxZoom={18}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright%22%3EOpenStreetMap</a> contributors'
            />

            <FeatureGroup
                ref={featureGroupRef => {
                    onFeatureGroupReady(featureGroupRef);
                }}>
                <EditControl position="topright"
                    draw={{
                        marker: false,
                        circle: false,
                        circlemarker: false,
                        polyline: false,
                    }}
                    onCreated={onCreated} />
            </FeatureGroup>
            
        </MapContainer>
    );
}

function Body({ myVar }) {
<<<<<<< Updated upstream

    const handleSubmit = async (e) => {
        if(myVar.top != 0){
            console.log("Let's go");
            <Navigate to="/MainPage"/>
        }
        else{
            console.log("Sad")
        }

=======
    const nameRef = useRef();
    const [name, setName] = useState("");
    
    const deviceRef = useRef();
    const [device, setDevice] = useState("");
   
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(myVar)
        axios.post("http://localhost:8080/drones/"+ device + "/missions/schedule" ,
        {
            "pattern": myVar.pattern,
            "time": Date.now(),
            "name": name

        },
        {
            headers: { "content-type": "application/json", 
                       "token": sessionStorage.getItem("token")}
        })
        
>>>>>>> Stashed changes
    }

    return (
        <div className="body-div">
            <ul className="mission">
                <div>
<<<<<<< Updated upstream
                    <div>
                        <p>top: {myVar.top}</p>
                        <p>bottom: {myVar.bottom}</p>
                        <p>left: {myVar.left}</p>
                        <p>right: {myVar.right}</p>
                    </div>
                    <div>
                        <input
                            type="text"
                            id='missionName'
                            autoComplete="off"
                            required
                            placeholder="Mission Name"
                        />
                    </div>
                    <div>
                        <select class="selectpicker" data-style="btn-info" name="selectpicker">
                            <optgroup label="Select Device">
                                <option name="table1" value="1">Device 1</option>
                                <option name="table2" value="2">Device 2</option>
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <button>Create Mission</button>
                        </form>
                    </div>
=======
                    <form onSubmit={handleSubmit}>
                        <div>
                            <p>top: {myVar.top}</p>
                            <p>bottom: {myVar.bottom}</p>
                            <p>left: {myVar.left}</p>
                            <p>right: {myVar.right}</p>    
                        </div>
                        <div>
                            <input
                                type="text"
                                id='name'
                                ref={nameRef}
                                autoComplete="off"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                required
                                placeholder="Mission Name"
                            />
                        </div>
                        <div>
                            <select class="selectpicker" data-style="btn-info" name="selectpicker" value={device} onChange={(e) => setDevice(e.target.value)}>
                                <optgroup label="Select Device">
                                    <option name="table1" value="1">Device 1</option>
                                    <option name="table2" value="2">Device 2</option>
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <button>Clean Area</button>
                        </div>
                    </form>
                    
>>>>>>> Stashed changes

                </div>
            </ul>
        </div>
    )
}

export const CreateMission = () => {
    const [myVar, setMyVar] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });
    
    return (
        <div>
            <LoginNavBar />
            <div className="wrapper">
                <div className="map">
                    <Map setMyVar={setMyVar} />
                </div>
                <div className="sidebody">
                    <Body myVar={myVar} />
                </div>
            </div>
        </div>
    );
}

export default CreateMission;
