import React, { useState } from 'react';
import axios from 'axios';



export function LogIn() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""   
    });

    const [errData, setErrData] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)

        axios.post('https://127.0.0.1:4000/login', formData, {withCredentials: true})
            .then(res => {
                if ( res.data.error != undefined ) setErrData(res.data.error);
                else {
                    window.location = '/';
                }
                console.log(res.data)
            })
            .catch( err=> {
                setErrData('Log In Error: ' + err);    
                console.log('Log In Error: ' + err);
            });

    }
        
    const handleRegister = (e) => {
        e.preventDefault();

        window.location='/register'
    }

    return(
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div></div>
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <></>
                <h3 style={{marginLeft: 'auto', marginRight: 'auto'}}> Log In </h3>
                <></>
            </div>
            <form onSubmit={handleSubmit} >
                <div className="form-group">
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div></div>
                        <label htmlFor="email">Email</label>
                        <div></div>
                    </div>
                    <input type='email' size='30' className="form-control" value={formData.email} placeholder="Enter Email"
                    onChange={(e)=>{setFormData({...formData, email: e.target.value})}}/>
                </div>
                <div className="form-group">
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div></div>
                        <label htmlFor="password">Password</label>
                        <div></div>
                    </div>
                    <input type='password' size='30' className="form-control" value={formData.password} placeholder="Password" 
                    onChange={(e)=>{setFormData({...formData, password: e.target.value})}}/> 
                </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div></div>
                        <button type="submit" className="btn" style={{backgroundColor: 'LightSkyBlue', marginTop: '10px', marginLeft: '10px'}}>Submit</button>
                        <div></div>
                    </div>
                <div style={{paddingBottom: '10px' }}></div>
            </form>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div></div>
                    <button type='submit' className='btn' onClick={handleRegister} style={{textDecoration: 'underline'}}>Don't have an account? Register Here.</button>
                    <div></div>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div></div>
                    <div>{errData}</div>
                    <div></div>
                </div>
        </div>
        <div></div>
        </div>
    );
}
