/**
 * @author ramkishore
 */

const nodeCron = require('node-cron');
const { saveProcessStats } = require("./save-process-stats");
const { saveSystemStats } = require("./save-system-stats");
const { saveHardwareStats } = require("./save-hardware-stats");

let cronJob = nodeCron.schedule('*/30 * * * * *', async () => {

    console.log('=================================', new Date().toISOString());
    try {
        let processStatSaveResult = await saveProcessStats();
        let systemStatsSaveResult = await saveSystemStats();
        await saveHardwareStats();
    } catch (exception) {
        console.error(exception);
    }

});

module.exports = { cronJob };
