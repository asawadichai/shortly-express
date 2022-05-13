const parseCookies = (req, res, next) => {
  var obj = {};
  var cookies = req.headers.cookie;

  if (cookies) {
    var cookieArr = cookies.split('; ');
    cookieArr.forEach((cookie) => {
      var newArr = cookie.split('=');
      obj[newArr[0]] = newArr[1];
    });
  }

  req.cookies = obj;
  next();
  //res.sendStatus(200).json(obj);
};

module.exports = parseCookies;
//req.cookies = <final cookie>; this is how to update the cookie