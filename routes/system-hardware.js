/**
 * @author Venkat
 */
const { exec } = require('child_process');
let express = require('express');
let router = express.Router();

/**
 * GET Function to fetch all usage statistics
 */
router.get('/', function (request, response) {
    const status = {}
    try {
        exec(`wmic path CIM_LogicalDevice where "Description like 'USB%'" get /value`, (err, stdout, stderr) => {
            if (err) {
                response.status(500).send(err);
                return;
            }



            status.thermal = stdout.includes('USBXHCI');
            status.printer = stdout.includes('Printing');
            status.scanner = stdout.split('Camera').length > 2;
            response.status(200).send(status);

            // console.log(stdout);
        })

    } catch (e) {
        response.status(500).send(e);
    }
});

module.exports = router;