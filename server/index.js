const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
console.log('SERVER STARTED');
app.get('/api/weather', function(req, res){
    console.log('GETTING WEATHER');
    const location = req.query.location || '';
    const units = req.query.units || '';
    const apiKey = process.env.API_KEY;
    const request = require('request');
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
            console.log('error:', err);
        } else {
            console.log('body:', body);
            res.send(body)
        }
    });
})

app.get('/api/log', (req, res) => {
  const location = req.query.location || '';
  const weather = req.query.weather || '';
  const temperature = req.query.temperature || '';

  const path = './output.json';
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) throw err

        var previousSearches = JSON.parse(data)
        previousSearches.locations.push({
            location: location,
            weather: weather,
            temperature: temperature,
        });

        let arr = previousSearches.locations;
        arr = arr.slice(Math.max(arr.length - 5, 0));
        previousSearches.locations = arr;

        fs.writeFile(path, JSON.stringify(previousSearches), 'utf-8', function(err) {
            if (err) throw err
            res.setHeader('Content-Type', 'application/json');
            res.sendStatus(200);
        })
    })
});
app.get('/api/getlog', (req, res) => {
    const path = './output.json';
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) throw err;
        res.send(JSON.stringify(JSON.parse(data).locations));
    })
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
