let jwt = require("jsonwebtoken");
function sign(obj) {
  const token = jwt.sign(obj, "key");
  return token;
}
module.exports = sign;
