import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:4000',
    timeout: 1000,
    withCredentials: true,
    credentials: 'include'
  });

export function EditNote(props) {
    let {id} = useParams();
    const [data, setData] = useState({
        title: "",
        body: "",
        id: ""
    });

    useEffect(()=>{
        instance.post('/getnote', {id: id, headers: { Cookie: '/refresh_cookie' } })
        .then( res => {
            console.log(res.data.note);
            setData({
                title: res.data.note.title,
                body: res.data.note.body,
                id: id
            });
            //setNotes(res.data.notes);
            })
        .catch( err => {
            console.log('Error: ' + err);
        })
    }, []);

    const handleEdit= (e) => {
        e.preventDefault()

        instance.post('/editnote', {data, headers: { Cookie: '/refresh_cookie' } })
        .then(res=>{
            window.location='/';
        })
        .catch( err => {
            console.log('Error: ' + err);
        })

    }

    const handleDelete= (e) => {
        e.preventDefault()

        instance.post('/deletenote', {data, headers: { Cookie: '/refresh_cookie' } })
        .then(res=>{
            window.location='/';
        })
        .catch( err => {
            console.log('Error: ' + err);
        })

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
            <div style={{display: 'flex', justifyContent: 'space-between' }}>
            <button type='submit'  onClick={handleEdit} className='btn' style={{backgroundColor: 'LightSkyBlue'}}>Edit</button>
            <button type='submit'  onClick={handleDelete} className='btn' style={{backgroundColor: 'indianred'}}>Delete</button>
            </div>
        </div>
        </div>
    );
}