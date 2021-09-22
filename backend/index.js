const express = require('express');
var app = express();
const server = require('http').createServer(app);
const path = require('path');
const PORT = 5000;
const ethereum_queries = require('./ethereum_queries')

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/api/:id', ethereum_queries.ethereum_get);

app.post('/api', ethereum_queries.ethereum_post)

// if route doesn't resolve to an API call, respond with react
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/public', 'index.html'));
  });

// tell server to listen on PORT
server.listen(PORT, () => {
    console.log(`Now listening on port: ${PORT}`);
})

