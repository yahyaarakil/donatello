import React from 'react';
import { useRef, useState, useEffect } from 'react';
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
        setUser("");
        setPwd("");
        setSuccess(true);
    }

    return (

        <>
            {/* if logged in */}
            {success ? ( 
                <div>
                    <h1>You are Logged in!</h1>
                    <br />
                    <p>
                        {/* react route here */}
                        <a href='userpage'>go to user page</a>
                    </p>
                </div>
            ) //else
                : (
                    <div className='login-div'>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
                            {errMsg}
                        </p>
                        <h1>Sign in</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id='username'
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                            />

                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id='password'
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                            />
                            <button>Sign in</button>
                        </form>
                        <p>
                            Need an Account or Forgot password?
                            <br />
                            <span className='line'>
                                {/* react router link here */}
                                <a href='contact'>Contact Us</a>
                            </span>
                        </p>
                    </div>
                )

            }
        </>
    )
}

export default LoginPage;