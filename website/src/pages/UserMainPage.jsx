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

export const UserMainPage = () => {

    

     

    const dronesRef = useRef();
    const [isDrones, setIsDrones] = useState(true)
    const [drones, setDrones] = useState({})

    const [vitals, setVitals] = useState({})
    const [isVitals, setIsVitals] = useState(true)
    
    const fetchdata = async () => {
      //const response = await VitalServices.getVital(JSON.parse(sessionStorage.getItem("token")),10)
        //DroneServices.getAllDrones(JSON.parse(sessionStorage.getItem("token"))).then(function (response) 
        VitalServices.getVital(JSON.parse(sessionStorage.getItem("token")),10).then(function(response){
            if (response.status === 200) { 
              console.log(response)
              setVitals(response.data)
              setIsVitals(false)
                
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

// for(var i = 0; i < drones.data.length; i++){
//   const response = VitalServices.getVital(JSON.parse(sessionStorage.getItem("token")),drones.data[i].id)
//   vitals.push(response)
//   // VitalServices.getVital(JSON.parse(sessionStorage.getItem("token")),drones.data[i].id).then(function (response) {
//   //     if (response.status === 200) {  
//   //        vitals.push(response.data);
         
//   //     }
//   //   });
//   // }
//   if(i === drones.data.length -1 ){
//     setIsVitals(false)
//   }
    
// }

// if(isVitals){
//   <div>
//     <p>"Loading"</p>
//   </div>
//   return null
// }

    return (
        <>
            <LoginNavBar />
            <div class="wrapper">
                <div class="main">
                    <Map vitals={vitals}/>
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
//{vitals.position[0]} {vitals.position[1]}
  return (
    <>
      <ul>
        <li>
          current coordinates: {vitals.props.position[0]} {vitals.props.position[1]}
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

function Map(vitals) {



    var vitalsArray = []
    
    console.log(vitals)
    if(vitals.vitals.message !== "Drone not connected"){
      vitalsArray.push(vitals.vitals)
    }
    console.log(vitalsArray)

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
          
      {vitalsArray.map((vital, idx) => <Marker
        
        position={[vital.position[0], vital.position[1]]}
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
