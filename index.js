//import express, axios 
import express from "express";
import axios from "axios";
//import bootstrap from "bootstrap";

//creating express app
const app = express();
const port = 3000;

//creating public folder
app.use(express.static('public'));

//creating first request from api

app.get("/", async(req, res) => {
    let response = await axios.get("https://api.openbrewerydb.org/v1/breweries");
    //console.log(response.data);
    let result = response.data;
    res.render("index.ejs", {data : result});
  });

app.get("/city", async(req, res) => {
    let response = await axios.get("https://api.openbrewerydb.org/v1/breweries?by_city=san_diego");
    //console.log(response.data);
    let result = response.data;
    res.render("index.ejs", {data : result});
});





//predefined port to start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})