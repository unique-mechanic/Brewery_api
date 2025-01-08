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

app.get('/location', async (req, res) => {
    const { lat, lon, page = 1, limit = 3 } = req.query;
    const currentPage = parseInt(page);
    const perPage = parseInt(limit);
    const offset = (currentPage - 1) * perPage;

    try {
        const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries?by_dist=${lat},${lon}&per_page=${perPage}&page=${currentPage}`);
        const breweries = response.data;

        // Calculate if there's a next page
        const totalBreweries = response.headers['x-total-count']; // Assuming this is returned by the API
        const hasNextPage = currentPage * perPage < totalBreweries;

        res.render('location', {
            locals: {
                lat,
                lon,
                data: breweries,
                statesCovered: ['California', 'Texas'], // Example data
                countriesCovered: ['USA'],
                currentPage,
                hasNextPage
            }
        });
    } catch (error) {
        console.error('Error fetching breweries:', error);
        res.status(500).send('Internal Server Error');
    }
});

//predefined port to start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})