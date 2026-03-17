let mongoose = require("mongoose");
let app = require("./app");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server;
const appModulePath = require.resolve("./app");
const serverPlanetModel = mongoose.models.planets;


// Assertion 
chai.should();
chai.use(chaiHttp); 

before((done) => {
    const connectTimeoutMs = 15000;
    let timeoutId;

    function cleanup() {
        mongoose.connection.off("connected", onConnected);
        mongoose.connection.off("error", onError);
        clearTimeout(timeoutId);
    }

    function onConnected() {
        cleanup();
        done();
    }

    function onError(error) {
        cleanup();
        done(error);
    }

    server = app.listen(0, () => {
        if (mongoose.connection.readyState === 1) {
            done();
            return;
        }

        timeoutId = setTimeout(() => {
            cleanup();
            done(new Error("Timed out waiting for MongoDB connection"));
        }, connectTimeoutMs);

        mongoose.connection.once("connected", onConnected);
        mongoose.connection.once("error", onError);
    });
});

after((done) => {
    mongoose.connection.close(() => {
        if (server && server.listening) {
            server.close(done);
        } else {
            done();
        }
    });
});

function clearAppFromRequireCache() {
    delete require.cache[appModulePath];

    if (typeof mongoose.deleteModel === "function") {
        try {
            mongoose.deleteModel("planets");
        } catch (error) {
            // Ignore missing model cleanup during test reloads.
        }
    }
}

function loadAppWithMockedConnect(envOverrides, connectImpl) {
    const originalConnect = mongoose.connect;
    const originalEnv = {
        MONGO_URI: process.env.MONGO_URI,
        MONGO_USERNAME: process.env.MONGO_USERNAME,
        MONGO_PASSWORD: process.env.MONGO_PASSWORD
    };

    process.env.MONGO_URI = envOverrides.MONGO_URI;
    process.env.MONGO_USERNAME = envOverrides.MONGO_USERNAME;
    process.env.MONGO_PASSWORD = envOverrides.MONGO_PASSWORD;
    mongoose.connect = connectImpl;

    clearAppFromRequireCache();
    const loadedApp = require("./app");

    mongoose.connect = originalConnect;

    if (originalEnv.MONGO_URI === undefined) {
        delete process.env.MONGO_URI;
    } else {
        process.env.MONGO_URI = originalEnv.MONGO_URI;
    }

    if (originalEnv.MONGO_USERNAME === undefined) {
        delete process.env.MONGO_USERNAME;
    } else {
        process.env.MONGO_USERNAME = originalEnv.MONGO_USERNAME;
    }

    if (originalEnv.MONGO_PASSWORD === undefined) {
        delete process.env.MONGO_PASSWORD;
    } else {
        process.env.MONGO_PASSWORD = originalEnv.MONGO_PASSWORD;
    }

    clearAppFromRequireCache();

    return loadedApp;
}

describe('Planets API Suite', () => {

    describe('Fetching Planet Details', () => {
        it('it should fetch a planet named Mercury', (done) => {
            let payload = {
                id: 1
            }
          chai.request(server)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(1);
                    res.body.should.have.property('name').eql('Mercury');
                done();
              });
        });

        it('it should fetch a planet named Venus', (done) => {
            let payload = {
                id: 2
            }
          chai.request(server)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(2);
                    res.body.should.have.property('name').eql('Venus');
                done();
              });
        });

        it('it should fetch a planet named Earth', (done) => {
            let payload = {
                id: 3
            }
          chai.request(server)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(3);
                    res.body.should.have.property('name').eql('Earth');
                done();
              });
        });
        it('it should fetch a planet named Mars', (done) => {
            let payload = {
                id: 4
            }
          chai.request(server)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(4);
                    res.body.should.have.property('name').eql('Mars');
                done();
              });
        });

        it('it should fetch a planet named Jupiter', (done) => {
            let payload = {
                id: 5
            }
          chai.request(server)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(5);
                    res.body.should.have.property('name').eql('Jupiter');
                done();
              });
        });

        it('it should fetch a planet named Satrun', (done) => {
            let payload = {
                id: 6
            }
          chai.request(server)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(6);
                    res.body.should.have.property('name').eql('Saturn');
                done();
              });
        });

        it('it should fetch a planet named Uranus', (done) => {
            let payload = {
                id: 7
            }
          chai.request(server)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(7);
                    res.body.should.have.property('name').eql('Uranus');
                done();
              });
        });

        it('it should fetch a planet named Neptune', (done) => {
            let payload = {
                id: 8
            }
          chai.request(server)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(8);
                    res.body.should.have.property('name').eql('Neptune');
                done();
              });
        });

        // it('it should fetch a planet named Pluto', (done) => {
        //     let payload = {
        //         id: 9
        //     }
        //   chai.request(server)
        //       .post('/planet')
        //       .send(payload)
        //       .end((err, res) => {
        //             res.should.have.status(200);
        //             res.body.should.have.property('id').eql(9);
        //             res.body.should.have.property('name').eql('Sun');
        //         done();
        //       });
        // });


    });        
});

//Use below test case to achieve coverage
describe('Testing Other Endpoints', () => {
    describe('it should fetch the homepage', () => {
        it('it should serve index.html', (done) => {
          chai.request(server)
              .get('/')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.include('Solar System');
                done();
              });
        });
    });

    describe('it should fetch OS Details', () => {
        it('it should fetch OS details', (done) => {
          chai.request(server)
              .get('/os')
              .end((err, res) => {
                    res.should.have.status(200);
                done();
              });
        });
    });

    describe('it should fetch Live Status', () => {
        it('it checks Liveness endpoint', (done) => {
          chai.request(server)
              .get('/live')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('live');
                done();
              });
        });
    });

    describe('it should fetch Ready Status', () => {
        it('it checks Readiness endpoint', (done) => {
          chai.request(server)
              .get('/ready')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('ready');
                done();
              });
        });
    });

});

describe('Configuration and Error Handling', () => {
    it('uses mongo credentials when they are provided', () => {
        let capturedArgs;
        const originalLog = console.log;

        console.log = () => {};

        loadAppWithMockedConnect({
            MONGO_URI: 'mongodb://127.0.0.1:27017/solar-system',
            MONGO_USERNAME: 'local-user',
            MONGO_PASSWORD: 'local-pass'
        }, (uri, options, callback) => {
            capturedArgs = {
                uri,
                options
            };

            callback(new Error('mock connection failure'));
        });

        console.log = originalLog;

        capturedArgs.uri.should.eql('mongodb://127.0.0.1:27017/solar-system');
        capturedArgs.options.user.should.eql('local-user');
        capturedArgs.options.pass.should.eql('local-pass');
    });

    it('returns an error message when the planet query fails', (done) => {
        const planetModel = serverPlanetModel;
        const originalFindOne = planetModel.findOne;
        const originalAlert = global.alert;

        global.alert = () => {};
        planetModel.findOne = (query, callback) => callback(new Error('mock query failure'));

        chai.request(server)
            .post('/planet')
            .send({ id: 1 })
            .end((err, res) => {
                planetModel.findOne = originalFindOne;
                global.alert = originalAlert;

                res.should.have.status(200);
                res.text.should.eql('Error in Planet Data');
                done();
            });
    });
});
