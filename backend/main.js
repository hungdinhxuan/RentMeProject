const express = require('express');
const session = require('express-session');
const app = express();
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

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

require('./services/mongo')();

const routes = require('./routes');
const socket = require('./utils/socket');

app.use(cookieParser());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.get('/api', (req, res) => {
  req.cookies['auth_token'] = `${Math.random()}`;
  console.log('Cookies: ', req.cookies);
  return res.send(
    `<h1>server is running with bucket ${process.env.AWS_S3_BUCKET_NAME}</h1>`,
  );
});
routes(app);

app.listen(4000);
socket(app);
