import React, { useEffect, useState } from 'react';
import axios from 'axios';



export function Protected() {
    const [ secret, setSecret ] = useState("");
    const [ email, setEmail ] = useState("");
    
    const instance = axios.create({
        baseURL: 'https://127.0.0.1:4000',
        timeout: 1000,
        withCredentials: true,
        credentials: 'include'
      });

    const handleSubmit = (e) => {
        e.preventDefault();

        instance.post('/protected', { headers: { Cookie: '/refresh_cookie' } })
            .then( res => { 
                console.log(res.data + "1");
                instance.post('/email-from-id', { id: res.data.id })
                    .then( res => {
                        console.log( res.data.email );
                        setEmail(res.data.email); 
                    })
                    .catch( err => console.log('Error: ' + err) );
                    console.log("2");
                })
            .catch( err => console.log('Error: ' + err));
    }

    useEffect( () => {
        const newSecret = 'Accessed by ' + email;
        setSecret({data: newSecret});
    }, [email] )

    return(
        <>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>
            <div>
                {secret.data}
            </div>
        </>
    );


}