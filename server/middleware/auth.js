/* eslint-disable indent */
const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  var obj = {};
  var session = {};

  if (Object.keys(req.cookies).length === 0) {
    models.Sessions.create()
      .then((data) => {
        return models.Sessions.get({id: data.insertId});
      })
      .then((results) => {
        req.session = {hash: results.hash};
        res.cookie('shortlyid', req.session.hash);
        next();
      });
  } else {
    if (req.cookies.shortlyid) {
    req.session = {hash: req.cookies.shortlyid};
    models.Sessions.get({hash: req.session.hash})
      .catch((error) => {
      })
      .then((data) => {
        if (data) {
          req.session = data;
          res.cookie('shortlyid', req.session.hash);
          var id = data.userId;
          if (id) {
            req.session.userId = id;
            models.Users.get({id})
              .then((userData) => {
                req.session.user = {username: userData.username};
                next();
              });
          } else {
            next();
          }
        } else {
          models.Sessions.create()
            .then((data) => {
              var id = data.insertId;
              return models.Sessions.get({id});
            })
            .then((results) => {
              req.session = results;
              res.cookie('shortlyid', req.session.hash);
              next();
            });
        }
      });
    }
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
