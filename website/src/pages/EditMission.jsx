import React from 'react';
import axios from 'axios';
import LoginNavBar from './LoginNavBar';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useState } from 'react';

import "leaflet-draw/dist/leaflet.draw.css"
import "../styles/CreateMission.css"

export const EditMission = () => {
    const DEVICES = [{ id: 1, name: "donatello-1" }, { id: 2, name: "donatello-2" }, { id: 3, name: "donatello-3" }];
    const [device, setDevice] = useState("");
    const [visible = false, setVisible] = useState("");


    function onShowButtonClick() {
        console.log("adasdsad")
        setVisible(true);
    }

    function onMANUALButtonClick() {
        console.log("manual")
    }

    function onRTLButtonClick() {
        console.log("rtl")
    }

    function ShowMission(props) {
        let device = DEVICES.find(({ id }) => id === props.selectedDevice)
        console.log(props)
        if (props.visible) {
            return (
                <div className="card mt-5">
                    <div className="card-body">
                        <div className='row'>
                            <div className='col-6 d-flex flex-column'>
                                <label htmlFor="missionName">Mission Name:</label>
                                <input id="missionName" type="text" disabled={true} value={device.name}></input>
                                <label htmlFor="Name">Name:</label>
                                <input id="Name" type="text" disabled={true} value={device.name}></input>
                            </div>
                            <div className='col-6 d-flex flex-column'>
                            <button onClick={onRTLButtonClick}>RTL</button>
                            <button onClick={onMANUALButtonClick}>MANUAL</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (<></>);
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
                                            <option key={-1} disabled={true}>select</option>
                                            {DEVICES.map((missionOptions) => <option key={missionOptions.id} value={missionOptions.id}>{missionOptions.name}</option>)}
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