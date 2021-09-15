const express = require('express');
const socket = require('./utils/socket');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('./services/mongo')();
const session = require('express-session');
const app = express();
const passport = require('passport');
const routes = require('./routes');
const cors = require('cors');
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
  console.log(process.env);
  return res.send(
    `<h1>server is running with bucket ${process.env.AWS_S3_BUCKET_NAME}</h1>`,
  );
});
routes(app);

app.listen(4000);
socket(app);
