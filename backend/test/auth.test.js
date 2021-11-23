const dotenv = require('dotenv');
dotenv.config({ path: './env.test' });
const User = require('../models/users.model');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../main');
chai.should();

chai.use(chaiHttp);

describe('Auth', () => {
  beforeEach((done) => {
    //Before each test we empty the database
    User.deleteMany({}, (err) => {
      done();
    });
  });

  describe('POST auth login', () => {
    it('it should login success', (done) => {
      chai
        .request(server)
        .post('/api/auth/register')
        .send({
          username: 'Admin1',
          password: 'Abcdef1@',
          email: 'Admin1@gmail.com',
          fullName: 'Đinh Hùng Test',
        })
        .end((error, result) => {
          chai
            .request(server)
            .post('/api/auth/login')
            .send({
              username: 'Admin1',
              password: 'Abcdef1@',
            })
            .end((err, res) => {
              res.should.have.status(200);
              // res.body.should.have.property('success').eq(false);
              // res.body.should.have.property('message').eq('Recaptcha error');
              res.body.should.have.property('success').eq(true);
              res.body.should.have.property('message').eq('Login succesful');
              done();
            });
        });
    });
  });

  describe('POST auth register', () => {
    it('it should register successfully', (done) => {
      chai
        .request(server)
        .post('/api/auth/register')
        .send({
          username: 'Admintest',
          password: 'Abcdef1@',
          email: 'rentmeTest1@gmail.com',
          fullName: 'Đinh Hùng Test',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('message').eq('created successful !!');
          res.body.user.should.have.property('username');
          res.body.user.should.have.property('email');
          res.body.user.should.have.property('password');
          res.body.user.should.have.property('fullName');
          done();
        });
    });
  });

  describe('POST auth register with no field', () => {
    it('it should error 422 because no valid field is provided', (done) => {
      chai
        .request(server)
        .post('/api/auth/register')
        .end((err, res) => {
          res.should.have.status(422);
          res.body.errors.should.be.a('array');
          done();
        });
    });
  });

  describe('POST auth register with multiple request', () => {
    it('it should error 429 because there are too many requests ', (done) => {
      // .end((err, res) => {
      //   res.should.have.status(429);
      //   //   res.body.errors.should.be.a('array')
      //   done();
      // });
      const requester = chai.request(server).keepOpen();
      let req = [];
      for (let i = 0; i < 11; i++) {
        req.push(
          requester.post('/api/auth/register').send({
            username: 'Admintest',
            password: 'Abcdef1@',
            email: 'rentmeTest1@gmail.com',
            fullName: 'Đinh Hùng Test',
          }),
        );
      }
      Promise.all(req)
        .then((response) => {
          response[response.length - 1].error.should.have.status(429);
          done();
        })
        .then(() => {
          requester.close();
        });
    });
  });
});
