let express = require('express');
let router = express.Router();
const readLastLines = require('read-last-lines');

/**
 * Get Function to read number of lines from error message in the log file
 */
router.get('/', async function (request, response) {
    console.log("REQUEST QUERY PARAM", request.query.number);
    try {
        const number = request.query.number?request.query.number:100;
        readLastLines.read('./logs/error-log/error-log.txt', number)
	.then((lines) => {console.log(lines);
        return response.status(200).send(lines)});
    } catch (error) {
        console.log("error", error)
        return response.status(500).send(error);
    }
});

module.exports = router;