import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Note, Notes } from './note.element';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:4000',
    timeout: 1000,
    withCredentials: true,
    credentials: 'include'
  });


//{notes.map((e)=>{<Note title={e.title} body={e.body} updatedAt={e.updatedAt} />})}
export function Main() {
    const [element, setElement] = useState(<div>---</div>);

    useEffect( () => {
        instance.post('/protected', { headers: { Cookie: '/refresh_cookie' } })
        .then( res => { 
            console.log("user ID: " );
            console.log(res.data.id);
            if ( res.data.id == undefined ) window.location='/login';
            else setElement (<Notes/>);
            })
        .catch( err => {
            console.log('Error: ' + err);
            window.location='/login'; }
        )
    }, []);

    return(<div>{element}</div>);
}