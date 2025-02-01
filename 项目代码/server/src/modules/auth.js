let jwt = require("jsonwebtoken");

async function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "key", async function (err, decoded) {
      if (err) {
        reject();
      } else {
        resolve(decoded);
      }
    });
  });
}

function auth(isAdmin) {
  return async (ctx, next) => {
    let token = ctx.headers.authorization;
    if (!token) {
      ctx.status = 401;
      return;
    }

    await verify(token)
      .then(async decoded => {
        if (isAdmin && decoded.type != "admin") {
          ctx.status = 401;
        } else {
          ctx.id = decoded.id;
          ctx.auth = decoded.type;
          ctx.username = decoded.username;
          await next();
        }
      })
      .catch(err => {
        ctx.status = 401;
      });
  };
}
module.exports = auth;
