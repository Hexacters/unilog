/**
 * @author Venkat
 */
const os = require("os");
const { exec } = require('child_process');
let axios = require('axios');

function saveHardwareStats() {
    return new Promise(async (resolve) => {
        let systemUsageData = await getSystemStats();
        let writeResult = await writeSystemStatsToDb(systemUsageData);
        resolve(writeResult);
    });
}

function getSystemStats() {
    return new Promise((resolve) => {
        const status = {}
        exec(`wmic path CIM_LogicalDevice where "Description like 'USB%'" get /value`, (err, stdout, stderr) => {
            if (err) {
                resolve({
                    "kioskId": os.hostname()
                });
                return;
            }
            status.thermal = stdout.includes('USBXHCI');
            status.printer = stdout.includes('Printing');
            status.scanner = stdout.split('Camera').length > 2;
            resolve({
                "kioskId": os.hostname(),
                ...status
            });
        })
    });
}

function writeSystemStatsToDb(payLoad) {
    return new Promise((resolve) => {

        let data = JSON.stringify(payLoad);

        let config = {
            method: 'post',
            url: 'https://unilog-server.herokuapp.com/save/stats/hardware',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                resolve(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });

    });
}

module.exports = { saveHardwareStats };
