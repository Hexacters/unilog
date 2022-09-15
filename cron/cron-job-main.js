/**
 * @author ramkishore
 */

const nodeCron = require('node-cron');
const { saveProcessStats } = require("./save-process-stats");
const { saveSystemStats } = require("./save-system-stats");
const { saveHardwareStats } = require("./save-hardware-stats");

let cronJob = nodeCron.schedule('*/30 * * * * *', async () => {

    console.log('SAVE SYSTEM AND PROCESS STATISTICS', new Date().toISOString());
    try {
        await saveHardwareStats();
        await saveProcessStats();
        await saveSystemStats();
    } catch (exception) {
        console.error(exception);
    }
});

module.exports = { cronJob };