let Router = require("koa-router");
let db = require("@/db");
let auth = require("@/modules/auth");
let router = new Router();

router.get("/user/info", auth(), async ctx => {
  try {
    let [res] = await db.query(`select * from user where id=?`, [ctx.id]);
    ctx.body = {
      success: !!res.length,
      data: { id: res[0]?.id, name: res[0]?.name, avatar: res[0]?.avatar },
    };
  } catch (error) {
    ctx.body = { success: false };
  }
});
module.exports = router;
