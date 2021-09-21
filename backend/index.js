const express = require('express');
var app = express();
const server = require('http').createServer(app);
const path = require('path');
const PORT = 5000;
const cors = require('cors');

app.use(express.json());
// app.use(cors);
app.get('/api/eth', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({value: 100});
})


// if route doesn't resolve to an API call, respond with react
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/public', 'index.html'));
  });

// tell server to listen on PORT
server.listen(PORT, () => {
    console.log(`Now listening on port: ${PORT}`);
})

