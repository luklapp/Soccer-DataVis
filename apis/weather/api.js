module.exports = function(app) {
  app.get('/weather', function(req, res){
    res.send('Usage: \'/weather/city/city-name,country-code\' (country code is optional) or \'/weather/geolocation/longitude=00.0&latitude=00.0\'');
  });

  app.get('/weather/city/:cityName', function(req, res) {
    getWeatherByCity(req.params.cityName, res);
  });

  app.get('/weather/geolocation', function(req, res){
    var long = req.query.longitude;
    var lat = req.query.latitude;

    if (long && lat) {
      getWeatherByGeolocation(long, lat, res);
    } else {
      res.status(400).send('Longitude and Latitude required!');
    }
  });
}

const getWeatherByCity = function(cityName, res) {
  var apiKey = require("./secrets/api-key.js").apiKey;
  var options = {
    host: `api.openweathermap.org`,
    path: `/data/2.5/weather?q=${cityName}&APPID=${apiKey}`,
    port: 80,
    method: "GET"
  }

  requestWeather(options, res);
}

const getWeatherByGeolocation = function(long, lat, res) {
  var apiKey = require("./secrets/api-key.js").apiKey;
  var options = {
    host: `api.openweathermap.org`,
    path: `/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${apiKey}`,
    port: 80,
    method: "GET"
  }

  requestWeather(options, res);
}

const requestWeather = function(options, con) {
  var http = require('http');

  http.request(options, function(res) {
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      var data = JSON.parse(chunk);

      if (data.cod === 200) {
        con.send(data);
      } else {
        con.status(data.cod).send(data.message);
      }
    });
  }).end();
}

