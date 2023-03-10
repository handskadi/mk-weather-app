const { response } = require("express");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  // Fetch data from external server
  var query = req.body.cityname;
  var apiKey = "MY KEY HERE";
  var units = "metric";
  var url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    units +
    "&appid=" +
    apiKey;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const city = weatherData.name;
      const icon = weatherData.weather[0].icon;

      res.write(
        "<h1>The temperature in " +
          city +
          " is " +
          temp +
          " degree Celcius</h1>"
      );
      res.write("<p>The weather is currently " + description + ".</p>");
      res.write(
        '<p><img src=" http://openweathermap.org/img/wn/' +
          icon +
          '@2x.png" alt=' +
          description +
          " /></p>"
      );
      res.send();
    });
  });
});

app.listen(port, function () {
  console.log("Server running on port: " + port);
});
