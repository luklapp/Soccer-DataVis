module.exports = function(app) {
  app.get('/weather', function(req, res){
    res.send('Usage: \'/weather/city/city-name,country-code&units=metric\' (country code is optional, units defaults to metric with kelvin) or \'/weather/geolocation/longitude=00.0&latitude=00.0\'');
  });

  app.get('/weather/city/:cityName', function(req, res) {
    var units = req.query.units;
    getWeatherByCity(req.params.cityName, units, res);
  });

  app.get('/weather/geolocation', function(req, res){
    var long = req.query.longitude;
    var lat = req.query.latitude;
    var units = req.query.units;

    if (long && lat) {
      getWeatherByGeolocation(long, lat, units, res);
    } else {
      res.status(400).send('Longitude and Latitude required!');
    }
  });
}

const getWeatherByCity = function(cityName, units, res) {
  var apiKey = require("./secrets/api-key.js").apiKey;
  var options = {
    host: `api.openweathermap.org`,
    path: `/data/2.5/weather?q=${cityName}&APPID=${apiKey}&units=${units}`,
    port: 80,
    method: "GET"
  }

  requestWeather(options, res);
}

const getWeatherByGeolocation = function(long, lat, units, res) {
  var apiKey = require("./secrets/api-key.js").apiKey;
  var options = {
    host: `api.openweathermap.org`,
    path: `/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${apiKey}&units=${units}`,
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
