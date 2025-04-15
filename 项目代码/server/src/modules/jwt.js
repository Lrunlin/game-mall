let { jwt } = require("lodash-toolkit");
let { sign, verify } = jwt({ key: "jwt-key" });

module.exports = { sign, verify };
