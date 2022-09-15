/**
 * @author keerthi
 * @author ramkishore
 */
const os = require("os");
let axios = require('axios');
var fs = require('fs');
const path = require('path');

function readKioskLogFile(fileName) {
    return new Promise((resolve, reject) => {
        try {
            const filePath = path.join("../logs/kiosk-log", fileName);
            fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
                if (!err) {
                    let responseObject = {
                        "updatedAt": new Date().toISOString(),
                        "fileData": data,
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

function getKioskLogFileList() {
    return new Promise((resolve, reject) => {
        fs.readdir("../logs/kiosk-log", function (err, files) {
            //handling error
            if (err) {
                reject('Unable to scan directory: ' + err);
            }
            resolve(files);
        });
    });
}


function saveKioskLogs() {
    return new Promise(async (resolve, reject) => {
        try {
            let fileNameList = await getKioskLogFileList();
            if (!fileNameList.length > 0) {
                reject("FILE NAME LIST IS EMPTY");
            }
            fileNameList.forEach(fileName => {
                readKioskLogFile(fileName).then(payLoad => {
                    writeKioskLogsToDb(payLoad).then(result => {
                        console.log(`${payLoad["kioskId"]} KIOSK LOG Save Result ====== ${result}`);
                    });
                });
            });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {saveKioskLogs};