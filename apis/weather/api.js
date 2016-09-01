module.exports = function(app) {
  app.get('/weather', function(req, res){
    res.send('Usage: \'/weather/city/city-name,country-code&units=metric\' (country code is optional, units defaults to metric with kelvin) or \'/weather/geolocation/longitude=00.0&latitude=00.0\'');
  });

  app.get('/weather/city/:cityName', function(req, res) {
    getWeatherByCity(req, res);
  });

  app.get('/weather/geolocation', function(req, res){
      getWeatherByGeolocation(req, res);
  });
}

const getWeatherByCity = function(req, res) {
  var units = req.query.units;
  var language = req.query.lang;
  var cityName = req.params.cityName;

  var apiKey = require("./secrets/api-key.js").apiKey;
  var options = {
    host: `api.openweathermap.org`,
    path: `/data/2.5/weather?q=${cityName}&APPID=${apiKey}&units=${units}&lang=${language}`,
    port: 80,
    method: "GET"
  }

  requestWeather(options, res);
}

const getWeatherByGeolocation = function(req, res) {
  var units = req.query.units;
  var language = req.query.lang;
  var long = req.query.longitude;
  var lat = req.query.latitude;

  if (long && lat) {
    var apiKey = require("./secrets/api-key.js").apiKey;
    var options = {
      host: `api.openweathermap.org`,
      path: `/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${apiKey}&units=${units}&lang=${language}`,
      port: 80,
      method: "GET"
    }

    requestWeather(options, res);

  } else {
    res.status(400).send('Longitude and Latitude required!');
  }
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
