const Router = require("koa-router");
const db = require("@/db");
const router = new Router();
const id = require("@/utils/id");

router.post("/banner", async ctx => {
  try {
    const { url, cover } = ctx.request.body;

    const [result] = await db.query(
      `INSERT INTO banner (id, url, cover, create_time) VALUES (?, ?, ?, NOW())`,
      [id(), /^[\s\S]*.*[^\s][\s\S]*$/.test(url) ? url : null, cover]
    );

    ctx.body = {
      success: !!result?.affectedRows,
      message: "添加成功",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "添加失败",
    };
  }
});

module.exports = router;
