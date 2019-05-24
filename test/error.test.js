const assert = require('chai').assert;
const jwt = require('jsonwebtoken');
const request = require('supertest');
const { config, server } = require('./testsSetup');

describe('Middleware errors', function() {
  describe('Error responses', function() {
    it('Throws an error on invalid JWT', function(done) {
      const badJWT = 'haha';
      const token = jwt.sign({}, badJWT);

      request(server)
        .get('/')
        .set('Authorization', token)
        .end(function(err, res) {
          assert.strictEqual(res.status, 401, 'Status codes are equal');
          assert.property(res.body, 'err', 'Response body contains error prop');
          assert.strictEqual(
            res.body.err,
            'invalid signature',
            'Error msg is correct'
          );
        });
      done();
    });

    it('Sends a 422 on undefined reqProp', function(done) {
      // Authorization header is not set on this request
      request(server)
        .get('/')
        .end(function(err, res) {
          assert.strictEqual(res.status, 422, 'Status codes are equal');
          assert.property(res.body, 'err', 'Response body contains error prop');
          assert.strictEqual(
            res.body.err,
            'req.reqProp.childProp is undefined',
            'Error msg is correct'
          );
        });
      done();
    });

    it('Denies access to invalid identifier value', function(done) {
      const token = jwt.sign(
        { [config.identifier]: 'notAdmin' },
        config.jwtKey
      );
      // endpoint accessible only to 'admin'
      request(server)
        .get('/admin')
        .set('Authorization', token)
        .end(function(err, res) {
          assert.strictEqual(res.status, 401, 'Status codes are equal');
          assert.property(res.body, 'err', 'Response body contains error prop');
          assert.match(
            res.body.err,
            /Access to this route denied/,
            'Sent proper message'
          );
        });
      done();
    });
  });
});
