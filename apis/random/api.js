'use strict';

module.exports = function(app) {
  app.get('/random', function(req, res) {
    res.send('Try /number?min=2&max=9&decimals=1 (defaults to min = 0, max = min + 9, decimals = 0 | max inclusive) ');
  });

  app.get('/random/number', function(req, res) {
    const min = req.query.min ? parseFloat(req.query.min) : 0;
    const max = req.query.max ? parseFloat(req.query.max) : min + 9;
    const dec = req.query.decimals ? parseFloat(req.query.decimals) : 0;

    const random = (Math.random() * (max - min) + min).toFixed(dec);
    res.send(random);
  });
}
