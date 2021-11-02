const express = require('express');
const session = require('express-session');
const app = express();
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { loginLimiter } = require('./middlewares/limitRequests');

const basicAuth = require('express-basic-auth');
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  require('dotenv').config();

  // app.use(require('morgan')('combined'));
}

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use(
  '/api-docs',
  loginLimiter,
  basicAuth({
    users: {
      '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918':
        '25e4e931ee67c97bc504dc18c2574495139e63c18790f9e3b7418d49143d0f68',
    },
    challenge: true,
    realm: 'Imb4T3st4pp',
  }),
  swaggerUi.serve,

  swaggerUi.setup(swaggerDocument),
);

require('./services/mongo')();

app.use(mongoSanitize());

//Prevent HTTP Parameter Pollution example: http://localhost:4000/api/dev?username=long&username=laduv =>
// req.query = {username:  [ 'long', 'laduv' ]}
app.use(hpp());

app.use(helmet()); //protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.

// const swaggerUi = require('swagger-ui-express');


const socket = require('./utils/socket');

app.use(cookieParser());

const whitelist = ['http://localhost:3000', 'https://rentme.games'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// if(process.env.NODE_ENV === 'production') {
//   app.use(cors(corsOptions));
// }

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));

app.use(passport.initialize());
app.use(
  session({
    // secret sha256
    secret: '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

require('./services/passport')();

require('./routes')(app);
socket(app);

module.exports = app;
