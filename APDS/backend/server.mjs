//v1
// import http from 'http';
// import express from 'express';

// const app = express();
// app.use(express.json());

// const PORT = 3000;
// const urlprefix = '/api';
// const usingExpress = 'Using express to run the server';
// const deathText = 'killing you';
// const favourites = [
//     { id: '1', name: 'Death Note' },
//     { id: '2', name: 'Attack on Titan' },
//     { id: '3', name: 'One Punch Man' },
//     { id: '4', name: 'Naruto' }
// ];
// const favs = favourites.map(fav => fav.name);
// const person = 'Varusha <3';

// app.get('/', (req, res) => {
//     res.send(usingExpress);
// });

// app.get('/test', (req, res) => {
//     res.send('Using the /test endpoint');
// });

// app.get('/death', (req, res) => {
//     res.send(deathText);
// });

// app.get(`${urlprefix}/favourites`, (req, res) => {
//     res.json(favourites);
//     // or res.send(favs)
// });

// app.get('/person', (req, res) => {
//     res.send(person);
// });

// app.get('/random', (req, res) => {
//     const random = Math.floor(Math.random() * 3);
//     if (random === 0) {
//         res.send(person);
//     } else if (random === 1) {
//         res.json(favourites);
//     } else if (random === 2) {
//         res.send(deathText);
//     } else {
//         res.send('Error');
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

//v2 maybe broken
import https from "https";
import http from "http";
import fs from "fs";
import posts from "./routes/post.mjs";
import users from "./routes/user.mjs";
import express from "express";
import cors from "cors";

const PORT = 3000;
const app = express();

const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
};

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.use("/post", posts);
app.route("/post", posts);
app.use("/user", users);
app.route("/user", users);

let server = https.createServer(options, app);
server.listen(PORT);