const express = require('express');
const cors = require('cors');
const app = express();
const port = 8888;

app.use(cors());

const dbService = require('./dbService');


app.get('/', (req, res) => {
    res.send(dbService.getLgStats());
})

app.get('/weaponstats', (req, res) => {
    res.send(dbService.getMainStats());
});

app.get('/avgAcc/:weaponName', (req, res) => {
    let avg = dbService.getAvgAccOfWeapon(req.params.weaponName);
    res.send({avg});
    console.log(`sent avg acc for ${req.params.weaponName}: ${avg}`);
});

app.get('/mostHits/:weaponName', (req, res) => {
    let mostHits = dbService.getMostHitsOfWeapon(req.params.weaponName);
    res.send({mostHits});
    console.log(`sent most hits for ${req.params.weaponName}: ${mostHits}`);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
})