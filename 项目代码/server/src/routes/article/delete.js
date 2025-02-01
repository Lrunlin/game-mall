const Router = require("koa-router");
const db = require("@/db");
const router = new Router();

router.delete("/article/:id", async ctx => {
  const articleId = ctx.params.id;

  try {
    const [result] = await db.query("UPDATE article SET state = 0 WHERE id = ?", [articleId]);

    ctx.body = {
      success: !!result?.affectedRows,
      message: result?.affectedRows ? "文章删除成功" : "文章不存在或已被删除",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "文章删除失败",
    };
  }
});

module.exports = router;
