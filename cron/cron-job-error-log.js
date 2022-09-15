/**
 * @author ramkishore
 */

const nodeCron = require('node-cron');
const {saveErrorLogs} = require("./save-error-log-files");

let errorLogCronJob = nodeCron.schedule('*/1 * * * *', async () => {

    console.log('SAVE ERROR LOG FILE', new Date().toISOString());
       await saveErrorLogs();

});

module.exports = {errorLogCronJob};