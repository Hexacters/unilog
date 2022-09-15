/**
 * @author keerthi
 * @author ramkishore
 */
const os = require("os");
let axios = require('axios');
var fs = require('fs');
const path = require('path');

function readErrorLogFile(fileName) {
    return new Promise((resolve, reject) => {
        try {
            const filePath = path.join("../logs/error-log", fileName);
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

function writeErrorLogsToDb(payLoad) {
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

function getFileList() {
    return new Promise((resolve, reject) => {
        fs.readdir("../logs/error-log", function (err, files) {
            //handling error
            if (err) {
                reject('Unable to scan directory: ' + err);
            }
            resolve(files);
        });
    });
}


function saveErrorLogs() {
    return new Promise(async (resolve, reject) => {
        try {
            let fileNameList = await getFileList();
            if (!fileNameList.length > 0) {
                reject("FILE NAME LIST IS EMPTY");
            }
            fileNameList.forEach(fileName => {
                readErrorLogFile(fileName).then(payLoad => {
                    writeErrorLogsToDb(payLoad).then(result => {
                        console.log(`${payLoad["kioskId"]} ERROR LOG Save Result ====== ${result}`);
                    });
                });
            });
        } catch (e) {
            reject(e);
        }
    });
}


module.exports = {saveErrorLogs};