let express = require('express');
let router = express.Router();
var fs = require('fs');
const path = require('path');

/**
 * POST Function to add error message to log file
 */
router.post('/', async function (request, response) {
    console.log("REQUEST BODY", request.body);
    try {
        const errorLog = request.body;
        if (!errorLog.message || !errorLog.timestamp || !errorLog.stack) {
            return response.status(400).send("Invalid input, message, timestamp and stack are required Parameter");
        }
        const filePath = path.join("./logs/error-log", "error-log.txt");
        var logStream = fs.createWriteStream(filePath, { flags: 'a' });
        logStream.write("\n"+errorLog.timestamp +" - "+ errorLog.message+"\n");
        logStream.end(errorLog.stack+"\n");
        return response.status(200).send('Success: The error log was written successfully');
    } catch (error) {
        console.log("error", error)
        return response.status(500).send(error);
    }
});

module.exports = router;