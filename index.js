//import express, axios 
import express from "express";
import axios from "axios";
import https from "https";
//import bootstrap from "bootstrap";

//creating express app
const app = express();
const port = 3000;

//creating public folder
app.use(express.static('public'));

const city = [];
const state =[];

//creating first request from api
app.get("/", async(req, res) => {
    let response = await axios.get("https://api.openbrewerydb.org/v1/breweries", 
    {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }) //making the request to trust the self-signed certificate
    });
    //let response = await axios.get("https://api.openbrewerydb.org/v1/breweries");
    //console.log(response.data);
    let result = response.data;
    console.log(city);
    res.render("index.ejs", {data : result, city: city});
  });

//filtering by city => san_deigo
app.get("/city", async(req, res) => {
    let response = await axios.get("https://api.openbrewerydb.org/v1/breweries", 
    {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }) //making the request to trust the self-signed certificate
    });
    //console.log(response.data);
    let result = response.data;
    if(city.length === 0){
        result.forEach(function(brewery){
            city.push(brewery.city);    
        });
    }
    res.render("city.ejs", {data : result, city: city});
});

app.get("/getCity", async (req, res) => {
    const selectedCity = req.query.city; // Get the selected city from query parameters
    try {
        let response = await axios.get(`https://api.openbrewerydb.org/v1/breweries?by_city=${encodeURIComponent(selectedCity)}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Making the request to trust the self-signed certificate
        });
        let result = response.data;
        res.render("city.ejs", { data: result, selectedCity: [selectedCity], city: city});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/state", async(req, res) => {
    let response = await axios.get("https://api.openbrewerydb.org/v1/breweries", 
    {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }) //making the request to trust the self-signed certificate
    });
    //console.log(response.data);
    let result = response.data;
    if(state.length === 0){
        result.forEach(function(brewery){
            state.push(brewery.state);    
        });
    }
    res.render("state.ejs", {data : result, state: state});
});

app.get("/getState", async (req, res) => {
    const selectedState = req.query.state; // Get the selected city from query parameters
    try {
        let response = await axios.get(`https://api.openbrewerydb.org/v1/breweries?by_state=${encodeURIComponent(selectedState)}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Making the request to trust the self-signed certificate
        });
        let result = response.data;
        console.log(result);
        res.render("state.ejs", { data: result, selectedState: [selectedState], state: state});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/location", async (req, res) => {
    const latitude = req.query.lat;
    const longitude = req.query.lon;
    console.log(latitude + "" + longitude);
    try {
        let response = await axios.get(`https://api.openbrewerydb.org/v1/breweries?by_dist=${latitude},${longitude}&per_page=3`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Making the request to trust the self-signed certificate
        });
        let result = response.data;
        console.log("States covered");
        const statesCoveredSet = new Set();
        const countriesCoveredSet = new Set();
        result.forEach(function (brewery) {
            statesCoveredSet.add(brewery.state);
            countriesCoveredSet.add(brewery.country);
        });
        const statesCovered = Array.from(statesCoveredSet);
        const countriesCovered = Array.from(countriesCoveredSet);
        console.log(statesCovered);
        res.render("location.ejs", { data: result, statesCovered: statesCovered, countriesCovered: countriesCovered });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



//predefined port to start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})