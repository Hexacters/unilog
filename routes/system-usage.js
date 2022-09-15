/**
 * @author ramkishore
 * @author keerthi
 */

let express = require('express');
let router = express.Router();
var osu = require('node-os-utils')
var cpuu = osu.cpu
var memy = osu.mem

/**
 * GET Function to fetch all usage statistics
 */
router.get('/', function (request, response) {
    // LOGIC TO GET ALL THE USAGE STATISTICS  GOES HERE;
    let usagePercentage = {
        cpuPercentage: "",
        memory: ""
    }
    cpuu.usage()
        .then(usage => {
            usagePercentage["cpuPercentage"] = usage;
            memy.info().then(memory => {
                console.log(memory);
                usagePercentage["memory"] = memory;
                osu.netstat.stats().then((s) => {
                    usagePercentage.network = s.map(e => e.inputBytes).reduce((s, e) => +s + +e, 0);
                    response.status(200).send(usagePercentage);
                })
            });
        });
});

module.exports = router;