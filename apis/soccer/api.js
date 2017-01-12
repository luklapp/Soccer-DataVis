'use strict';

module.exports = function(app) {
  var mysql      = require('mysql');
  var connection = require('./db.js');
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

  app.get('/soccer/goals', function(req, res) {
    let minuteMin = parseInt(req.query.minuteMin) || 0
    let minuteMax = parseInt(req.query.minuteMax) || 90

    var sql = 'SELECT goal.goal_min, club.club_name, COUNT(goal.goal_min) as count FROM sz_fussball_matches_goal goal LEFT JOIN sz_fussball_club club ON goal.goal_clubID = club.club_id WHERE goal.goal_min >= ? AND goal.goal_min <= ? GROUP BY goal.goal_min, goal.goal_clubID';
    var inserts = [minuteMin, minuteMax];
    sql = mysql.format(sql, inserts);

    connection.query(sql, function(err, goals, field) {
      res.json({goals})
    });

  });

  app.get('/soccer/cards', function(req, res) {
    let minuteMin = parseInt(req.query.minuteMin) || 0
    let minuteMax = parseInt(req.query.minuteMax) || 90

    var sql = 'SELECT card.card_min, club.club_name, COUNT(card.card_min) as count FROM sz_fussball_matches_card card LEFT JOIN sz_fussball_club club ON card.card_clubID = club.club_id WHERE card.card_min >= ? AND card.card_min <= ? GROUP BY card.card_min, card.card_clubID';
    var inserts = [minuteMin, minuteMax];
    sql = mysql.format(sql, inserts);

    connection.query(sql, function(err, cards, field) {
      res.json({cards})
    });

  });

}
