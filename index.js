const cluster = require('cluster');

if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length;
    console.log(`Master cluster setting up ${numWorkers} workers ...`);

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
        console.log('Starting a new worker');
        cluster.fork();
    });

} else {
    var app = require('express')();
    app.all('/*', (req, res) => {res.send(`process ${process.pid} says hello!`).end();})

    var server = app.listen(8000, () => {
        console.log(`Process ${process.pid} is listening to all incoming requests`);
    });
}