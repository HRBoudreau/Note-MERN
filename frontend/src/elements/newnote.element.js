import React, { useState, useEffect } from 'react';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:4000',
    timeout: 1000,
    withCredentials: true,
    credentials: 'include'
  });

export function NewNote() {
    const [data, setData] = useState({
        title: "",
        body: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if ( data.title=="" || data.body=='' ) return;

        console.log(data);

        instance.post('http://127.0.0.1:4000/newnote', data)
            .then(res => { 
                console.log(data);
                if ( res.error != undefined ) window.location='/login';
                else window.location='/';
            } )
            .catch( err => {throw new Error('Error: ' + err )});
    }

    return(
        <div style={{marginLeft: '50px', marginRight: '50px'}}>
        <div className='form' >
            <div className='form-group'>
                <input type='text' className='form-control' value={data.title} placeholder='New Note'  
                style={{backgroundColor: 'aliceblue', border: '0px', borderRadius: '0px', borderTopRightRadius: '8px', 
                borderTopLeftRadius: '8px'}}
                onChange={(e)=>{setData({...data, title: e.target.value})}} />
            </div>
            <div className='form-group'>
                <textarea type='text' cols="40" rows="5" className='form-control' value={data.body} placeholder='Write new note!'
                style={{backgroundColor: 'aliceblue', border: '0px', resize: 'none', height: '300px', marginBottom: '5px', 
                borderRadius: '0px', borderBottomRightRadius: '8px', borderBottomLeftRadius: '8px', borderTop: '1px dotted black'}}
                onChange={(e)=>{setData({...data, body: e.target.value})}} />
            </div>
            <button type='submit' onClick={handleSubmit} className='btn' style={{backgroundColor: 'LightSkyBlue'}}>Add Note</button>
        </div>
        </div>
    );
}
