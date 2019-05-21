# express-restricted

[![npm](https://img.shields.io/npm/v/express-restricted.svg)](https://www.npmjs.com/package/express-restricted)
[![npm](https://img.shields.io/npm/dw/express-restricted.svg)](https://www.npmjs.com/package/express-restricted)
[![NPM](https://img.shields.io/npm/l/express-restricted.svg)](https://opensource.org/licenses/MIT)

express-restricted is a simple [Node.js](https://nodejs.org/en/) package for [Express.js](https://expressjs.com/) middleware to restrict access to API endpoints with the use of [JSON Web Tokens](https://tools.ietf.org/html/rfc7519).

## Installation

Installation is done through [npm](https://www.npmjs.com/):

```
$ npm i express-restricted
```

or if you use [yarn](https://yarnpkg.com/en/):

```
$ yarn add express-restricted
```

## Options

- `config` - Configuration object contains properties used to target where in the `req` object should the middleware look for data.

  - `reqProp` - REQUIRED, `String` - first child of `req` object (`body`, `headers`, ...)
  - `childProp` - OPTIONAL, `String` - child of `reqProp` (`Authorization`, ...)
  - `identifier` - REQUIRED, `String` - A property of JWT payload used to identify access rights to the endpoint.
  - `jwtKey` - REQUIRED, `String` - containing the secret for HMAC algorithms. Used to generate the JSON Web Token.

  Example:

  ```js
  const config = {
    reqProp: 'headers',
    childProp: 'authorization',
    identifier: 'user_type',
    jwtKey: 'ThereIsNoSecret'
  };
  ```

- `allow` - REQUIRED, `String` or `Array` of `Strings` or an empty `Array` - Used to list `identifier` values, which are allowed to access the endpoint. **An empty array will make the endpoint accessible to any identifier value.**

  Example:

  ```js
  const allow = ['admin', 'maintainer'];
  ```

## Usage

### Restrict access to an endpoint

```js
const express = require('express');
const restricted = require('express-restricted');

const router = express.Router();

const config = {
  reqProp: 'headers',
  childProp: 'authorization',
  identifier: 'user_type',
  jwtKey: 'ThereIsNoSecret'
};

const allow = {
  all: [], // any identifier value has access
  staff: ['receptionist'],
  admins: ['super admin', 'admin']
};

router.get('/', restricted(config, allow.public), (req, res) => {
  res.json({ msg: 'Router GET /' });
});

router.get(
  '/:id/cool/:cool_id',
  restricted(config, allow.admins),
  (req, res) => {
    res.json({ msg: 'Router GET /:id/cool/:cool_id' });
  }
);

router.post('/', restricted(config, allow.staff), (req, res) => {
  res.json({ msg: 'Router POST /:id' });
});

server.listen(9000);
```

### Restrict access to all endpoints in a route

```js
const express = require('express');
const restricted = require('express-restricted');

const router = express.Router();

const config = {
  reqProp: 'headers',
  childProp: 'authorization',
  identifier: 'user_type',
  jwtKey: 'ThereIsNoSecret'
};

const admins: ['super admin', 'admin'];

// Restricts all router endpoints to admins only
router.use(restricted(config, admins));

router.get('/', (req, res) => {
  res.json({ msg: 'Router GET /' });
});

router.get(
  '/:id/cool/:cool_id',
  (req, res) => {
    res.json({ msg: 'Router GET /:id/cool/:cool_id' });
  }
);

router.post('/', (req, res) => {
  res.json({ msg: 'Router POST /:id' });
});

server.listen(9000);
```

## License

[MIT](https://opensource.org/licenses/MIT)

## Author

[Pavol](https://github.com/Pav0l)
