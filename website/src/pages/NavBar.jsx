import '../styles/NavBar.css';
import donatelloLogo from "../images/donatello-logo.png";

export default function NavBar() {
    return (
        <nav className="nav-bar">
            <ul>
                <img src={donatelloLogo} className="nav-logo" alt="donatello-logo" />
                <li><a href="contact">Contact</a></li>
                <li><a href="about">About</a></li>
                <li><a href="settings">Settings</a></li>
                <li><a href="login">Login</a></li>
            </ul>
        </nav>

    );
}