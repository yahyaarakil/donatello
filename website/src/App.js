import './App.css';

import ProfilePage from "./pages/ProfilePage"
import UserMainPage from "./pages/UserMainPage"
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage'
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage'
import CreateMissionPage from './pages/CreateMission'
import EditMissionPage from './pages/EditMission'
import ReviewMissionPage from './pages/ReviewMission'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";



function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/profile" element  ={<ProfilePage/>} /> 
        <Route path = "/" element={(<HomePage/>)} />
        <Route path = "/home" element ={(<HomePage/>)} />
        <Route path = "/MainPage" element  ={<UserMainPage/>} /> 
        <Route path = "/login" element = {<LoginPage/>}/>
        <Route path = "/contact" element = {<ContactPage/>}/>
        <Route path = "/about" element = {<AboutPage/>}/>
        <Route path = "/settings" element  = {<SettingsPage/>}/>
        <Route path = "/notifications" element = {<NotificationsPage/>}/>
        <Route path = "/createmission" element = {<CreateMissionPage/>}/>
        <Route path = "/editmission" element = {<EditMissionPage/>}/>
        <Route path = "/reviewmission" element = {<ReviewMissionPage/>}/>
      </Routes>
      
    </Router>
  );
}

export default App;
