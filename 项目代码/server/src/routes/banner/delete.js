const Router = require("koa-router");
const db = require("@/db");
const router = new Router();

router.delete("/banner/:id", async ctx => {
  try {
    const bannerId = ctx.params.id;

    const [result] = await db.query(`DELETE FROM banner WHERE id = ?`, [bannerId]);

    ctx.body = {
      success: !!result?.affectedRows,
      message: "删除成功",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "删除失败",
    };
  }
});

module.exports = router;
