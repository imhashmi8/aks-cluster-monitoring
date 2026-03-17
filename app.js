const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const client = require("prom-client");
const app = express();
const cors = require('cors')

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"]
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/solar-system';
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

if (process.env.MONGO_USERNAME) {
    mongoOptions.user = process.env.MONGO_USERNAME;
}

if (process.env.MONGO_PASSWORD) {
    mongoOptions.pass = process.env.MONGO_PASSWORD;
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors())

app.use((req, res, next) => {
    const route = req.path;
    const endTimer = httpRequestDuration.startTimer();

    res.on("finish", () => {
        const labels = {
            method: req.method,
            route,
            status_code: String(res.statusCode)
        };

        endTimer(labels);
        httpRequestsTotal.inc(labels);
    });

    next();
});

mongoose.connect(mongoUri, mongoOptions, function(err) {
    if (err) {
        console.log("error!! " + err)
    } else {
      //  console.log("MongoDB Connection Successful")
    }
})

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('planets', dataSchema);



app.post('/planet',   function(req, res) {
   // console.log("Received Planet ID " + req.body.id)
    planetModel.findOne({
        id: req.body.id
    }, function(err, planetData) {
        if (err) {
            alert("Ooops, We only have 9 planets and a sun. Select a number from 0 - 9")
            res.send("Error in Planet Data")
        } else {
            res.send(planetData);
        }
    })
})

app.get('/',   async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});


app.get('/os',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
})

app.get('/live',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "live"
    });
})

app.get('/ready',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "ready"
    });
})

app.get('/metrics', async function(req, res) {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
})

if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log("Server successfully running on port - " + port);
    })
}

module.exports = app;
