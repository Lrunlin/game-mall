let Router = require("koa-router");
const { sign } = require("@/modules/jwt");
let db = require("@/db");
let auth = require("@/modules/auth");
let router = new Router();

router.post("/admin/sign", async ctx => {
  try {
    let [res] = await db.query(`select * from admin where username=? and password=?`, [
      ctx.request.body.username,
      ctx.request.body.password,
    ]);
    
    ctx.body = {
      success: !!res.length,
      data: { id: res[0]?.id, username: res[0]?.username },
      token: sign({ id: res[0]?.id, username: res[0]?.username, type: "admin" }),
    };
  } catch (error) {
    console.log(error);
    
    ctx.body = { success: false };
  }
});
module.exports = router;
