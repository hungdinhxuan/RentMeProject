const express = require('express');
const socket = require('./utils/socket');
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

require('./services/mongo')();

const swaggerUi = require('swagger-ui-express');
const app = express();

app.use('/api-docs', swaggerUi.serve);

app.get('/api', (req, res) => {
    console.log(process.env);
  return res.send(`<h1>server is running with bucket ${process.env.AWS_S3_BUCKET_NAME}</h1>`);
});

app.listen(4000);
socket(app)