let Router = require("koa-router");
let db = require("@/db");
let auth = require("@/modules/auth");
let router = new Router();

router.get("/user", auth(), async ctx => {
  try {
    let [res] = await db.query(`select * from user where id=?`, [ctx.id]);
    if (res[0]) {
      delete res[0].password;
    }
    ctx.body = {
      success: !!res.length,
      data: res[0],
    };
  } catch (error) {
    ctx.body = { success: false };
  }
});
module.exports = router;
