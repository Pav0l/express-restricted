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
    const idRequestingResources = childProp
      ? req[reqProp][childProp]
      : req[reqProp];

    if (idRequestingResources) {
      jwt.verify(idRequestingResources, jwtKey, (err, decoded) => {
        if (err) {
          res.status(401).json({ err: err.message });
          throw new Error(err);
        } else {
          req.decodedPayload = decoded;
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
        err: `req.${childProp ? 'reqProp.childProp' : 'reqProp'} is undefined`
      });
    }
  };
};
