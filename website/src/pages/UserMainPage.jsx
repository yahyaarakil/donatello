import React from 'react';
import "../styles/UserMainPage.css";
import donatelloLogo from "../images/donatello-logo.png";
import { MapContainer, TileLayer, FeatureGroup, Popup, Marker, Circle } from 'react-leaflet';
import L from "leaflet";
import { useState, useEffect } from 'react';
import LoginNavBar from './LoginNavBar';
import VitalServices from "../services/VitalServices.js"

var vital_list = [{

}]

var count = 0

export const UserMainPage = () => {

  const [isVitals, setIsVitals] = useState(true)
  //The drone 10 is used as test purpose directly instead of getting all drones.
  const fetchdata = async () => {
    let res = await VitalServices.getAllVitals(JSON.parse(sessionStorage.getItem("token")));

    if (res.status === 200) {
      let vitals = res.vitals;
      for (let i = 0; i < vitals.length; i++) {
        console.log(vitals)
        if (vitals[i].vitals.data.status === 403) {
          let last_location = await VitalServices.getLastLocation(JSON.parse(sessionStorage.getItem("token")), vitals[i].id)
          vital_list[count].position1 = last_location.data[0]
          vital_list[count].position2 = last_location.data[1]
          vital_list[count].state = "Drone not connected"
          vital_list[count].battery_percentage = 0
          vital_list[count].battery_voltage = 0
          count = count + 1
          setIsVitals(false)
        }
        else {
          vital_list[count].position1 = vitals[i].vitals.data.position[0]
          vital_list[count].position2 = vitals[i].vitals.data.position[1]
          vital_list[count].state = vitals[i].vitals.data.state
          vital_list[count].battery_percentage = vitals[i].vitals.data.battery_percentage
          vital_list[count].battery_voltage = vitals[i].vitals.data.battery_voltage
          count = count + 1
          setIsVitals(false)
        }

      }

    }

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

  return (
    <>
      <LoginNavBar />

      <div className='container mt-5'>
        <div className='row'>
          <div className='col-6'>
            <Map />
          </div>
          <div className='col-6'>
            <div className="container">
              <div className="column">
                <div className="row-4 mb-5">
                  <div className="card" style={{ width: "250px", backgroundColor: "#f0df99" }}>
                    <div className='card-body'>
                      <a href="CreateMission" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img src={donatelloLogo} width="200px" alt="img" />
                        <h5 className='card-title' align="center" style={{ fontSize: "30px", color: "#1a748e" }}>Create Mission</h5>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="row-4 mb-5">
                  <div className="card" style={{ width: "250px", backgroundColor: "#f0df99" }}>
                    <div className='card-body'>
                      <a href="EditMission" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img src={donatelloLogo} width="200px" alt="img" />
                        <h5 className='card-title' align="center" style={{ fontSize: "30px", color: "#1a748e" }}>Edit Mission</h5>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="row-4">
                  <div className="card" style={{ width: "250px", backgroundColor: "#f0df99" }}>
                    <div className='card-body'>
                      <a href="ReviewMission" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img src={donatelloLogo} width="200px" alt="img" />
                        <h5 className='card-title' align="center" style={{ fontSize: "30px", color: "#1a748e" }}>Review Mission</h5>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}



function Container(props) {
  return (
    <div className="mission-container">
      <img src={donatelloLogo} width="200px" alt="img" />
      <p>{props.name}</p>
    </div>
  )
}


const marker = new L.icon({ iconUrl: donatelloLogo, iconSize: [48, 26] });



function DonatReisICerik(vitals) {

  return (
    <>
      <ul>
        <li>
          current coordinates: {vitals.props.position1} {vitals.props.position2}
        </li>
        <li>
          state: {vitals.props.state}
        </li>
        <li>
          Battery Percentage: {vitals.props.battery_percentage}
        </li>
        <li>
          Battery Voltage: {vitals.props.battery_voltage}
        </li>
      </ul>
    </>
  );
}

function Map() {
  return (
    <MapContainer center={[35.247051, 33.024617]} zoom={12}>

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright%22%3EOpenStreetMap</a> contributors'
      />

      <FeatureGroup>
        ref={(reactFGref) => {
          this._onFeatureGroupReady(reactFGref);
        }}

        <Circle center={[51.51, -0.06]} radius={200} />
      </FeatureGroup>

      {vital_list.map((vital, idx) => <Marker

        position={[vital.position1, vital.position2]}
        icon={marker}
        key={idx}
      >
        <Popup>
          <DonatReisICerik props={vital} />

        </Popup>
      </Marker>)}
    </MapContainer>
  );
}


export default UserMainPage;
