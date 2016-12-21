'use strict';

module.exports = function(app) {
 
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'tableau'
  });

  connection.connect();

  app.get('/soccer', function(req, res) {
    res.json({
      code: 418,
      message: 'I\'m a teapot'
    })
  });

  app.get('/soccer/cardsAndGoals', function(req, res) {
    connection.query('SELECT goal_min, COUNT(goal_min) as count FROM sz_fussball_matches_goal WHERE goal_min <= 90 GROUP BY goal_min ORDER BY goal_min ASC', function(err, goals, field) {
      connection.query('SELECT card_min, COUNT(card_min) as count FROM sz_fussball_matches_card WHERE card_min <= 90 GROUP BY card_min ORDER BY card_min ASC', function(err, cards, field) {
        res.json({
          goals: goals,
          cards: cards
        });
      });
    });
  });

}