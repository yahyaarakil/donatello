import React from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import Footer from "./Footer";

import { useRef, useState, useEffect } from 'react';
import {Navigate} from "react-router-dom";
import "../styles/LoginPage.css"

export const LoginPage = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState("");


    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user, pwd);
        try {
            axios.post("http://localhost:8080/auth/login",
                {
                    email: user,
                    password: pwd,
                },
                {
                    headers: { "content-type": "application/json" }
                }
            )
                .then(function (response) {
                    console.log(response.data.token)
                    if (response.status === 200) {
                    
                        sessionStorage.setItem('token',JSON.stringify(response.data.token));
                        setSuccess(true);
                    }
                })

        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            }
            else if (err.response?.status === 400) {
                setErrMsg("Missing Username or Invalid Password!");
            }
            else {
                setErrMsg("Login Failed");
            }
            errRef.current.focus();
        }
    }

    

    return (
      
        <>
            <NavBar />
            <Footer />
            <div className='login-page-body'>
                {/* if logged in */}
                {success ? (
                    <Navigate to="/dashboard"/>

                ) //else
                    : (
                        <div className='login-div'>
                            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
                                {errMsg}
                            </p>
                            <h1>Login</h1>
                            <form onSubmit={handleSubmit}>

                                <span className='allign-input-icon'>
                                    <i className="gg-user"></i>
                                    {/* <label htmlFor="username">Username:</label> */}
                                </span>
                                <input
                                    type="text"
                                    id='username'
                                    ref={userRef}
                                    autoComplete="off"
                                    onChange={(e) => setUser(e.target.value)}
                                    value={user}
                                    required
                                    placeholder="Username or Email"
                                />

                                <span className='allign-input-icon'>
                                    <i className="gg-password"></i>
                                    {/* <label htmlFor="password">Password:</label> */}
                                </span>
                                <input
                                    type="password"
                                    id='password'
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                    placeholder="Password"
                                />
                                <button>Login</button>
                            </form>

                            <p className='forgot-password-contact-p'>Need an Account or Forgot password?</p>
                            <div className='line'>
                                {/* react router link here */}
                                <i className="gg-support"></i>
                                <a href='contact'>Contact Us</a>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default LoginPage;