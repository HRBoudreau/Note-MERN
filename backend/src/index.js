const path = require('path');
require('dotenv').config({path: __dirname + '/.env' });
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');
const { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } = require('./tokens');
const { isAuth } = require('./isAuth');
const passwordHash = require('password-hash');
const mongoose = require('mongoose');
const fs = require('fs');
const privateKey = fs.readFileSync('../key.pem');
const certificate = fs.readFileSync('../myCert.pem');
const https = require('https');

mongoose.connect(process.env.MONGO_PATH).
    catch( err => console.log( err, ' Mongoose failed to connect.') );
const connection = mongoose.connection;
connection.once( 'open', () => {
    console.log("MongoDB database connection established successfully");
});
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const noteSchema = new Schema({
    userId: {type: String, required: true },
    title: {type: String, required: true },
    body: {type: String, required: true }
    }, {
    timestamps: true
    }
);

noteSchema.index({title: 'text', body: 'text'});

const Note = mongoose.model('Note', noteSchema);
Note.createIndexes();

//endpoints
//1. register user
//2. login a user
//3. logout a user
//4. setup a protected route
//5. get a new accesstoken with a refresh token

const server = express();

// use express middleware for easier cookie handling
server.use(cookieParser());
server.use(
    cors({
        origin: "https://127.0.0.1:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,  "preflightContinue": false,
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Authorization']
    })
);

server.use(express.json()); // to support JSON encoded bodies
server.use(express.urlencoded({ extended: true })); //suprt url encoded bodies

const options = { key: privateKey, cert: certificate, passphrase: "password" };
https.createServer(options, server).listen(process.env.PORT, () => console.log('Server listening on port', process.env.PORT) );

//register user
server.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // check for valid input
        if (email.length==0 || password.length==0) {
            throw new Error("Password or Email not input");
        }
        // check if user exits 
        const user = await User.find( {email: {$regex : email,$options :"i"}} ).exec();
        if (user.length>0) throw new Error( "User already exists.");

        const hashedPassword = await passwordHash.generate(password, {saltLength: 10});
        console.log("hashed password: " + hashedPassword);

        const newUser = new User({
            email: email,
            password: hashedPassword
        });

        newUser.save()
            .then( () => { res.json('user created');  } )
            .catch( err => { res.status(400).json('Error: ' + err); throw new Error('failure to save.'); } );

    } catch (err) {
        console.log(err);
        res.send({ error: 'Error: ' + err.message });
    }
});

server.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if ( email.length==0 || password.length==0 ) {
            throw new Error('Email or Password not input');
        }
        const user = await User.find( {email : {$regex: email, $options: 'i'} } ).exec();
        console.log(user);
        if(user.length==0) {
            throw new Error('User does not exist');
        }
        const valid = await passwordHash.verify(password, user[0].password);
        if (!valid) throw new Error('Password not correct');
        const accesstoken = createAccessToken(user[0]._id);
        const refreshtoken = createRefreshToken(user[0]._id);
        // put token in database
        user.refreshtoken = refreshtoken;
        // send refresh as cookie and accesstoken as regular response
        sendRefreshToken(res, refreshtoken);
        sendAccessToken(res, req, accesstoken);
    } catch (err) {
        res.send({
            error: err.message
        })
    }
});

server.post('/logout', (_req, res) => {
    res.clearCookie('refreshtoken');
    return res.send({
        message: 'Logged out',
    })
});

// protected route
server.post('/protected', async (req, res) => {
    try {
        const userId = isAuth(req.cookies);
        if (userId !== null && userId !== undefined) {
            console.log('userid ');
            console.log(userId);
            res.send({id: userId});
            console.log('User ' + userId + " accessed data");
        }
    } catch (err) {
        console.log('Error: ' + err);
        res.send({
            data: err.message
        })
    }

});

server.post('/newnote', async (req, res) => {
    try {
        const userId = isAuth(req.cookies);
        if (userId !== null && userId !== undefined) {
            const { title, body } = req.body;
            const note = new Note({
                userId: userId,
                title: title,
                body: body
            });
            
        note.save()
        .then( () => { res.json('note created');  } )
        .catch( err => { res.status(400).json('Error: ' + err); throw new Error('failure to save. ' + err); } );
        }
        else res.send({
            error: 'Not Signed In'
        });
    }
    catch (err) { 
        console.log('Error: ' + err);
        res.send({
            data: err.message
        })
    }
});

server.post('/getnotes', async (req, res) => {
    try {
        const userId = isAuth(req.cookies);
        const notes = await Note.find({userId: userId}).exec();
        res.send({notes: notes});
    } catch (err) {
        console.log('Error: ' + err);
        res.send({
            error: err.message
        })
    }

});

server.post('/getnote', async (req, res) => {
    try {
        const userId = isAuth(req.cookies);
        if( userId == undefined ) throw new Error('not logged in');
        const note = await Note.findById(req.body.id).exec();
        console.log(note);
        res.send({note: note});
    } catch (err) {
        console.log('Error: ' + err);
        res.send({
            error: err.message
        })
    }

});

server.post('/editnote', async (req, res) => {
    try {
        const userId = isAuth(req.cookies);
        if( userId == undefined ) throw new Error('not logged in');
        await Note.findByIdAndUpdate(req.body.data.id, {title: req.body.data.title, body: req.body.data.body } ).exec();
        res.send('Note Edited');
    } catch (err) {
        console.log('Error: ' + err);
        res.send({
            error: err.message
        })
    }

});

server.post('/deletenote', async (req, res) => {
    try {
        const userId = isAuth(req.cookies);
        if( userId == undefined ) throw new Error('not logged in');
        await Note.findByIdAndDelete(req.body.data.id).exec();
        res.send('Note Deleted');
    } catch (err) {
        console.log('Error: ' + err);
        res.send({
            error: err.message
        })
    }
});

server.post('/search', async (req, res) => {
    try {
        const userId = isAuth(req.cookies);
        if( userId == undefined ) throw new Error('not logged in');
        const searchString = '"' + req.body.query + '"';
        const notes = await Note.find({ $and: [{userId: userId}, { $text : {$search: searchString} }] }).exec();
        res.send({notes: notes});
    } catch (err) {
        console.log('Error: ' + err);
        res.send({
            error: err.message
        })
    }

});

server.post('/email-from-id', async (req, res) => {
    try {
        console.log('email-from-id ');
        console.log(req.body);
        const user = await User.find({ _id: req.body.id }).exec();
        console.log(user[0].email);
        res.send({ email: user[0].email });
    } catch (err) {
        console.log('Error ' + err);
        res.send({
            data: err.message
        })
    }

});