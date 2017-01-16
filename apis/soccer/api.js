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
    connection.query('SELECT goal_min, COUNT(goal_min) as count FROM sz_fussball_matches_goal WHERE goal_min >= 0 && goal_min <= 90 GROUP BY goal_min ORDER BY goal_min ASC', function(err, goals, field) {
      connection.query('SELECT card_min, COUNT(card_min) as count FROM sz_fussball_matches_card WHERE card_min >= 0 && card_min <= 90 GROUP BY card_min ORDER BY card_min ASC', function(err, cards, field) {
        
        // Fix for minute 0, which means "unknown" in our dataset
        goals[0].count = 0;
        cards[0].count = 0;

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

  app.get('/soccer/cardsByClub', function(req, res) {
    let minuteMin = parseInt(req.query.minuteMin) || 0
    let minuteMax = parseInt(req.query.minuteMax) || 90

    var sql = 'SELECT club.club_name, COUNT(card.card_min) as count FROM sz_fussball_matches_card card LEFT JOIN sz_fussball_club club ON card.card_clubID = club.club_id WHERE card.card_min >= ? AND card.card_min <= ? GROUP BY card.card_clubID ORDER BY count DESC';
    var inserts = [minuteMin, minuteMax];
    sql = mysql.format(sql, inserts);

    connection.query(sql, function(err, cards, field) {
      res.json({cards})
    });

  });

  app.get('/soccer/goalsByClub', function(req, res) {
    let minuteMin = parseInt(req.query.minuteMin) || 0
    let minuteMax = parseInt(req.query.minuteMax) || 90

    var sql = 'SELECT club.club_name, COUNT(goal.goal_min) as count FROM sz_fussball_matches_goal goal LEFT JOIN sz_fussball_club club ON goal.goal_clubID = club.club_id WHERE goal.goal_min >= ? AND goal.goal_min <= ? GROUP BY goal.goal_clubID ORDER BY count DESC';
    var inserts = [minuteMin, minuteMax];
    sql = mysql.format(sql, inserts);

    connection.query(sql, function(err, goals, field) {
      res.json({goals})
    });

  });

  app.get('/soccer/cardsByCountry', function(req, res) {
    let minuteMin = parseInt(req.query.minuteMin) || 0
    let minuteMax = parseInt(req.query.minuteMax) || 90
    let limit = parseInt(req.query.limit);

    var sql = `SELECT country.count_name, COUNT(card.card_min) as count 
              FROM sz_fussball_matches_card card 
                INNER JOIN sz_fussball_player player 
                  ON player.pl_id = card.card_playerID
                INNER JOIN sz_fussball_country country
                  ON country.count_id = player.pl_countryid
                WHERE (card.card_min >= ? AND card.card_min <= ? ) GROUP BY player.pl_countryid ORDER BY count DESC `;

    let inserts;

    if (limit > 0 ) {
      sql += ` LIMIT ?;`;
      inserts = [minuteMin, minuteMax, limit];
    } else {
      sql += `;`;
      inserts = [minuteMin, minuteMax];
    }
    sql = mysql.format(sql, inserts);
    console.log(sql);

    connection.query(sql, function(err, cards, field) {
      for (let card in cards) {
        cards[card].cr = card;
      }
      res.json({cards})
    });

  });

  app.get('/soccer/goalsByCountry', function(req, res) {
    let minuteMin = parseInt(req.query.minuteMin) || 0
    let minuteMax = parseInt(req.query.minuteMax) || 90
    let limit = parseInt(req.query.limit);

    console.log('Limit', limit);

    var sql = `SELECT country.count_name, COUNT(goal.goal_min) as count 
                FROM sz_fussball_matches_goal goal 
                  INNER JOIN sz_fussball_player player 
                    ON player.pl_id = goal.goal_playerID
                  INNER JOIN sz_fussball_country country
                    ON country.count_id = player.pl_countryid
                  WHERE (goal.goal_min >= ? AND goal.goal_min <= ?) GROUP BY player.pl_countryid ORDER BY count DESC
              `;

    let inserts;

    if (limit > 0 ) {
      sql += ` LIMIT ?;`;
      inserts = [minuteMin, minuteMax, limit];
    } else {
      sql += `;`;
      inserts = [minuteMin, minuteMax];
    }
    sql = mysql.format(sql, inserts);
    console.log(sql);

    connection.query(sql, function(err, goals, field) {
      for (let goal in goals) {
        goals[goal].cr = goal;
      }
      res.json({goals})
    });

  });

  app.get('/soccer/avgGoalsCards', function(req, res) {
    let minuteMin = parseInt(req.query.minuteMin) || 0
    let minuteMax = parseInt(req.query.minuteMax) || 90

    var sql = `SELECT goal.goal_clubID as id, club.club_name,  
                      COUNT(*)/(SELECT COUNT(DISTINCT spiel_id) FROM sz_fussball_matches_goal WHERE goal_clubID = goal.goal_clubID) as y,
                      (SELECT COUNT(*)/(SELECT COUNT(DISTINCT spiel_id) FROM sz_fussball_matches_card WHERE card_clubID = goal.goal_clubID)
                        FROM sz_fussball_matches_card
                        WHERE card_clubID = goal.goal_clubID AND card_min >= ? AND card_min <= ?
                        GROUP BY  card_clubID) as x
                      FROM sz_fussball_matches_goal goal
                      LEFT JOIN sz_fussball_club club ON goal.goal_clubID = club.club_id 
                      WHERE goal.goal_min >= ? AND goal.goal_min <= ?
                      GROUP BY goal.goal_clubID 
                      ORDER BY y DESC
    `;

    sql = mysql.format(sql, [minuteMin, minuteMax, minuteMin, minuteMax]);

    connection.query(sql, function(err, values, field) { 
      res.json(values);
    });

  });

}
