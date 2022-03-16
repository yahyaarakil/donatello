import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './pages/HomePage';
import LoginPage  from './pages/LoginPage';
import UserMainPage from "./pages/UserMainPage";

ReactDOM.render(
  <React.StrictMode>
    <UserMainPage />    
  </React.StrictMode>,
  document.getElementById('root')
);

