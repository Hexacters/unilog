/**
 * @author ramkishore
 */

const nodeCron = require('node-cron');
const {saveErrorLogs} = require("./save-error-log-files");

let fileCronJob = nodeCron.schedule('*/10 * * * * *', async () => {

    console.log('=================================', new Date().toISOString());
    try {
       await saveErrorLogs();
    } catch (exception) {
        console.error(exception);
    }

});

module.exports = {fileCronJob};