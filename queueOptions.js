exports.options =
    {
        defaultJobOptions: {
            timeout: 60000,//how long to wait before asuming fail
            attempts: 3,
            removeOnComplete: false //need  this so job.finished() fires
        }
    };


exports.maxConcurrent = 100; //max transactions to handle concurrently (= max channels)