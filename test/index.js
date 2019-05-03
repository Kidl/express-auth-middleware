const env = require('dotenv');

env.config();

process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./assets/express/app');
const appKoa = require('./assets/koa/app').callback();
const appFastify = require('./assets/fastify/app');

const checkAccess = require('../lib/checkAccess');
const cryptographer = require('../lib/cryptographer');

chai.use(chaiHttp);
const should = chai.should();

const testUser = {
  _id: 1,
  username: 'testuser',
  scope: {
    default: {
      default: ['.*'],
    },
  },
};

const testUser2 = {
  _id: 2,
  username: 'testuser2',
  scope: {
    default: {
      get: ['/auth.*'],
    },
  },
};

const testUser3 = {
  _id: 3,
  username: 'testuser3',
  scope: {
    default: {
      get: ['.*'],
    },
  },
};

const testUser4 = {
  _id: 4,
  username: 'testuser4',
  scope: {
    auth: {
      get: ['/users.*'],
    },
  },
};

const testUser5 = {
  _id: 5,
  username: 'testuser5',
  scope: {
    auth: {
      post: ['/users.*'],
    },
  },
};

const testUser6 = {
  _id: 6,
  username: 'testuser6',
  scope: {
    auth: {
      put: ['/users/:username'],
    },
  },
};

const testUser7 = {
  _id: 7,
  username: 'testuser7',
  scope: {
    auth: {
      put: ['/users/:username'],
      default: ['/cards.*'],
    },
    default: {
      get: ['.*'],
    },
  },
};

let testUserToken;
let testUser2Token;
let testUser3Token;
let testUser4Token;
let testUser5Token;
let testUser6Token;
let testUser7Token;

if (process.env.CRYPTO_SECRET) {
  testUserToken = jwt.sign({ body: cryptographer.encrypt(JSON.stringify(testUser)) }, process.env.JWT_SECRET);
  testUser2Token = jwt.sign({ body: cryptographer.encrypt(JSON.stringify(testUser2)) }, process.env.JWT_SECRET);
  testUser3Token = jwt.sign({ body: cryptographer.encrypt(JSON.stringify(testUser3)) }, process.env.JWT_SECRET);
  testUser4Token = jwt.sign({ body: cryptographer.encrypt(JSON.stringify(testUser4)) }, process.env.JWT_SECRET);
  testUser5Token = jwt.sign({ body: cryptographer.encrypt(JSON.stringify(testUser5)) }, process.env.JWT_SECRET);
  testUser6Token = jwt.sign({ body: cryptographer.encrypt(JSON.stringify(testUser6)) }, process.env.JWT_SECRET);
  testUser7Token = jwt.sign({ body: cryptographer.encrypt(JSON.stringify(testUser7)) }, process.env.JWT_SECRET);
} else {
  testUserToken = jwt.sign(testUser, process.env.JWT_SECRET);
  testUser2Token = jwt.sign(testUser2, process.env.JWT_SECRET);
  testUser3Token = jwt.sign(testUser3, process.env.JWT_SECRET);
  testUser4Token = jwt.sign(testUser4, process.env.JWT_SECRET);
  testUser5Token = jwt.sign(testUser5, process.env.JWT_SECRET);
  testUser6Token = jwt.sign(testUser6, process.env.JWT_SECRET);
  testUser7Token = jwt.sign(testUser7, process.env.JWT_SECRET);
}

describe('lib', () => {
  describe('checkAccess', () => {
    it('should return user object (testUser:__.*, auth get /users/testuser)', async () => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'get';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.deep.eq(testUser.scope);
    });

    it('should return user object (testUser:__.*, auth post /users/testuser)', async () => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'post';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.deep.eq(testUser.scope);
    });

    it('should return user object (testUser:__.*, auth put /users/testuser)', async () => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'put';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.deep.eq(testUser.scope);
    });

    it('should return user object (testUser:__.*, auth delete /users/testuser)', async () => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'delete';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.deep.eq(testUser.scope);
    });

    it('should return user object (testUser:__.*, cards delete /users/testuser)', async () => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';
      options.method = 'delete';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.deep.eq(testUser.scope);
    });

    it('should return user object (testUser:__.*, cards post /cards)', async () => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';
      options.method = 'post';
      options.path = 'cards';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.deep.eq(testUser.scope);
    });

    it('should return user object (testUser:__.*, cards get /cards/123)', async () => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';
      options.method = 'get';
      options.path = 'cards';
      options.params = { cards: '123' };

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.deep.eq(testUser.scope);
    });

    it('should return user object (testUser2:_get_auth, auth get /auth/testuser2)', async () => {
      const options = {};

      options.token = testUser2Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'get';
      options.path = '/auth/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(2);
      user.username.should.be.eq('testuser2');
      user.scope.should.be.deep.eq(testUser2.scope);
    });

    it('should return user object (testUser2:_get_auth, cards get /auth/testuser2)', async () => {
      const options = {};

      options.token = testUser2Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';
      options.method = 'get';
      options.path = '/auth/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(2);
      user.username.should.be.eq('testuser2');
      user.scope.should.be.deep.eq(testUser2.scope);
    });

    it('should return user object (testUser2:_get_auth, cards get /auth)', async () => {
      const options = {};

      options.token = testUser2Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';
      options.method = 'get';
      options.path = '/auth';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(2);
      user.username.should.be.eq('testuser2');
      user.scope.should.be.deep.eq(testUser2.scope);
    });

    it('should return user object (testUser3:_get_.*, auth get /users/testuser3)', async () => {
      const options = {};

      options.token = testUser3Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'get';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(3);
      user.username.should.be.eq('testuser3');
      user.scope.should.be.deep.eq(testUser3.scope);
    });

    it('should return user object (testUser3:_get_.*, auth get /users/testuser6)', async () => {
      const options = {};

      options.token = testUser3Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'get';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(3);
      user.username.should.be.eq('testuser3');
      user.scope.should.be.deep.eq(testUser3.scope);
    });

    it('should return user object (testUser3:_get_.*, auth get /lalala/123/testuser6)', async () => {
      const options = {};

      options.token = testUser3Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'get';
      options.path = '/lalala/123/testuser6';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(3);
      user.username.should.be.eq('testuser3');
      user.scope.should.be.deep.eq(testUser3.scope);
    });

    it('should return user object (testUser3:_get_.*, cards get /lalala/1234/testuser65)', async () => {
      const options = {};

      options.token = testUser3Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';
      options.method = 'get';
      options.path = '/lalala/1234/testuser65';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(3);
      user.username.should.be.eq('testuser3');
      user.scope.should.be.deep.eq(testUser3.scope);
    });

    it('should return user object (testUser4:auth_get_users, auth get /users/testuser4)', async () => {
      const options = {};

      options.token = testUser4Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'get';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(4);
      user.username.should.be.eq('testuser4');
      user.scope.should.be.deep.eq(testUser4.scope);
    });

    it('should return user object (testUser5:auth_post_users, auth post /users/testuser5)', async () => {
      const options = {};

      options.token = testUser5Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'post';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(5);
      user.username.should.be.eq('testuser5');
      user.scope.should.be.deep.eq(testUser5.scope);
    });

    it('should return user object (testUser6:auth_put_users:username, auth put /users/testuser6)', async () => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'put';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(6);
      user.username.should.be.eq('testuser6');
      user.scope.should.be.deep.eq(testUser6.scope);
    });

    it('should return user object (testUser6:auth_put_users:username, auth put /users)', async () => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'put';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(6);
      user.username.should.be.eq('testuser6');
      user.scope.should.be.deep.eq(testUser6.scope);
    });

    it('should return user object (testUser7:auth_put_users:username|auth__cards.*|_get_.*, auth put /users)', async () => {
      const options = {};

      options.token = testUser7Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'put';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(7);
      user.username.should.be.eq('testuser7');
      user.scope.should.be.deep.eq(testUser7.scope);
    });

    it('should return user object (testUser7:auth_put_users:username|auth__cards.*|_get_.*, auth get /users/testuser7)', async () => {
      const options = {};

      options.token = testUser7Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'default';
      options.method = 'get';
      options.path = '/users/:username';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(7);
      user.username.should.be.eq('testuser7');
      user.scope.should.be.deep.eq(testUser7.scope);
    });

    it('should return user object (testUser7:auth_put_users:username|auth__cards.*|_get_.*, auth get /cards/123)', async () => {
      const options = {};

      options.token = testUser7Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'get';
      options.path = '/cards/:cardId';

      const user = await checkAccess(options);

      should.exist(user);

      user.should.have.property('_id');
      user.should.have.property('username');
      user.should.have.property('scope');

      user._id.should.be.eq(7);
      user.username.should.be.eq('testuser7');
      user.scope.should.be.deep.eq(testUser7.scope);
    });

    it('should throw error (testUser6:auth_put_users:username, auth post /users/testuser6)', async () => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'post';
      options.path = '/users/:username';

      let error;

      try {
        await checkAccess(options);
      } catch (err) {
        error = err;
      }


      should.exist(error);

      error.should.be.an('error');
      error.message.should.be.eq('You cannot perform post to /users/:username');
    });

    it('should throw error (testUser6:auth_put_users:username, auth get /users/testuser6)', async () => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'get';
      options.path = '/users/:username';

      let error;

      try {
        await checkAccess(options);
      } catch (err) {
        error = err;
      }


      should.exist(error);

      error.should.be.an('error');
      error.message.should.be.eq('You cannot perform get to /users/:username');
    });

    it('should throw error (testUser6:auth_put_users:username, auth put /cards/123)', async () => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'put';
      options.path = '/cards/:cardId';

      let error;

      try {
        await checkAccess(options);
      } catch (err) {
        error = err;
      }


      should.exist(error);

      error.should.be.an('error');
      error.message.should.be.eq('You cannot perform put to /cards/:cardId');
    });

    it('should throw error (testUser6:auth_put_users:username, cards put /users/testuser6)', async () => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';
      options.method = 'put';
      options.path = '/users/:username';

      let error;

      try {
        await checkAccess(options);
      } catch (err) {
        error = err;
      }


      should.exist(error);

      error.should.be.an('error');
      error.message.should.be.eq('You cannot perform put to /users/:username');
    });

    it('should throw error (testUser7:auth_put_users:username|auth__cards.*|_get_.*, auth get /apples/123)', async () => {
      const options = {};

      options.token = testUser7Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'get';
      options.path = '/apples/:id';

      let error;

      try {
        await checkAccess(options);
      } catch (err) {
        error = err;
      }


      should.exist(error);

      error.should.be.an('error');
      error.message.should.be.eq('You cannot perform get to /apples/:id');
    });

    it('should throw error (testUser7:auth_put_users:username|auth__cards.*|_get_.*, auth get /users/testuser7)', async () => {
      const options = {};

      options.token = testUser7Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';
      options.method = 'get';
      options.path = '/users/:username';

      let error;

      try {
        await checkAccess(options);
      } catch (err) {
        error = err;
      }


      should.exist(error);

      error.should.be.an('error');
      error.message.should.be.eq('You cannot perform get to /users/:username');
    });
  });
});

describe('middleware', () => {
  describe('checkAccess', () => {
    it('should return user', (done) => {
      chai.request(app)
        .get('/users/testuser')
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('string');
          res.body.should.be.eq('testuser');

          done();
        });
    });

    it('should return error 401 Unauthorized (no token)', (done) => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');

          done();
        });
    });

    it('should return error 403 Forbidden (low scope)', (done) => {
      chai.request(app)
        .get('/users')
        .set('x-access-token', testUser2Token)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');

          done();
        });
    });

    it('should return error 403 Forbidden (invalid token)', (done) => {
      chai.request(app)
        .get('/users')
        .set('x-access-token', 123)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');

          done();
        });
    });

    it('should return user', (done) => {
      chai.request(app)
        .get('/users')
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.username.should.be.eq('testuser');

          done();
        });
    });
  });


  describe('checkAccess (koa)', () => {
    it('should return user', (done) => {
      chai.request(appKoa)
        .get('/users/testuser2')
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          res.should.have.status(200);

          res.text.should.be.a('string');
          res.text.should.be.eq('testuser');

          done();
        });
    });

    it('should return error 401 Unauthorized (no token)', (done) => {
      chai.request(appKoa)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');

          done();
        });
    });

    it('should return error 403 Forbidden (low scope)', (done) => {
      chai.request(appKoa)
        .get('/users')
        .set('x-access-token', testUser2Token)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');

          done();
        });
    });

    it('should return error 403 Forbidden (invalid token)', (done) => {
      chai.request(appKoa)
        .get('/users')
        .set('x-access-token', 123)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');

          done();
        });
    });

    it('should return user', (done) => {
      chai.request(appKoa)
        .get('/users')
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.username.should.be.eq('testuser');

          done();
        });
    });
  });

  describe('checkAccess (fastify)', () => {
    it('should return user', (done) => {
      chai.request(appFastify)
        .get('/users/testuser')
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a('string');
          res.text.should.be.eq('testuser');

          done();
        });
    });

    it('should return error 401 Unauthorized (no token)', (done) => {
      chai.request(appFastify)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');

          done();
        });
    });

    it('should return error 403 Forbidden (low scope)', (done) => {
      chai.request(appFastify)
        .get('/users')
        .set('x-access-token', testUser2Token)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');

          done();
        });
    });

    it('should return error 403 Forbidden (invalid token)', (done) => {
      chai.request(appFastify)
        .get('/users')
        .set('x-access-token', 123)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');

          done();
        });
    });

    it('should return user', (done) => {
      chai.request(appFastify)
        .get('/users')
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.username.should.be.eq('testuser');

          done();
        });
    });
  });
});
