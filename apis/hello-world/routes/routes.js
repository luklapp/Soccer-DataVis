module.exports = function(app) {
  app.get('/hello', function(req, res){
    if (req.query.name) {
      res.send(`Hello ${req.query.name}!`);
    } else {
      res.send('Hello world!');
    }
  });

  app.get('/hello/:name', function(req, res){
    res.send(`Hello ${req.params.name}!`);
  });
}
