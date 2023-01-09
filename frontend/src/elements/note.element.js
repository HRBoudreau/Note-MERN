import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const instance = axios.create({
    baseURL: 'https://127.0.0.1:4000',
    timeout: 1000,
    withCredentials: true,
    credentials: 'include'
  });

function Note(params) {
    const [data, setData] = useState(
        {
            id: params.id,
            title: params.title,
            body: params.body,
        }
    );

    const [updatedAt, setUpdatedAt] = useState(params.updatedAt)
    const [formattedData, setformattedData] = useState()

    useEffect(()=>{
        const fd = new Date(updatedAt).toLocaleDateString("en-US");
        console.log(fd);
        setformattedData(fd);
    }, [updatedAt]);

    const handleEdit = (e) => {
        e.preventDefault();
        
        const loc = '/edit/' + data.id;
        window.location=loc
    }

    return(
    <div  key={data.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
    <div></div>
    <div style={{width: '80%'}}>
        <div style={{backgroundColor: 'aliceblue', borderRadius: '8px', borderBottomRightRadius: '0px',
            paddingTop: '5px', paddingBottom: '5px'}}>
        <div style={{paddingBottom: '5px', paddingLeft: '10px'}}>{data.title}</div>
        <div style={{maxHeight: '400px', whiteSpace: 'pre-wrap', overflowY: 'auto', textOverflow: 'ellipsis', 
        borderTop: '1px dotted black', paddingLeft: '10px'}}>{data.body}</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', justifyItems: 'right'}}>
            <div>{formattedData}</div>
        <button className='btn' onClick={handleEdit} style={{border: '1px solid LightSkyBlue',  fontSize: '15px', color: 'black', backgroundColor: 'lightskyblue',
            borderRadius: '20px', borderTopRightRadius: '0px', borderTopLeftRadius: '0px', 
            paddingTop: '0px', paddingBottom: '0px'}}>
                Edit</button>
        </div>
    </div>
    <div></div>
    </div>
    );
}

function Notes() {
    const [notes, setNotes] = useState([]);

    const handleNewNote = (e) => {
        e.preventDefault();

        window.location='/newnote';
    }

    useEffect( () => {
        instance.post('/getnotes', { headers: { Cookie: '/refresh_cookie' } })
        .then( res => {
            setNotes(res.data.notes);
            })
        .catch( err => {
            console.log('Error: ' + err);
        })
        }, []);


    return(
    <div>
        <button type='button' className='btn' onClick={handleNewNote} style={{border: '1px solid LightSkyBlue', color: 'black', backgroundColor: 'LightSkyBlue', 
                            padding: '8px', borderTopRightRadius: '20px', borderBottomRightRadius: '20px',
                            borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderColor: 'LightSkyBlue'}}>New Note +</button>
        <div>
            {notes.sort((a, b) => (new Date(b.updatedAt).getTime() || -Infinity) - (new Date(a.updatedAt).getTime() || -Infinity)).map( (note) => {
                console.log(note.updatedAt);
                return( 
                    <Note id={note._id} title={note.title} body={note.body} updatedAt={note.updatedAt}/>
                );
            } ) }
        </div>
    </div>
    );
}

function Search() {
    let {query} = useParams();
    const [notes, setNotes] = useState([]);

    const handleNewNote = (e) => {
        e.preventDefault();

        window.location='/newnote';
    }

    useEffect( () => {
        instance.post('/search', { query: query, headers: { Cookie: '/refresh_cookie' } })
        .then( res => {
            setNotes(res.data.notes);
            })
        .catch( err => {
            console.log('Error: ' + err);
        })
        }, []);


    return(
    <div>
        <button type='button' className='btn' onClick={handleNewNote} style={{border: '1px solid LightSkyBlue', color: 'black', backgroundColor: 'LightSkyBlue', 
                            padding: '8px', borderTopRightRadius: '20px', borderBottomRightRadius: '20px',
                            borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderColor: 'LightSkyBlue'}}>New Note +</button>
        <div>
            {notes.sort((a, b) => (new Date(b.updatedAt).getTime() || -Infinity) - (new Date(a.updatedAt).getTime() || -Infinity)).map( (note) => {
                console.log(note.updatedAt);
                return( 
                    <Note id={note._id} title={note.title} body={note.body} updatedAt={note.updatedAt}/>
                );
            } ) }
        </div>
    </div>
    );
}

export { Note, Notes, Search };