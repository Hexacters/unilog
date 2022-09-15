/**
 * @author ramkishore
 */
const axios = require('axios');
const find = require("find-process");
const pidusage = require("pidusage");
const os = require("os");


function saveProcessStats () {
    return new Promise(async (resolve, reject) => {
        try {
            let processStats = await getProcessStats("metroclickmanager");
            let writeResult = await writeProcessData(processStats);
            resolve(writeResult);
        } catch (e) {
            reject(e);
        }
    });
}
function getProcessStats (processName) {
    return new Promise(async (resolve, reject) => {
        const processs = await find('name', processName, true);
        if (processs.length > 0) {
            const processPromiseList = processs.map(process => pidusage(process.pid));
            const processes = await Promise.allSettled(processPromiseList);
            const processValue = processes.map(process => process.value)
            const processArr = processValue.map(obj => ({ 'processName': processName, ...obj }));
            resolve({
                "kioskId" : os.hostname(),
                "processData" : processArr
            });
        } else {
            reject("EMPTY PROCESS STATS");
        }
    });
}

function writeProcessData (processStats) {
    return new Promise((resolve) => {
        let requestBody = JSON.stringify(processStats);
        if(processStats.processData.length === 0){
            resolve("PROCESS DATA EMPTY");
        }
        let config = {
            method: 'post',
            url: 'https://unilog-server.herokuapp.com/save/stats/process',
            headers: {
                'Content-Type': 'application/json'
            },
            data : requestBody
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

module.exports = {saveProcessStats};