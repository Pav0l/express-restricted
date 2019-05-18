module.exports = function restricted(rules, identifier, req, res, next) {
  // data checks
  const rulesArr = Array.isArray(rules) ? rules : [rules];
  const idString =
    typeof identifier === 'string' ? identifier : identifier instanceof String;

  const targetPath = req.path;
  const idRequestingResources = req.body[idString];

  if (idRequestingResources) {
    res.status(422).json({ error: 'The request did not contain identifier' });
  }

  const pathCheck = rulesArr.find(rule => rule.path === targetPath);

  if (!pathCheck) {
    res.status(404).json({ error: 'This path does not exist' });
  } else {
    const isValid = pathCheck.access.includes(idRequestingResources);

    if (isValid) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized access to this resource' });
    }
  }
};

/**
 *
 * rules = [
 *  {
 *    path: '/api/users',
 *    access: ['admin', 'maintainer']
 *  },
 *  {
 *    path: '/api/data',
 *    access: ['admin', 'maintainer', 'user']
 *  }
 * ]
 */
