/**
 * @author ramkishore
 */

let express = require('express');
let router = express.Router();

router.get('/', function (request, response) {
    response.send("VIHAAN");
});

module.exports = router;

