# w-i-p

# express-restricted

express-restricted is a node.js package for [Express.js](https://expressjs.com/) middleware to restrict access to API endpoints.

## Installation

Installation is done through [npm](https://www.npmjs.com/):

```
$ npm i express-restricted
```

## Usage

tbd

Rules example:

```
rules = [
 {
   path: '/api/users',
   access: ['admin', 'maintainer']
 },
 {
   path: '/api/data',
   access: ['admin', 'maintainer', 'user']
 }
];
```
