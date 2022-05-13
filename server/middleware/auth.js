const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  var obj = {};
  // var session = {};

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
  } else if (req.cookies) {
    req.session = {hash: req.cookies.shortlyid};

    var result;
    var resultId;

    models.Sessions.get({hash: req.session.hash})
      .then((data) => {
        console.log('then response', data);
        console.log('req session log', data.userId, data.user, data.user.username);
        req.session.user = {};
        var user = {username: data.user.username};



        if (data.userId) {
          req.session.user.username = user;
        } else {
          req.session.user = { 'username': null };
        }

        req.session = { userId: data.userId };

        console.log('req.session.user.username data', req.session, req.session.user.username);
        next();
      })
      .catch((error) => {
        console.log('catch error', error);
      });
    next();
    //console.log('outside promise', req.session.user.username);
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

