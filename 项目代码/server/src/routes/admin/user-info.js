let Router = require("koa-router");
const sign = require("@/modules/signToken");
let db = require("@/db");
let auth = require("@/modules/auth");
let router = new Router();

router.get("/admin/info", auth(), async ctx => {
  try {
    let [res] = await db.query(`select * from admin where id=?`, [ctx.id]);
    ctx.body = {
      success: !!res.length,
      data: { id: res[0]?.id, username: res[0]?.username },
    };
  } catch (error) {
    ctx.body = { success: false };
  }
});
module.exports = router;
