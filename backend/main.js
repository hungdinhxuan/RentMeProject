const express = require('express');
const app = express();

app.get('/api', (req, res) => {
    return res.send('server is running')
})

app.listen(4000)
