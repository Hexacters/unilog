/**
 * @author ramkishore
 */


const nodeCron = require('node-cron');
const {saveKioskLogs} = require("./save-kiosk-log-files");

let kioskLogCronJob = nodeCron.schedule('*/1 * * * *', async () => {
    console.log('SAVE KIOSK LOG FILE', new Date().toISOString());
    await saveKioskLogs();
});

module.exports ={kioskLogCronJob};
