let express = require('express');
let router = express.Router();
const readLastLines = require('read-last-lines');

/**
 * Get Function to read number of lines from error message in the log file
 */
router.get('/', async function (request, response) {
    try {
        const number = request.query.number?request.query.number:100;
        readLastLines.read('C:\\Users\\keerthi.p\\Documents\\log2.txt', number)
	.then((lines) => {console.log(lines);
        return response.status(200).send(lines)});
    } catch (error) {
        console.log("error", error)
        return response.status(500).send(error);
    }
});

module.exports = router;