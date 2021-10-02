const express = require('express');
const session = require('express-session');
const app = express();
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  // const swaggerJsdoc = require('swagger-jsdoc');

  // const options = {
  //   definition: {
  //     openapi: '3.0.0',
  //     info: {
  //       title: 'BACKEND API',
  //       version: '1.0.0',
  //     },
  //   },
  //   apis: ['./routes/*.js'], // files containing annotations as above
  // };
  // const openapiSpecification = swaggerJsdoc(options);
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
}

app.use(mongoSanitize());

// limit request (limit 1000 request in 1h)

app.use(helmet()); //protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.

// const swaggerUi = require('swagger-ui-express');

require('./services/mongo')();

const routes = require('./routes');
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
    cookie: { secure: false },
  }),
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

require('./services/passport')();

routes(app);
socket(app);
// app.listen(4000)
