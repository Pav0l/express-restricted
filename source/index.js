const jwt = require('jsonwebtoken');

module.exports = function restricted(config, allow) {
  // make sure `allow` is an array
  const allowArr = Array.isArray(allow) ? allow : [allow];

  /**
   * reqProp = REQUIRED
   * childProp = OPTIONAL
   * identifier = REQUIRED
   * jwtKey = REQUIRED
   *  */
  const { reqProp, childProp, identifier, jwtKey } = config;

  return function(req, res, next) {
    // where to find the identifier
    const token = childProp ? req[reqProp][childProp] : req[reqProp];

    if (typeof token === 'string') {
      jwt.verify(token, jwtKey, (err, decoded) => {
        if (err) {
          res.status(401).json({ err: err.message });
        } else {
          req.decoded = decoded;
          if (allowArr.length === 0) {
            next();
          } else {
            const isValid = allowArr.includes(decoded[identifier]);

            if (isValid) {
              next();
            } else {
              res.status(401).json({ err: 'Access to this route denied' });
            }
          }
        }
      });
    } else {
      res.status(422).json({
        err: `You must specify property of req.${reqProp} which contains the JWT string.`
      });
    }
  };
};
