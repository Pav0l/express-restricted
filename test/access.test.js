const assert = require('chai').assert;
const jwt = require('jsonwebtoken');
const request = require('supertest');
const { config, server } = require('./testsSetup');

describe('Access rights', function() {
  it('Allows proper identifier value to the endpoint', function(done) {
    const token = jwt.sign({ [config.identifier]: 'user' }, config.jwtKey);
    // endpoint accessible only to 'admin' and 'user
    request(server)
      .get('/users')
      .set('Authorization', token)
      .end(function(err, res) {
        assert.strictEqual(res.status, 200, 'Status codes are equal');
        assert.property(
          res.body,
          'message',
          'Response body contains message prop'
        );
        assert.match(
          res.body.message,
          /Endpoint available to admin and user/,
          'Sent proper message'
        );
      });
    done();
  });

  it('Allows any identifier value with proper JWT', function(done) {
    const token = jwt.sign(
      { [config.identifier]: 'whateverCanBeHere' },
      config.jwtKey
    );
    // endpoint accessible to anyone with proper JWT key
    request(server)
      .get('/')
      .set('Authorization', token)
      .end(function(err, res) {
        assert.strictEqual(res.status, 200, 'Status codes are equal');
        assert.property(
          res.body,
          'message',
          'Response body contains message prop'
        );
        assert.match(
          res.body.message,
          /Endpoint available to logged in users/,
          'Sent proper message'
        );
      });
    done();
  });

  it('Allows empty identifier value with proper JWT', function(done) {
    const token = jwt.sign(
      // no payload, but proper JWT secret key
      {},
      config.jwtKey
    );
    // endpoint accessible to anyone with proper JWT key
    request(server)
      .get('/')
      .set('Authorization', token)
      .end(function(err, res) {
        assert.strictEqual(res.status, 200, 'Status codes are equal');
        assert.property(
          res.body,
          'message',
          'Response body contains message prop'
        );
        assert.match(
          res.body.message,
          /Endpoint available to logged in users/,
          'Sent proper message'
        );
      });
    done();
  });
});
