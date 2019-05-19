# express-restricted

express-restricted is a simple [Node.js](https://nodejs.org/en/) package for [Express.js](https://expressjs.com/) middleware to restrict access to API endpoints.

## Installation

Installation is done through [npm](https://www.npmjs.com/):

```
$ npm i express-restricted
```

## Options

- `rules` - REQUIRED - Sets a list of paths and access restriction rules. Contains a `path` and an `access` property. Possible values: `Object` with a single path and access property for a single endpoint restriction, or an `Array` of rule objects to restrict multiple endpoints.

  - `path` - Used to identify a `path` where to restrict access.

    Possible value: `String`

* `access` - Used to list `identifier` values, which are allowed access to the `path`.
  Possible value: `Array` of `Strings` or an empty `Array`. **Empty array will make the endpoint publicly accessible.**

Default settings:

```
const defaultRules = [{ path: '/', access: [] }];
```

Example:

```
const rules = {
  { path: '/', access: [] },  // allows access to anyone
  { path: '/secret', access: ['admin'] },  // allow access to path only to 'admin'
  { path: '/settings', access: ['admin', 'maintainer'] }
};
```

- `identifier` - REQUIRED - A property of the `req.body` object used to identify access rights to the endpoint.

  Possible value - `String` - set `identifier` to a specific value inside the `req.body` object (`req.body.user_type`)

  For example:

  ```
  const identifier = 'user_type';
  ```

## Usage

### Restrict access to multiple endpoints

```
const express = require('express');
const restricted = require('express-restricted');

const server = express();
server.use(express.json());

const rules = [
  { path: '/', access: [] },
  { path: '/secret', access: ['admin'] },
  { path: '/settings', access: ['admin', 'maintainer'] }
];
const identifier = 'user_type';

server.use(restricted(rules, identifier));

server.get('/', (req, res) => {
  res.json({ message: 'Endpoint available to everyone' });
});

server.get('/secret', (req, res) => {
  res.json({ message: 'Secret API available to admin only' });
});

server.get('/settings', (req, res) => {
  res.json({ message: 'Settings available to admin and maintainer' });
});

server.listen(9000, () => console.log('=== Server listening on 9000 === '));

```

### Restrict access to one endpoint

```
const express = require('express');
const restricted = require('express-restricted');

const server = express();
server.use(express.json());

const rules = [
  { path: '/users', access: ['5z2sda7zx2czx5'] },
];
const identifier = 'id';

server.get('/users', restricted(rules, identifier), (req, res) => {
  res.json({ message: 'Users endpoint accessible to ID 5z2sda7zx2czx5' });
});

server.listen(9000, () => console.log('=== Server listening on 9000 === '));

```

### Allow anyone access to an endpoint

```
const express = require('express');
const restricted = require('express-restricted');

const server = express();
server.use(express.json());

const rules = [
  { path: '/users', access: [] },
];
const identifier = 'id';

server.get('/users', restricted(rules, identifier), (req, res) => {
  res.json({ message: 'Anyone has access to this endpoint' });
});

server.listen(9000, () => console.log('=== Server listening on 9000 === '));

```

## License

[MIT](https://opensource.org/licenses/MIT)

## Author

[Pavol](https://github.com/Pav0l)
