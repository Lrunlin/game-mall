const Router = require("koa-router");
const db = require("@/db");
const router = new Router();

router.put("/banner/:id", async ctx => {
  try {
    const bannerId = ctx.params.id;
    const { url, cover } = ctx.request.body;

    const [result] = await db.query(`UPDATE banner SET url = ?, cover = ? WHERE id = ?`, [
      url,
      cover,
      bannerId,
    ]);

    ctx.body = {
      success: !!result?.affectedRows,
      message: "修改成功",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "修改失败",
    };
  }
});

module.exports = router;
