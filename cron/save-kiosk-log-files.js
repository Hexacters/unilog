/**
 * @author keerthi
 * @author ramkishore
 */
const os = require("os");
let axios = require('axios');
var fs = require('fs');

const KIOSK_LOG_FILE_PATH = "/Users/ramkishoremadheshwaran/Documents/unilog_viewer/logs/log2.txt";

function readKioskLogFile() {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(KIOSK_LOG_FILE_PATH, { encoding: 'utf-8' }, function (err, data) {
                if (!err) {
                    let responseObject = {
                        "updatedAt": new Date().toISOString(),
                        "fileData": data.split('\n').splice(data.split('\n').length - 100, data.split('\n').length).join('\n'),
                        "key": "Error Log",
                        "kioskId": os.hostname()
                    }
                    resolve(responseObject);
                } else {
                    reject(err);
                }
            });
        } catch (error) {
            console.log("error", error)
            reject(error);
        }
    });
}

function writeKioskLogsToDb(payLoad) {
    return new Promise((resolve) => {

        let data = JSON.stringify(payLoad);

        let config = {
            method: 'post',
            url: 'https://unilog-server.herokuapp.com/save/log',
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

function saveKioskLogs() {
    return new Promise(async (resolve, reject) => {
        try {
            readKioskLogFile().then(payLoad => {
                writeKioskLogsToDb(payLoad).then(result => {
                    console.log(`${payLoad["kioskId"]} KIOSK LOG Save Result ====== ${result}`);
                });
            });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = { saveKioskLogs };