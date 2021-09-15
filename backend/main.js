const express = require('express');
const socket = require('./utils/socket');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('./services/mongo')();
const app = express();
const routes = require('./routes')

app.use(express.urlencoded({ extended: true }));


app.get('/api', (req, res) => {
  console.log(process.env);
  return res.send(
    `<h1>server is running with bucket ${process.env.AWS_S3_BUCKET_NAME}</h1>`,
  );
});
routes(app);

app.listen(4000);
socket(app);
