const theatersService = require("./theaters.service");

async function list(req, res, next) {
    res.json({ data: await theatersService.list() })
}

module.exports = {
    list
}