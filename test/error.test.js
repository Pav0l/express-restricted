const assert = require('chai').assert;
const jwt = require('jsonwebtoken');
const request = require('supertest');
const { config, server } = require('./testsSetup');

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
      .get('/undefinedReqProp')
      .end(function(err, res) {
        assert.strictEqual(res.status, 422, 'Status codes are equal');
      });
    done();
  });

  it('Should respond with proper msg if path to JWT string is not specified in reqProp and childProp', function(done) {
    // request without sending reqProp
    request(server)
      .get('/undefinedReqProp')
      .end(function(err, res) {
        assert.property(res.body, 'err', 'Response body contains error prop');
        assert.include(
          res.body.err,
          'contains the JWT string',
          'Sent proper message'
        );
      });
    done();
  });

  it('Denies access if JWT is not in childProp', function(done) {
    const token = jwt.sign({ [config.identifier]: 'let me in' }, config.jwtKey);
    // childProp of the endpoint is 'token' (req.body.token)
    request(server)
      .get('/bodyPayload')
      .send({ jwt: token })
      .end(function(err, res) {
        assert.strictEqual(res.status, 422, 'Status codes are equal');
        assert.property(res.body, 'err', 'Response body contains message prop');
        assert.match(
          res.body.err,
          /You must specify property of req.body which contains the JWT string./,
          'Sent proper message'
        );
      });
    done();
  });

  it('Denies access to invalid identifier value', function(done) {
    const token = jwt.sign({ [config.identifier]: 'notAdmin' }, config.jwtKey);
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
