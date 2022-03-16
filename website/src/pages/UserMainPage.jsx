import React from "react";
import "../styles/UserMainPage.css";
import donatelloLogo from "../images/donatello-logo.png";
import { MapContainer, TileLayer, FeatureGroup, Popup, Marker } from 'react-leaflet';
import L from "leaflet";
import donatReisler from "../data/DonatReisler.json"; 


export const UserMainPage = () => {



    return (
        <>
            <NavigationBar />
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


function NavigationBar() {
    return (
        <div>
            <nav className="nav-bar">
                <ul>
                    <img src={donatelloLogo} className="nav-logo" alt="donatello-logo" />
                    <li><a href="settings">Settings</a></li>
                    <li><a href="profile"><i class="gg-profile"></i></a></li>
                    <li><a href="notifications"><i class="gg-bell"></i></a></li>
                    <li><a href="logout"><i class="gg-log-out"></i></a></li>
                </ul>
            </nav>
        </div>
    );
}


function Body() {
    return (
        <div className="body-div">
            <ul className="mission-list">
                <li>
                    <Container name="Create Mission" />
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
            <FeatureGroup>
            </FeatureGroup>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright%22%3EOpenStreetMap</a> contributors'
        />
        
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
