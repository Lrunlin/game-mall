let Router = require("koa-router");
const sign = require("@/modules/signToken");
let db = require("@/db");
let router = new Router();

router.post("/user/sign", async ctx => {
  try {
    let [res] = await db.query(`select * from user where email=? and password=?`, [
      ctx.request.body.email,
      ctx.request.body.password,
    ]);

    ctx.body = {
      success: !!res.length,
      data: { id: res[0]?.id, name: res[0]?.name, avatar: res[0]?.avatar },
      token: sign({ id: res[0]?.id, username: res[0]?.name, type: "user" }),
    };
  } catch (error) {
    ctx.body = { success: false };
  }
});
module.exports = router;
