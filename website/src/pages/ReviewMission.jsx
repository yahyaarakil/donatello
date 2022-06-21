import React from 'react';
import LoginNavBar from './LoginNavBar';

import { useState } from 'react';

export const ReviewMission = () => {

    const MISSIONS = [{ id: 1, name: "first", coordinates: [{ lat: 123, lon: 123 }, { lat: 123, lon: 123 }] },
    { id: 2, name: "second", coordinates: [{ lat: 123, lon: 123 }, { lat: 123, lon: 123 }] },
    { id: 3, name: "third", coordinates: [{ lat: 123, lon: 123 }, { lat: 123, lon: 123 }] }];

    //const [MISSIONS, setMissions] = useState([]);
    const [mission, setMission] = useState("");
    const [visible = false, setVisible] = useState("");


    function onShowButtonClick() {
        setVisible(true);
    }


    function ShowMission(props) {
        if (props.visible) {
            let _mission = MISSIONS.find(({ id }) => id === props.selectedMission)

            return (
                <div className="card " style={{ marginBottom: "20px", "height": "200px" }}>
                    <div className="card-body">
                        <div className="mb-5">
                            <div className='row'>
                                <div className='col-6 d-flex flex-column'>
                                    <label htmlFor="missionName">Mission Name:</label>
                                    <input id="missionName" type="text" disabled={true} value={_mission.id}></input>
                                    <label htmlFor="Name">Name:</label>
                                    <input id="Name" type="text" disabled={true} value={_mission.name}></input>
                                </div>
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
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-6'>
                        <div className="card " style={{ marginBottom: "20px", "height": "200px" }}>
                            <div className="card-body">
                                <div className="mb-5">
                                    <div className='row'>
                                        <div className='col-6 page-hero d-flex align-items-center justify-content-center'>
                                            <select className="form-select" onClick={e => setVisible(false)} onChange={e => setMission(e.target.value)}>
                                                <option key={-1} disabled={true}>select</option>
                                                {MISSIONS.map((missionOptions) => <option key={missionOptions.id} value={missionOptions.id}>{missionOptions.name}</option>)}
                                            </select>
                                        </div>
                                        <div className='col-6 page-hero d-flex align-items-center justify-content-center'>
                                            <button onClick={onShowButtonClick}>Show</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-6'>
                        <ShowMission visible={visible} selectedMission={Number(mission)} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewMission;


//rtl 4 numara
// 6 numara edit misison
