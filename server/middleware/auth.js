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
  } else if (req.cookies) {
    req.session = {hash: req.cookies.shortlyid};

    models.Sessions.get({hash: req.session.hash})
      .then((data) => {
        //console.log('data', data, data.user.username);
        req.session = { userId: data.userId };
        req.session['user'] = {'username': data.user.username};
        console.log('req.session.user.username data', req.session, req.session.user.username);
      })
      .catch(console.log('error'));



    // no user id

    // check if userId exists

    // query sessions table using hash, get userID
    // join
    // query user table with userID to get username
    // set req.session.userId
    // set req.session.user.username
    next();
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

