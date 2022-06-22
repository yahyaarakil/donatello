import React from 'react';
import LoginNavBar from './LoginNavBar';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useState, useEffect } from 'react';
import DroneServices from "../services/DroneServices.js"
import "leaflet-draw/dist/leaflet.draw.css"
import "../styles/CreateMission.css"
import Select from "react-select";


let MISSIONS = [
    {
        "path": [
            [35.246569482417755, 33.028105704264],
            [35.24684765535991, 33.02847608414646],
            [35.24646955439687, 33.02883984759016],
            [35.24625619987274, 33.028310735028036]
        ],
        "name": "test mission",
        "time": 12312312312
    }
]

export const ReviewMission = () => {

    const [drones, setDrones] = useState({})
    const [visible = false, setVisible] = useState("");
    const [device, setDevice] = useState("");
    const [selectedMission, setSelectedMission] = useState("");
    const [visibleMarkers = false, setVisibleMarkers] = useState("");

    function MultipleMarkers() {
        return selectedMission.value.map((coordinata, index) => {
            return <Marker key={index} position={coordinata}></Marker>;
        });
    }

    function Map(props) {
        if (props.visible) {
            return (
                <MapContainer center={selectedMission.value[0]} zoom={16} style={{ marginTop: "20px" }} >
                    <TileLayer
                        minZoom={15}
                        maxZoom={19}
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright%22%3EOpenStreetMap</a> contributors'
                    />
                    <MultipleMarkers />
                </MapContainer>
            )
        }
        return (
            <></>
        );
    }


    const handleSubmit = async (e) => {
        console.log(device)
        setVisible(true)
    }

    const handleShow = async (e) => {
        console.log(selectedMission);
        setVisibleMarkers(true);

    }

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

    function MissionsForm(props) {

        if (props.isVisible) {
            return (
                <div className="body-div mt-3">
                    <div className='card'>
                        <div className='card-body'>
                            <Select
                                value={selectedMission}
                                onChange={(e) => { setSelectedMission(e) }}
                                options={MISSIONS.map((option) => {
                                    return {
                                        label: option.name,
                                        value: option.path,
                                        key: option.time
                                    };
                                })}
                            />
                            <button onClick={handleShow}>Show</button>
                        </div>
                    </div>
                </div>
            )
        }
        return (<></>)
    }

    if (drones.data === undefined) {
        return null
    }
    return (
        <>
            <LoginNavBar />
            <div className='container'>
                <div className='row'>
                    <div className='col-6'>
                        <Map visible={visibleMarkers} />
                    </div>
                    <div className='col-6'>
                        <div className="body-div mt-3">
                            <div className='card'>
                                <div className='card-body'>
                                    <select className="form-select" onClick={e => { setVisible(!e.target.value); setVisibleMarkers(!e.target.value) }} onChange={e => setDevice(e.target.value)}>
                                        {/* hacky */}
                                        <option key={-1} disabled={true} value={drones.data[0].id}>select</option>
                                        {drones.data.map((missionOptions) => <option key={missionOptions.id} value={missionOptions.id}>{missionOptions.name}</option>)}
                                    </select>
                                    <button onClick={handleSubmit}>Get Previous Missions</button>
                                </div>
                            </div>
                        </div>
                        <MissionsForm isVisible={visible} />
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReviewMission;