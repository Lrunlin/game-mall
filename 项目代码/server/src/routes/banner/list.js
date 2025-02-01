const Router = require("koa-router");
const db = require("@/db");
const router = new Router();

router.get("/banner", async ctx => {
  try {
    const [result] = await db.query(`select * from banner;`);

    ctx.body = {
      success: true,
      message: "查询Banner列表",
      data: result,
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "查询失败",
    };
  }
});

module.exports = router;
