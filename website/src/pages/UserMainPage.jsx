import React from 'react';
import "../styles/UserMainPage.css";
import donatelloLogo from "../images/donatello-logo.png";
import { MapContainer, TileLayer, FeatureGroup, Popup, Marker, Circle} from 'react-leaflet';
import L from "leaflet";
import donatReisler from "../data/DonatReisler.json"; 
import { EditControl } from "react-leaflet-draw"

import LoginNavBar from './LoginNavBar';

export const UserMainPage = () => {



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
                    <a href="CreateMission"> <Container name="Create Mission" /></a>
                    
                    
                </li>
                <li>
                    <Container name="Edit Mission" />
                </li>
                <li>
                    <Container name="Review Mission" />
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

function DonatReisICerik(props) {
  return (
    <>
      <ul>
        <li>
          {props.props.name}
        </li>
        <li>
          mission completed: {props.props.missionPercentage}
        </li>
        <li>
          current coordinates: {props.props.lat} {props.props.lng}
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
            <EditControl
              position='topright'
              draw={{
              rectangle: false
            }}
            />
            <Circle center={[51.51, -0.06]} radius={200} />
          </FeatureGroup>
      {donatReisler.map((reis, idx) => <Marker
        position={[reis.lat, reis.lng]}
        icon={marker}
        key={idx}
      >
        <Popup>
          <DonatReisICerik props={reis}/>
          
        </Popup>
      </Marker>)}
    </MapContainer>
      );
  }


export default UserMainPage;
