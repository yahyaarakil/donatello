import '../styles/LoginNavBar.css';
import donatelloLogo from "../images/donatello-logo.png";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHouse,faBell,faUser,faGear,faRightFromBracket } from '@fortawesome/free-solid-svg-icons';


export default function LoginNavBar() {
    return (
        <div>
        <nav className="nav-bar">
            <ul>
                
                <img src={donatelloLogo} className="nav-logo" alt="donatello-logo" />
                <li><a href="home"><FontAwesomeIcon icon={faRightFromBracket}/> <b>Logout</b></a></li>
                <li><a href="settings"><FontAwesomeIcon icon={faGear}/> <b>Settings</b></a></li>
                <li><a href="profile"><FontAwesomeIcon icon={faUser}/> <b>Profile</b></a></li>
                <li><a href="dashboard"><FontAwesomeIcon icon={faHouse}/> <b>Home</b></a></li>
                

            </ul>
        </nav>
    </div>

    );
}