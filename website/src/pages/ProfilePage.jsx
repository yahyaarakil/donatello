import React from 'react';
import axios from 'axios';
import LoginNavBar from './LoginNavBar';
import { Container,Row,Col,Form ,Button} from 'react-bootstrap';
import splinter from '../images/splinter.jpg'

import { useRef, useState, useEffect } from 'react';
import "../styles/ProfilePage.css"



export const ProfilePage = () => {

    return (

        <>
            <LoginNavBar />
            <div class="wrapper">
                <div class="profilemain">
                    <LeftBody />
                    
                </div>
                <div class="profilesidebar">
                    <RightBody />
                </div>
            </div>
        </>
    )
}



function RightBody() {
    const [name, setName] = useState("Master");
    const [surname, setSurname] = useState("Splinter");
    const [mail, setMail] = useState("msplinter@metu.edu.tr");
    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target.value)

    }

    return (
        <>

            <div className='rightbody' style={{marginTop: 0}}>
                <div>
                    <div style={{marginTop: 0}}>
                        <h1 style={{marginTop: 0}}>User Profile</h1>
                    </div>
                    <Form className="profileform" style={{display: 'flex',  justifyContent:'right', alignItems:'center'}} onSubmit={handleSubmit}>     
                    <div className='profileformDiv'>
                        <Form.Group controlId="formCategory1">
                                <Form.Label style={{display: 'flex',  justifyContent:'left'}}>Name</Form.Label>
                                <div className='profileFormDivLittle'>
                                    <Form.Control type="text" defaultValue={name} style={{width: 275}}/>
                                </div>
                                
                        </Form.Group>
                        <Form.Group controlId="formCategory1">
                                <Form.Label>Surname</Form.Label>
                                <div className='profileFormDivLittle'>
                                    <Form.Control type="text" defaultValue={surname} style={{width: 275}}/>
                                </div>
                                
                        </Form.Group>
                        <Form.Group controlId="formCategory1">
                                <Form.Label>Email</Form.Label>
                                <div className='profileFormDivLittle'>
                                    <Form.Control type="text" onChange = {(e) => setMail(e.target.value)} value = {mail} style={{width: 275}}/>
                                </div>
                                
                        </Form.Group>
                        
                                
                                <button type ="submit" onSubmit={handleSubmit}>Save Changes </button>
                                
                                
                        
                    </div>
                        
                    </Form>
                </div>

            </div>

    
        </>
    )


}

function LeftBody() {

    function handleOnClick(event){
        var image = document.getElementById("output");
        image.src = URL.createObjectURL(event.target.files[0]);
      };

    return (
        <>
            <div className='leftbody'>
            <div>
                <div className='image' style={{display: 'flex',  justifyContent:'left'}}>
                    <img className="profile-pic" src={splinter} alt= "profil pic" id="output" width="400" />
                </div>

                <div style={{display: 'flex',  justifyContent:'left'}}>
                    <label class="-label" for="file">
                        <span>Change Image</span>
                    </label>
                    
                </div>
                <div style={{display: 'flex',  justifyContent:'left'}}>
                    <input id="file" type="file" onChange={handleOnClick} />
                </div>

            </div>
        </div>
        </>
    )
}


export default ProfilePage