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

//creating first request from api
app.get("/", async(req, res) => {
    // let response = await axios.get("https://api.openbrewerydb.org/v1/breweries", 
    // {
    // httpsAgent: new https.Agent({ rejectUnauthorized: false }) //making the request to trust the self-signed certificate
    // });
    let response = await axios.get("https://api.openbrewerydb.org/v1/breweries");
    //console.log(response.data);
    let result = response.data;
    res.render("index.ejs", {data : result});
  });

//filtering by city => san_deigo
app.get("/city", async(req, res) => {
    let response = await axios.get("https://api.openbrewerydb.org/v1/breweries?by_city=san_diego", 
    {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }) //making the request to trust the self-signed certificate
    });
    //console.log(response.data);
    let result = response.data;
    res.render("index.ejs", {data : result});
});

app.get("/city2", async(req, res) => {
    let searchTerm = req.body.search;
    let response = await axios.get(`https://api.openbrewerydb.org/v1/breweries?by_city=${searchTerm}`);
    // let response = await axios.get("https://api.openbrewerydb.org/v1/breweries?by_city=san_diego", 
    // {
    // httpsAgent: new https.Agent({ rejectUnauthorized: false }) //making the request to trust the self-signed certificate
    // });
    //console.log(response.data);
    let result = response.data;
    res.render("index.ejs", {data : result});
});




//predefined port to start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})