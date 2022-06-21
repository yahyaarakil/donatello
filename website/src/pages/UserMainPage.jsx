import React from 'react';
import "../styles/UserMainPage.css";
import donatelloLogo from "../images/donatello-logo.png";
import { MapContainer, TileLayer, FeatureGroup, Popup, Marker, Circle} from 'react-leaflet';
import L from "leaflet";
import donatReisler from "../data/DonatReisler.json"
import { EditControl } from "react-leaflet-draw"
import { useRef, useState, useEffect } from 'react';
import LoginNavBar from './LoginNavBar';
import DroneServices from "../services/DroneServices.js"
import VitalServices from "../services/VitalServices.js"

var vital_list = [{
 
}]

var count = 0

export const UserMainPage = () => {

    const dronesRef = useRef();
    const [isDrones, setIsDrones] = useState(true)
    const [drones, setDrones] = useState({})

    const [isVitals, setIsVitals] = useState(true)
    //The drone 10 is used as test purpose directly instead of getting all drones.
    const fetchdata = async () => {
        VitalServices.getVital(JSON.parse(sessionStorage.getItem("token")),10).then(function(response){
            if (response.status === 200) { 
              console.log(response) 
              if(response.data.status === 403){
                VitalServices.getLastLocation(JSON.parse(sessionStorage.getItem("token")),10).then(function(responseLastLocation){
                  if (responseLastLocation.status === 200) { 
                    console.log(responseLastLocation.data)
                        vital_list[count].position1 = responseLastLocation.data[0]
                        vital_list[count].position2 = responseLastLocation.data[1]
                        vital_list[count].state = "Not connected"
                        vital_list[count].battery_percentage = 0
                        vital_list[count].battery_voltage = 0   
                        count = count + 1
                        setIsVitals(false)   
                    }  
                  }
                );      
              }
              else{
                vital_list[count].position1 = response.data.position[0]
                vital_list[count].position2 = response.data.position[1]
                vital_list[count].battery_percentage = response.data.battery_percentage
                vital_list[count].battery_voltage = response.data.battery_voltage
                vital_list[count].state = response.data.state
                count = count + 1
                setIsVitals(false)
              }  
              
            }

        });
    }
    useEffect(() => {
        fetchdata();
    },[])
    
    if(isVitals) {
        <div>
          <p>"Loading"</p>
        </div>
        return null
    }

    return (
        <>
            <LoginNavBar />
            <div class="wrapper">
                <div class="main">
                    <Map/>
                </div>
                <div class="sidebar">
                    <Body />
                </div>
            </div>
        </>
    );
}


function Body() {
    return (
        <div className="body-div">
            <ul className="mission-list">
                <li>
                    <a href="CreateMission" style ={{textDecoration: 'none',color: 'inherit'}}><Container name="Create Mission" /></a>
                    
                </li>
                <li>
                  <a href="EditMission" style ={{textDecoration: 'none',color: 'inherit'}}><Container name="Edit Mission" /></a>
                </li>
                <li>
                  <a href="ReviewMission" style ={{textDecoration: 'none',color: 'inherit'}}><Container name="Review Mission" /></a>
                </li>
            </ul>
        </div>
    )
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

  console.log(vitals)
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
    console.log(vital_list[0])
    console.log(vital_list[0].position1)

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
          <DonatReisICerik props={vital}/>
          
        </Popup>
      </Marker>)}
    </MapContainer>
      );
  }


export default UserMainPage;
