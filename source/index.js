function isString(word) {
  return typeof word === 'string' ? word : word instanceof String;
}

const defaultRules = [{ path: '/', access: [] }];

module.exports = function restricted(rules = defaultRules, identifier) {
  const rulesArr = Array.isArray(rules) ? rules : [rules];
  const idString = isString(identifier);

  if (!idString) {
    throw new Error('The identifier must be a string');
  }

  return function(req, res, next) {
    const targetPath = req.path;
    const idRequestingResources = req.body[identifier];

    if (idRequestingResources) {
      const pathCheck = rulesArr.find(rule => rule.path === targetPath);

      if (!pathCheck) {
        res.status(404).json({ error: 'This path does not exist' });
      } else if (pathCheck.access.length === 0) {
        // empty access array allows public access to the path
        next();
      } else {
        const isValid = pathCheck.access.includes(idRequestingResources);

        if (isValid) {
          next();
        } else {
          res
            .status(401)
            .json({ error: 'Unauthorized access to the resource' });
        }
      }
    } else {
      res.status(422).json({ error: 'The request did not contain identifier' });
    }
  };
};
