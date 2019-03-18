const env = require('dotenv');
env.config();

process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./assets/app');

const parseScope = require('../lib/parseScope');
const checkAccess = require('../lib/checkAccess');
const checkAccessMiddleware = require('../middleware/checkAccess');

chai.use(chaiHttp);
const should = chai.should();

const testUser = {
  _id: 1,
  username: 'testuser',
  scope: '__all'
};

const testUser2 = {
  _id: 2,
  username: 'testuser2',
  scope: '_get_auth'
};

const testUser3 = {
  _id: 3,
  username: 'testuser3',
  scope: '_get_all'
};

const testUser4 = {
  _id: 4,
  username: 'testuser4',
  scope: 'auth_get_users'
};

const testUser5 = {
  _id: 5,
  username: 'testuser5',
  scope: 'auth_post_users'
};

const testUser6 = {
  _id: 6,
  username: 'testuser6',
  scope: 'auth_put_users:username'
};

const testUserToken = jwt.sign(testUser, process.env.JWT_SECRET);
const testUser2Token = jwt.sign(testUser2, process.env.JWT_SECRET);
const testUser3Token = jwt.sign(testUser3, process.env.JWT_SECRET);
const testUser4Token = jwt.sign(testUser4, process.env.JWT_SECRET);
const testUser5Token = jwt.sign(testUser5, process.env.JWT_SECRET);
const testUser6Token = jwt.sign(testUser6, process.env.JWT_SECRET);

describe('lib', () => {
  describe('parseScope', () => {
    it('__all', (done) => {
      const scope = parseScope('__all');

      scope.should.be.a('object');

      scope.should.have.property('service');
      scope.should.have.property('method');
      scope.should.have.property('route');
      scope.should.have.property('paramname');

      scope.service.should.be.eq('');
      scope.method.should.be.eq('');
      scope.route.should.be.eq('all');
      should.not.exist(scope.paramname);

      done();
    });

    it('_get_auth', (done) => {
      const scope = parseScope('_get_auth');

      scope.should.be.a('object');

      scope.should.have.property('service');
      scope.should.have.property('method');
      scope.should.have.property('route');
      scope.should.have.property('paramname');

      scope.service.should.be.eq('');
      scope.method.should.be.eq('get');
      scope.route.should.be.eq('auth');
      should.not.exist(scope.paramname);

      done();
    });

    it('_get_', (done) => {
      const scope = parseScope('_get_');

      scope.should.be.a('object');

      scope.should.have.property('service');
      scope.should.have.property('method');
      scope.should.have.property('route');
      scope.should.have.property('paramname');

      scope.service.should.be.eq('');
      scope.method.should.be.eq('get');
      scope.route.should.be.eq('');
      should.not.exist(scope.paramname);

      done();
    });

    it('auth_get_', (done) => {
      const scope = parseScope('auth_get_');

      scope.should.be.a('object');

      scope.should.have.property('service');
      scope.should.have.property('method');
      scope.should.have.property('route');
      scope.should.have.property('paramname');

      scope.service.should.be.eq('auth');
      scope.method.should.be.eq('get');
      scope.route.should.be.eq('');
      should.not.exist(scope.paramname);

      done();
    });

    it('auth_post_users', (done) => {
      const scope = parseScope('auth_post_users');

      scope.should.be.a('object');

      scope.should.have.property('service');
      scope.should.have.property('method');
      scope.should.have.property('route');
      scope.should.have.property('paramname');

      scope.service.should.be.eq('auth');
      scope.method.should.be.eq('post');
      scope.route.should.be.eq('users');
      should.not.exist(scope.paramname);

      done();
    });

    it('auth_put_users:username', (done) => {
      const scope = parseScope('auth_put_users:username');

      scope.should.be.a('object');

      scope.should.have.property('service');
      scope.should.have.property('method');
      scope.should.have.property('route');
      scope.should.have.property('paramname');

      scope.service.should.be.eq('auth');
      scope.method.should.be.eq('put');
      scope.route.should.be.eq('users');
      scope.paramname.should.be.eq('username');

      done();
    });
  });


  describe('checkAccess', () => {
    it('should return user object (testUser:__all, auth get /users/testuser)', (done) => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'get';
      options.route = 'users';
      options.params = { username: 'testuser' };

      const user = checkAccess(options);

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.eq('__all');

      done();
    });

    it('should return user object (testUser:__all, auth post /users/testuser)', (done) => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'post';
      options.route = 'users';
      options.params = { username: 'testuser' };

      const user = checkAccess(options);

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.eq('__all');

      done();
    });

    it('should return user object (testUser:__all, auth put /users/testuser)', (done) => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'put';
      options.route = 'users';
      options.params = { username: 'testuser' };

      const user = checkAccess(options);

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.eq('__all');

      done();
    });

    it('should return user object (testUser:__all, auth delete /users/testuser)', (done) => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'delete';
      options.route = 'users';
      options.params = { username: 'testuser' };

      const user = checkAccess(options);

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.eq('__all');

      done();
    });

    it('should return user object (testUser:__all, cards delete /users/testuser)', (done) => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';

      options.method = 'delete';
      options.route = 'users';
      options.params = { username: 'testuser' };

      const user = checkAccess(options);

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.eq('__all');

      done();
    });

    it('should return user object (testUser:__all, cards post /cards)', (done) => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';

      options.method = 'post';
      options.route = 'cards';

      const user = checkAccess(options);

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.eq('__all');

      done();
    });

    it('should return user object (testUser:__all, cards get /cards/123)', (done) => {
      const options = {};

      options.token = testUserToken;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';

      options.method = 'get';
      options.route = 'cards';
      options.params = { cards: '123' };

      const user = checkAccess(options);

      user._id.should.be.eq(1);
      user.username.should.be.eq('testuser');
      user.scope.should.be.eq('__all');

      done();
    });

    it('should return user object (testUser2:_get_auth, auth get /auth/testuser2)', (done) => {
      const options = {};

      options.token = testUser2Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'get';
      options.route = 'auth';
      options.params = { username: 'testuser2' };

      const user = checkAccess(options);

      user._id.should.be.eq(2);
      user.username.should.be.eq('testuser2');
      user.scope.should.be.eq('_get_auth');

      done();
    });

    it('should return user object (testUser2:_get_auth, cards get /auth/testuser2)', (done) => {
      const options = {};

      options.token = testUser2Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';

      options.method = 'get';
      options.route = 'auth';
      options.params = { username: 'testuser2' };

      const user = checkAccess(options);

      user._id.should.be.eq(2);
      user.username.should.be.eq('testuser2');
      user.scope.should.be.eq('_get_auth');

      done();
    });

    it('should return user object (testUser2:_get_auth, cards get /auth)', (done) => {
      const options = {};

      options.token = testUser2Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';

      options.method = 'get';
      options.route = 'auth';

      const user = checkAccess(options);

      user._id.should.be.eq(2);
      user.username.should.be.eq('testuser2');
      user.scope.should.be.eq('_get_auth');

      done();
    });

    it('should return user object (testUser3:_get_all, auth get /users/testuser3)', (done) => {
      const options = {};

      options.token = testUser3Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'get';
      options.route = 'users';
      options.params = { username: 'testuser3' };

      const user = checkAccess(options);

      user._id.should.be.eq(3);
      user.username.should.be.eq('testuser3');
      user.scope.should.be.eq('_get_all');

      done();
    });

    it('should return user object (testUser3:_get_all, auth get /users/testuser6)', (done) => {
      const options = {};

      options.token = testUser3Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'get';
      options.route = 'users';
      options.params = { username: 'testuser6' };

      const user = checkAccess(options);

      user._id.should.be.eq(3);
      user.username.should.be.eq('testuser3');
      user.scope.should.be.eq('_get_all');

      done();
    });

    it('should return user object (testUser3:_get_all, auth get /lalala/123/testuser6)', (done) => {
      const options = {};

      options.token = testUser3Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'get';
      options.route = 'lalala123';
      options.params = { username: 'testuser6' };

      const user = checkAccess(options);

      user._id.should.be.eq(3);
      user.username.should.be.eq('testuser3');
      user.scope.should.be.eq('_get_all');

      done();
    });

    it('should return user object (testUser3:_get_all, cards get /lalala/1234/testuser65)', (done) => {
      const options = {};

      options.token = testUser3Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';

      options.method = 'get';
      options.route = 'lalala1234';
      options.params = { username: 'testuser65' };

      const user = checkAccess(options);

      user._id.should.be.eq(3);
      user.username.should.be.eq('testuser3');
      user.scope.should.be.eq('_get_all');

      done();
    });

    it('should return user object (testUser4:auth_get_users, auth get /users/testuser4)', (done) => {
      const options = {};

      options.token = testUser4Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'get';
      options.route = 'users';
      options.params = { username: 'testuser4' };

      const user = checkAccess(options);

      user._id.should.be.eq(4);
      user.username.should.be.eq('testuser4');
      user.scope.should.be.eq('auth_get_users');

      done();
    });

    it('should return user object (testUser5:auth_post_users, auth post /users/testuser5)', (done) => {
      const options = {};

      options.token = testUser5Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'post';
      options.route = 'users';
      options.params = { username: 'testuser5' };

      const user = checkAccess(options);

      user._id.should.be.eq(5);
      user.username.should.be.eq('testuser5');
      user.scope.should.be.eq('auth_post_users');

      done();
    });

    it('should return user object (testUser6:auth_put_users:username, auth put /users/testuser6)', (done) => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'put';
      options.route = 'users';
      options.params = { username: 'testuser6' };

      const user = checkAccess(options);

      user._id.should.be.eq(6);
      user.username.should.be.eq('testuser6');
      user.scope.should.be.eq('auth_put_users:username');

      done();
    });

    it('should return user object (testUser6:auth_put_users:username, auth put /users)', (done) => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'put';
      options.route = 'users';
      options.params = { username: 'testuser6' };

      const user = checkAccess(options);

      user._id.should.be.eq(6);
      user.username.should.be.eq('testuser6');
      user.scope.should.be.eq('auth_put_users:username');

      done();
    });

    it('should return false (testUser6:auth_put_users:username, auth post /users/testuser6)', (done) => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'post';
      options.route = 'users';
      options.params = { username: 'testuser6' };

      const user = checkAccess(options);

      user.should.be.eq(false);

      done();
    });

    it('should return false (testUser6:auth_put_users:username, auth get /users/testuser6)', (done) => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'get';
      options.route = 'users';
      options.params = { username: 'testuser6' };

      const user = checkAccess(options);

      user.should.be.eq(false);

      done();
    });

    it('should return false (testUser6:auth_put_users:username, auth put /cards/123)', (done) => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'auth';

      options.method = 'put';
      options.route = 'cards';
      options.params = { card: '123' };

      const user = checkAccess(options);

      user.should.be.eq(false);

      done();
    });

    it('should return false (testUser6:auth_put_users:username, cards put /users/testuser6)', (done) => {
      const options = {};

      options.token = testUser6Token;
      options.secret = process.env.JWT_SECRET;

      options.service = 'cards';

      options.method = 'put';
      options.route = 'users';
      options.params = { username: 'testuser6' };

      const user = checkAccess(options);

      user.should.be.eq(false);

      done();
    });
  })
});

describe('middleware', () => {
  describe('checkAccess', () => {
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

  describe('checkAccess', () => {
    it('should return error 401 Unauthorized (no token)', (done) => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');

          done();
        });
    });
  });

  describe('checkAccess', () => {
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
  });

  describe('checkAccess', () => {
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
  });
});
