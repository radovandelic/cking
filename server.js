/* import http from 'http'
import express from 'express'
import path from 'path'
import compression from 'compression' */
const http = require('http');
const express = require('express');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');

const app = express()
const port = 5000;
const ip = "0.0.0.0";
const env = "production";

app.use(morgan('dev'))
app.use(morgan(' - :date[clf] - :remote-addr'))
app.use(compression())
app.use(express.static('build'))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app)

setImmediate(() => {
    server.listen(port, ip, () => {
        console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
    })
})

//export default app
module.exports = app;