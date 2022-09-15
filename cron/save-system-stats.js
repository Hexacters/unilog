/**
 * @author ramkishore
 */
let osu = require('node-os-utils')
const os = require("os");
let cpuu = osu.cpu;
let memy = osu.mem;
let axios = require('axios');

function saveSystemStats() {
    return new Promise(async (resolve) => {
        let systemUsageData = await getSystemStats();
        let writeResult = await writeSystemStatsToDb(systemUsageData);
        resolve(writeResult);
    });
}

function getSystemStats() {
    return new Promise((resolve) => {
        let usagePercentage = {
            cpuPercentage: "",
            memory: ""
        }
        cpuu.usage()
            .then(usage => {
                usagePercentage["cpuPercentage"] = usage;
                memy.info().then(memory => {
                    usagePercentage["memory"] = memory;
                    osu.netstat.stats().then((s) => {
                        if (s && s.map) {
                            usagePercentage.network = s.map(e => e.inputBytes).reduce((s, e) => +s + +e, 0);
                        } else {
                            usagePercentage.network = 0;
                        }
                        resolve({
                            "kioskId": os.hostname(),
                            "systemUsage": usagePercentage
                        });
                    })
                });
            });
    });
}

function writeSystemStatsToDb(payLoad) {
    return new Promise((resolve) => {

        let data = JSON.stringify(payLoad);

        let config = {
            method: 'post',
            url: 'https://unilog-server.herokuapp.com/save/stats/system',
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

module.exports = { saveSystemStats };
