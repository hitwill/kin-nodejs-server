const Queue = require('bull');
const QueueOptions = require('./queueOptions.js');
const responses = require('./responses.js');
const transactions = new Queue('transactionQueue', process.env.REDISCLOUD_URL, QueueOptions.options);
const port = process.env.PORT;//if using Heroku automatic, else 5000 for localhost
const http = require('http');
const qs = require('querystring');



//create a server object:
const server = http.createServer();
server.on('request', async (req, res) => {
    var body = '';
    const getReq = qs.parse(req.url.split('?')[1]);
    req.on('data', function (data) { body += data; });
    req.on('end', async function () {
        try {
            body = JSON.parse(body);
        } catch (e) {
            //string may come differently
            body = decodeURIComponent(body);
            body = body.replace(/[&]/g, '","');
            body = body.replace(/[=]/g, '":"');
            body = '{"' + body + '"}';
            try {
                body = JSON.parse(body);
            } catch (e) {
                body = '';
            }
        }
        await processRequest(getReq, body, res);//pass it on to the singleton Kin object
    });
    req.on('error', (err) => {
        responses.respond(res, errorResponse(err));
    });

});
server.listen(port);



async function processRequest(get, post, res) {
    let response;
    let request = { get: get, post: post };
    try {
        let jobQueue = await transactions.add(request);

        response = await jobQueue.finished();
        jobQueue.remove(); //clear up storage space

    } catch (e) {
        response = responses.errorResponse(e);
    }
    responses.respond(res, response);
}