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
                var temp = getCorners(layer);
                console.log(temp)
                temp.top = temp[0].lat;
                temp.bottom = temp[2].lat;
                temp.left = temp[0].lng;
                temp.right = temp[2].lng;
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
        <MapContainer center={[35.247051, 33.024617]} zoom={12}>
            <TileLayer
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
            )
        </MapContainer>
    );
}

function Body({ myVar }) {

    const handleSubmit = async (e) => {
        if(myVar.top != 0){
            console.log("Let's go");
            <Navigate to="/MainPage"/>
        }
        else{
            console.log("Sad")
        }

    }

    return (
        <div className="body-div">
            <ul className="mission">
                <div>
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
