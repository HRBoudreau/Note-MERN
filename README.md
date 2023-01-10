# Note!
 A MERN ( MongoDB, Express.js, React.js, Node.js ) note taking app.
 
 ![image](https://user-images.githubusercontent.com/76916678/211636331-ddc80a29-fdab-42aa-9c5f-25de71b6ca77.png)


## Technologies
Project is created with:
* React.js: 18.2.0
* Node.js: 16.13.1
* Express.js: 4.18.2
* jsonwebtoken: 9.0.0
* mongoose: 6.8.2
* axios: 1.2.2
	
## Setup
To run this project, install and start the frontend using npm:

```
$ cd ./frontend
$ npm install
$ npm start
```

And in a separate command line install and start the node server:

```
$ cd ./backend
$ npm install
$ cd ./src
$ nodemon
```

As for the mongodb database I used a docker container listening on port 6000. You'll have to connect to your own mongodb database, be it with docker, or one that's in the cloud. In order to change the mongodb URL go to ./backend/src/.env and change the variable MONGO_PATH.
