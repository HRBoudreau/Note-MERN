import React, { useState, useEffect } from 'react';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://127.0.0.1:4000',
    timeout: 1000,
    withCredentials: true,
    credentials: 'include'
  });

export function SignedInNavbar() {
    const [query, setQuery] = useState('');

    const handleNotesClick = (e) => {
        e.preventDefault();

        window.location='/';
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if( query != '') {
            window.location='/search/'+query;
        }
    }
    const handleKeyPress = (e) => {
        e.preventDefault();
        if ( e.key === "Enter" )  {
            handleSearch(e);
        }
    }

    const handleSignOut = (e) => {
        e.preventDefault();

        instance.post('/logout')
            .then( res => { console.log('logged out');
                window.location='/login'; 
            })
            .catch( err => console.log('Error logging out: ' + err ) );

    }

    return (
        <div style={{borderBottom: '1px solid black',display: 'flex', justifyContent: 'space-between', marginBottom: '20px',paddingBottom: '3px', paddingTop: '3px', backgroundColor: 'aliceblue'}}>
            <h3 style={{marginLeft: '40px', userSelect: 'none'}} onClick={handleNotesClick}>
                Note!
            </h3>
            <div>
                <input type='text' onKeyUp={(e)=>handleKeyPress(e)} onChange={(e)=>setQuery(e.target.value)} value={query} size='40' style={{border: '1px solid',padding: '8px', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px'}} placeholder='search'/>
                <button type='button'  onClick={handleSearch} style={{border: '1px solid LightSkyBlue', color: 'black', backgroundColor: 'LightSkyBlue', 
                            padding: '8px', borderTopRightRadius: '20px', borderBottomRightRadius: '20px',
                            borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderColor: 'LightSkyBlue'}}>Search</button>
            </div>
            <button type='submit' onClick={handleSignOut} style={{border: '1px solid LightSkyBlue',borderColor: 'LightSkyBlue',color: 'black', marginRight: '50px', backgroundColor: 'LightSkyBlue', padding: '6px', borderRadius: '10px'}}>Sign Out</button>
        </div>
    );
}

export function SignedOutNavbar() {


    const handleNotesClick = (e) => {
        e.preventDefault();

        window.location='/';
    }

    const handleSignIn = (e) => {
        e.preventDefault();

        window.location='/login';
    }

    return (
        <div style={{borderBottom: '1px solid black',display: 'flex', justifyContent: 'space-between', marginBottom: '20px',paddingBottom: '3px', paddingTop: '3px', backgroundColor: 'aliceblue'}}>
            <h3 style={{marginLeft: '40px', userSelect: 'none'}} onClick={handleNotesClick}>
                Notes
            </h3>
            <div>
                <input disabled={true} type='text' size='40' style={{border: '1px solid',padding: '8px', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px'}} placeholder='Sign in to search!'/>
                <button disabled={true}  type='button' style={{border: '1px solid LightSkyBlue', color: 'black', backgroundColor: 'LightSkyBlue', 
                            padding: '8px', borderTopRightRadius: '20px', borderBottomRightRadius: '20px',
                            borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderColor: 'LightSkyBlue'}}>Search</button>
            </div>
            <button type='submit' onClick={handleSignIn} style={{border: '1px solid LightSkyBlue',borderColor: 'LightSkyBlue',color: 'black', marginRight: '50px', backgroundColor: 'LightSkyBlue', padding: '6px', borderRadius: '10px'}}>Sign In</button>
        </div>
    );

}

export function Navbar() {
    const [navbarInstance, setNavbarInstance] = useState(<SignedOutNavbar/>);

    useEffect( () => {
        instance.post('/protected', { headers: { Cookie: '/refresh_cookie' } })
        .then( res => { 
            console.log("user ID: " );
            console.log(res.data.id);
            if ( res.data.id == undefined ) setNavbarInstance(<SignedOutNavbar/>);
            else setNavbarInstance (<SignedInNavbar/>);
            })
        .catch( err => {
            console.log('Error: ' + err);
            setNavbarInstance(<SignedOutNavbar/>); }
        )
    }, []);

    

    return(<div>{navbarInstance}</div>);

}