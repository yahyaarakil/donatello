import React from 'react';
import axios from 'axios';
import LoginNavBar from './LoginNavBar';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { useRef, useState, useEffect } from 'react';
import { EditControl } from "react-leaflet-draw"
import { Navigate } from "react-router-dom";
import DroneServices from "../services/DroneServices.js"
import Select from "react-select";

import "leaflet-draw/dist/leaflet.draw.css"

import "../styles/CreateMission.css"

function Map({ setMyVar }) {
    const [editableFG, setEditableFG] = useState(null);

    function getCorners(layer) {
        const corners = layer.getBounds();

        const northwest = corners.getNorthWest();
        const northeast = corners.getNorthEast();
        const southeast = corners.getSouthEast();
        const southwest = corners.getSouthWest();

        return [northwest, northeast, southeast, southwest];
    }

    function getPoints(layer) {
        const points = layer.getLatLngs();
        return [points];
    }

    const onCreated = e => {

        var type = e.layerType,
            layer = e.layer;

        var temp = {
            pattern: []

        };
        if (type === 'rectangle') {
            layer.on('mouseover', function () {
                temp.pattern = getCorners(layer);
                temp.top = temp.pattern[0].lat;
                temp.bottom = temp.pattern[2].lat;
                temp.left = temp.pattern[0].lng;
                temp.right = temp.pattern[2].lng;
                setMyVar(temp);
            });
        } else if (type === "polygon") {

            temp.pattern = getCorners(layer);
            temp.top = temp.pattern[0].lat;
            temp.bottom = temp.pattern[2].lat;
            temp.left = temp.pattern[0].lng;
            temp.right = temp.pattern[2].lng;
            temp.pattern = getPoints(layer)[0][0];
            setMyVar(temp);
        }
    };

    const onFeatureGroupReady = reactFGref => {
        // store the ref for future access to content
        setEditableFG(reactFGref);
    };

    return (
        <MapContainer center={[35.247051, 33.024617]} zoom={16} style={{ marginTop: "20px" }} >
            <TileLayer
                minZoom={15}
                maxZoom={19}
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


function Body({ myVar, drones }) {

    const nameRef = useRef();
    const batteryRef = useRef();
    const [name, setName] = useState("");
    const [battery, setBattery] = useState("");

    const deviceRef = useRef();
    const [device, setDevice] = useState("");

    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(myVar)
        console.log(device)
        var pattern = [];
        for (var i = 0; i < myVar.pattern.length; i++) {
            var tempPattern = [];
            tempPattern.push(myVar.pattern[i].lat);
            tempPattern.push(myVar.pattern[i].lng);
            pattern.push(tempPattern)
        }
        console.log(pattern)
        axios.post("http://localhost:8080/drones/" + device.key + "/missions/schedule",
            {
                "pattern": pattern,
                "time": Date.now(),
                "name": name,
                "battery_percentage":Number(battery)
            },
            {
                headers: {
                    "content-type": "application/json",
                    "token": JSON.parse(sessionStorage.getItem("token"))
                }
            }).then(function (response) {
                if (response.data.message === "Success") {
                    console.log("Success1")
                    setSuccess(true)
                }
            })
    }

    return (
        <div className="body-div mt-3">
            {success ? (
                <div> <p> Mission Created Successfully  </p>  </div>
            ) : (
                <ul className="mission">
                    <div>
                        <div className='card'>
                            <div className='card-body'>
                                <div className='container'>
                                    <p>top: {myVar.top}</p>
                                    <p>bottom: {myVar.bottom}</p>
                                    <p>left: {myVar.left}</p>
                                    <p>right: {myVar.right}</p>
                                    <input
                                        type="text"
                                        id='missionName'
                                        className='mb-2'
                                        ref={nameRef}
                                        autoComplete="off"
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        required
                                        placeholder="Mission Name"
                                    />
                                    <input
                                        className="form-control mb-2"
                                        type="number"
                                        id='batteryThreshold'
                                        ref={batteryRef}
                                        step={10}
                                        max={80}
                                        min={20}
                                        defaultValue={20}
                                        autoComplete="off"
                                        value={battery}
                                        onChange={(e) => setBattery(e.target.value)}
                                        required
                                        placeholder="Battery Threshold"
                                    />

                                    <Select
                                        value={device}
                                        onChange={(e) => { setDevice(e) }}
                                        options={drones.data.map((option) => {
                                            return {
                                                label: option.name,
                                                value: option.name,
                                                key: option.id
                                            };
                                        })}

                                    />
                                    <button onClick={handleSubmit}>Create Mission</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
            )}
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

    const dronesRef = useRef();
    const [drones, setDrones] = useState({})

    const fetchdata = async () => {
        DroneServices.getAllDrones(JSON.parse(sessionStorage.getItem("token"))).then(function (response) {
            if (response.status === 200) {
                setDrones(response)
            }
        });
    }
    useEffect(() => {
        fetchdata();
    }, [])

    if (drones.data === undefined) {
        return null
    }
    return (
        <>
            <LoginNavBar />
            <div className='container'>
                <div className='row'>
                    <div className='col-6'>
                        <Map setMyVar={setMyVar} />

                    </div>
                    <div className='col-6'>
                        <Body myVar={myVar} drones={drones} />
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateMission;