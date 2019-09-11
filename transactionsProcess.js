//MODIFY THIS FOR YOUR ENVIRONMENT
isProduction = false;
seed = process.env.PRIVATE_KEY; //private key/seed (keep private / store in .env file for production)
uniqueAppId = process.env.appID; //your app id assigned by Kin - you can use 1acd for testing
maxKinSendable = 200; //just for your security - set max Kin you allow from your server to your app
//END MODIFY THIS FOR YOUR ENVIRONMENT


const Queue = require('bull');
const QueueOptions = require('./queueOptions.js');
const responses = require('./responses.js');
const transactions = new Queue('transactionQueue', process.env.REDISCLOUD_URL, QueueOptions.options);
const KinWrapper = require('kin-node-callback');
const kin = new KinWrapper(seed, isProduction, uniqueAppId);//initialize



//fund newly created account
async function fundAccount(address, memo, amount) {
    var response = responses.standardResponse();
    amount = Math.min(amount, maxKinSendable); // set max we are willing to send - consider adding other security features
    var minimumFee = 100; //you won't be charged if whitelisted by Kin
    await kin.getMinimumFee((err, fee) => { minimumFee = err ? 100 : fee; });
    await kin.createAccount(address, amount, memo, (err, transactionId) => {
        if (!err) {
            response.text = transactionId;
        } else {
            response = responses.errorResponse(err);
        }
    });
    return (response);
}


//send a payment
async function sendPayment(address, id, memo, amount) {
    //you can use the id to record / authorise details of each user (not implemented here)
    var response = responses.standardResponse();
    amount = Math.min(amount, maxKinSendable); //set max we are willing to send - consider adding other security features
    var minimumFee; //you won't be charged if whitelisted by Kin
    await kin.getMinimumFee((err, fee) => { minimumFee = err ? 100 : fee; });
    await kin.sendKin(address, amount, memo, (err, transactionId) => {
        if (!err) {
            response.text = transactionId;
        } else {
            response = responses.errorResponse(err);
        }
    });
    return (response);
}


//Whitelists transactions so fees are zero
function whitelistTransaction(data) {
    var response = responses.standardResponse();
    clientTransaction = JSON.stringify(data);
    try {
        response.text = kin.account.whitelistTransaction(clientTransaction);
    } catch (err) {
        response = responses.errorResponse(err);
    }
    return (response);
}


//handle http requests from the client
async function processJob(job) {
    let get = job.data.get;
    let post = job.data.post;
    let response;
    if (typeof get.fund !== 'undefined') {
        //fund a newly created account
        if (post.amount < maxKinSendable)
            response = await fundAccount("GBHIF62HGZC2UBGXZZFGXZ4Q2E42FFOWJGLXX7HLFBGAKPXEQ7MQJ2RR", "test", 10);
            ///todo: restore response = await fundAccount(post.address, post.memo, post.amount);
    } else if (typeof get.request !== 'undefined') {
        //send a payment to an account
        if (post.amount < maxKinSendable || true === true) //todo: remove true
            response = await sendPayment("GBHIF62HGZC2UBGXZZFGXZ4Q2E42FFOWJGLXX7HLFBGAKPXEQ7MQJ2RR", "99", "test", 5);
            ///todo: restore response = await sendPayment(post.address, post.id, post.memo, post.amount);
    } else if (typeof get.whitelist !== 'undefined') {
        //Whitelist a transaction
        response = await whitelistTransaction(post);
    } else {
        //empty request
        response = responses.errorResponse('no get vars');
    }
    return (response);
}


transactions.process(QueueOptions.maxConcurrent, async (job, done) => {
    let response = await processJob(job);
    done(null, response);
});