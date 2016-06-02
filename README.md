# ApiHub
Manage your Node APIs with ApiHub. Simply add your APIs to the apis directory.

##Motivation
Have all your APIs in one place and simply plug new once in.
This is a light weight and fast setup solution for managing node APIs.

##Included APIs
 * Hello world
 * Random Stuff API
   * Random number
  

##Adding APIs
 All APIs have a separate directory in the ./apis directory.
 Just add an api.js file containing your routes with the prefix: `/API-NAME`.

###Example
 `./apis/weather/api.js`:

    module.exports = function(app) {
      app.get('/weather/:city', function(req, res, next) {
        res.send(getWeatherByCity(req.params.city));
      });

      function getWeatherByCity(cityName) {
        ...
      }
    }

##Setup
 * Clone repository
 * `$ npm install`
 * `$ node app.js`

##Contribute
I'm happy to welcome anyone on board. If you have suggestions or complaints, fire away! Just add an issue.

For pull requests please follow these rules:
 1. Fork this project
 2. Make a new feature branch
 3. Hack away
 4. When adding an API, add it to this README
 5. Push branch to GitHub
 6. Make pull request

##License
Copyright (c) 2016 Fabian Hoffmann

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
