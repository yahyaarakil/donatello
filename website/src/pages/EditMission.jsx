import React from 'react';
import LoginNavBar from './LoginNavBar';
import { MapContainer, TileLayer } from 'react-leaflet';
import VitalServices from "../services/VitalServices.js"
import DroneServices from "../services/DroneServices.js"
import { useState, useEffect } from 'react';

import "leaflet-draw/dist/leaflet.draw.css"
import "../styles/CreateMission.css"
let ALL_DEVICES = [];
let DEVICES = [];

export const EditMission = () => {

    const [device, setDevice] = useState("");
    const [visible = false, setVisible] = useState("");
    const [isVitals, setIsVitals] = useState(true)

    const fetchdata = async () => {
        ALL_DEVICES = await VitalServices.getAllVitals(JSON.parse(sessionStorage.getItem("token")));

        for (let i = 0; i < ALL_DEVICES.vitals.length; i++) {
            if (ALL_DEVICES.vitals[i].vitals.data.status !== 403) {
                DEVICES.push(ALL_DEVICES.vitals[i])
            }
        }
        setIsVitals(false);
    }
    useEffect(() => {
        fetchdata();
    }, [])

    if (isVitals) {
        <div>
            <p>"Loading"</p>
        </div>
        return null
    }

    function onShowButtonClick() {
        setVisible(true);
    }

    function onMANUALButtonClick(selected) {
        console.log("manual")
        console.log(selected.id)
        DroneServices.postMode(selected.id,"manual")
    }

    function onRTLButtonClick(selected) {
        console.log("rtl")
        DroneServices.postMode(selected.id,"rtl")
    }

    function ShowMission(props) {
        
        let selected;
        for (let i = 0; i < DEVICES.length; i++) {
            if(DEVICES[i].id === props.selectedDevice){
                selected = DEVICES[i];
            }
        }   

        if (props.visible) {
            return (
                <div className="card mt-5">
                    <div className="card-body">
                        <div className='row'>
                            <div className='col-6 d-flex flex-column'>
                                <label htmlFor="missionName">Mission Name:</label>
                                <input id="missionName" type="text" disabled={true} value={device}></input>
                                <label htmlFor="Name">Name:</label>
                                <input id="Name" type="text" disabled={true} value={device}></input>
                            </div>
                            <div className='col-6 d-flex flex-column'>
                                <button onClick={onRTLButtonClick.bind(this,selected)}>RTL</button>
                                <button onClick={onMANUALButtonClick.bind(this,selected)}>MANUAL</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (<></>);
    }

    function toBool(num){
        if (num === undefined) {
            return 0;
        }
        return num.id;
    }   

    return (
        <>
            <LoginNavBar />
            <div className='container'>
                <div className='row'>
                    <div className='col-6'>
                        <div className="map" style={{ width: "100%" }}>
                            <MapContainer center={[35.247051, 33.024617]} zoom={12}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="http://osm.org/copyright%22%3EOpenStreetMap</a> contributors'
                                />
                            </MapContainer>
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className='card mt-5'>
                            <div className='card-body'>
                                <h4 className="card-title">Edit the mission</h4>
                                <p className="card-text">
                                    Select an operation:
                                </p>
                                <div className='row'>
                                    <div className='col-6 page-hero d-flex align-items-center justify-content-center'>
                                        <select className="form-select" onClick={e => setVisible(!e.target.value)} onChange={e => setDevice(e.target.value)}>
                                            {/* hacky */}
                                            <option key={-1} value={toBool(DEVICES[0])}>select</option>
                                            {DEVICES.map((missionOptions) =><option key={missionOptions.id} value={missionOptions.id}>{missionOptions.id}</option>)}
                                        </select>
                                    </div>
                                    <div className='col-6 page-hero d-flex align-items-center justify-content-center'>
                                        <button onClick={onShowButtonClick}>Show</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ShowMission visible={visible} selectedDevice={Number(device)} />
                    </div>

                </div>
            </div>
        </>
    );
}

export default EditMission;