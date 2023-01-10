# Note!
 A MERN ( MongoDB, Expresss.js, React.js, Node.js ) note taking app.
 
## Technologies
Project is created with:
* React.js: 18.2.0
* Node.js: 16.13.1
* Express.js: 4.18.2
* Express.js: 4.18.2
	
## Setup
To run this project, start the frontend using npm:

```
$ cd ./frontend
$ npm install
$ npm start
```

And in a separate command line start the node server:

```
$ cd ./backend
$ npm install
$ cd ./src
$ nodemon
```

As for the mongodb database I used a docker image on port 6000. You'll have to connect to your own mongodb database, be it with docker, or one in the cloud. In order to change the mongodb URL go to ./backend/src/.env and change the variable MONGO_PATH.
