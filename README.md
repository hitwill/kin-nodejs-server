# Kin node.js server and Unity app in 10 minutes
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

This is a one time function you run, to create [channels](https://docs.kin.org/nodejs/sdk#channels) for your account. You can re-run this function if you change your private key and/ or salt. If everything went well, your server should have given you the 'OK' sign. 

### Usage
Simply call the server with GET/POST to perform the following functions:
1. Fund a new account (create it on the blockchain)

    GET: fund = 1

   POST: address, memo, amount

2. Send a payment to an account
  
   GET: request = 1

   POST: address, id, memo, amount

3. Whitelist a transaction for the client

   GET: whitelist = 1

   POST: address, id, memo, amount

#### Variables
1. **address:** The blockchain address you wish to make a payment to
2. **memo:** Memo to add to your transaction
3. **amount:** Amount to send for your transaction
4. **id:** A unique id for your client (optional)

## II. Client set up
1. Download this [sample app](https://github.com/hitwill/kin-sdk-unity-tutorial) and open with Unity.
2. Open *Assets/Scripts/Tutorial.cs* and in *Start()* update the following variables:
```csharp
 void Start()
    {
        string url = "https://mykin-server.com"; //url to your server
        string serverAddress = "GAFWC...VLIZZ"; //*public* key from step 2(b) in server set up
    }
```
3. Compile and run on an **android device** or emulator. The SDK will not work running on the editor.

## Porting to your client
The client code all sits in *Assets/Scripts/KinWrapper.cs*. You can copy that file and attach it to an empty object in the first scene of your app or game. All the details of how the code works can be found in the tutorial linked at the start.




