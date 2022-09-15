/**
 * @author ramkishore
 * @author keerthi
 */

let express = require('express');
let router = express.Router();
const find = require('find-process');
var pidusage = require('pidusage');

/**
 * GET Function to fetch usage statistics for a given process name
 */
router.get('/', async function (request, response) {
    // LOGIC TO GET THE USAGE STATISTICS FOR A GIVEN PROCESS GOES HERE;
    try {
        const processName = request.query.processName;
        if (!processName) {
            return response.status(400).send("Invalid input, Proccess name is required  Query Parameter");
        }
        const processs = await find('name', processName, true);
        if (processs.length > 0) {
            const processPromiseList = processs.map(process => pidusage(process.pid));
            const processes = await Promise.allSettled(processPromiseList);
            const processValue = processes.map(process => process.value)
            const processArr = processValue.map(obj => ({ 'processName': processName, ...obj }));
            return response.status(200).send(processArr);
        } else {
            return response.status(404).send("No process found with given process name");
        }
    } catch (error) {
        console.log("error", error)
        return response.status(500).send(error);
    }
});

module.exports = router;