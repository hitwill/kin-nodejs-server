# Kin-node.js server in 10 minutes
### Heroku ready Implementation of the [Kin SDK for Node.js](https://github.com/kinecosystem/kin-sdk-node)

If you follow the steps below, you should have a running Kin app (client and server) in 15 minutes. (A more detailed tutorial can be found [here](https://medium.com/kinblog/building-a-kin-powered-app-with-unity-cf8deef56bdb) but this code has the latest updates)
## I. Server set up
1. Create a new app on [Heroku](https://dashboard.heroku.com/apps) and provision (add) [redis cloud](https://elements.heroku.com/addons/rediscloud).
2. Under *settings* add the following config vars:

    a). appID - random alphanumeric 4 character string
    
    b). PRIVATE_KEY - Generate a keypair [here](https://laboratory.kin.org/index.html#account-creator?network=public) and paste the secret provided
    
    c). SALT - random string. (Generate a new keypair and use the secret for the salt)

3. Take the *public* key you generated in step 2(b), and paste it on the friendbot and fund it with free test kin.
4. Clone this repository on your desktop, and push it to your heroku app.
5. On heroku, click the *resources* tab for your app and make sure **both** worker and web dynos are on.

#### Finally
Find your app's url from the *settings* tab and access it with the following variable:
```javascript
?createChannels=true
```
e.g.
https://my-server.herokuapp.com?createChannels=true

## II. Client set up
Download this [sample app](https://github.com/hitwill/kin-sdk-unity-tutorial) and open with Unity.






**Note 1:** - this will only work with pre-created accounts (you provide the private key of an on-boarded account).

**Note 2:** - this uses [channels](https://docs.kin.org/nodejs/sdk#channels) to increase performance, so  you need to make sure that only a single instance of a KinAccount is initialized with multiple channel accounts.

**Note 3:** - You can find a fully implemented version of this code [here](https://github.com/hitwill/kin-nodejs-server) with instructions of how to implement it yourself on [heroku](https://heroku.com).

# Usage
## Installation
```
npm install kin-node-callback
```

## Initializing
Initialize once and use throughout your code
```javascript
const isProduction = false;
const appID = 'appID';
const KinWrapper = require('./KinWrapper');

//NOTE: store your seed in an environment variable! Below is just an example
const seed = 'SD5A7NFIWBZFMVNH73IORNWEGLEL6FTEHQD6N2HDJEM6RC5UZCIH7YK6';
const salt = 'SAQDKPXW2XC5SCNEADTEH2PHYHP74RWTCJ4MOK573RZINXI5HYIU4XK3';


var kin = new KinWrapper(seed, salt,isProduction,appID);
console.log(kin.account.publicAddress);

kin.sendKin('GC7LPGWEPTC47ENOCWC6B57FT6M6MBHK2ZAKWSAUISQFAEETMSWSUNNI', 10, 'test send', callback);

function callback(err, data) {
    console.log(data);
}
```

## First use
Before calling any functions, you will need to create and fund channels once. This creates 100 channels on Kin's blockchain that the wrapper will use. After this one time creation, you can comment out the code. Create the channels as follows:

```javascript
kin.CreateChannels(callback);

```


# Calling functions
## Synchronous functions
Just call synchronous functions defined in the [SDK](https://github.com/kinecosystem/kin-sdk-node) as follows:
```javascript
const address = kin.account.publicAddress;
```

Or


```javascript
const whitelistedTransaction = kin.account.whitelistTransaction(clientTransaction);
```

Or

```javascript
const decodedTransaction = kin.client.decodeTransaction(encodedTransaction);
```

etc


## Asynchronous functions
Check if an account exists
```javascript
kin.isAccountExisting(address, (err, exists) => {
    if (!err) {
        console.log(exists);
    }
});
```

Get the minimum fee per transaction
```javascript
kin.getMinimumFee((err, fee) => {
    if (!err) {
        console.log(fee);
    }
});
```

Create an account on the blockchain
```javascript
kin.createAccount(address, startingBalance, memoText, (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```

Get the balance on an account
```javascript
kin.getAccountBalance(address, (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```


Get the data on an account
```javascript
kin.getAccountData(address, (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```

Send Kin to a destination
```javascript
kin.sendKin(destination, amount, memoText,  (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```

Get the data on a transaction
```javascript
kin.getTransactionData(transactionId, (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```

Fund an account with the friendbot (test network)
```javascript
kin.friendbot(address, ammount,  (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```

## Listening for Kin Payments
These methods can be used to listening for Kin payment that an account or multiple accounts are sending or receiving.

It is possible to monitor multiple accounts using `createPaymentListener`. This function will continuously get data about **all** accounts on the blockchain, and you can specify which accounts you want to monitor.

```javascript
const paymentListener = kin.client.createPaymentListener({
        onPayment: payment => {
            console.log(payment);
        },
        addresses: ['address1', 'address2']
    });
```

You can freely add accounts to this monitor or remove them:

```javascript
paymentListener.addAddress('address3');
paymentListener.removeAddress('address1');
```

### Stopping a Monitor
When you are done monitoring, stop the monitor to terminate the connection to the blockchain.

```javascript
paymentListener.close();
```