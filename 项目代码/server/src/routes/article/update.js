const Router = require("koa-router");
const db = require("@/db");
const router = new Router();

router.put("/article/:id", async ctx => {
  const articleId = ctx.params.id;
  const { title, content, game_id, cover } = ctx.request.body;

  try {
    const [result] = await db.query(
      "UPDATE article SET title = ?, content = ?, game_id = ?, cover = ? WHERE id = ? ",
      [title, content, game_id || null, JSON.stringify(cover), +articleId]
    );

    ctx.body = {
      success: !!result?.affectedRows,
      message: result?.affectedRows ? "文章修改成功" : "文章不存在或已被删除",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "文章修改失败",
    };
  }
});

module.exports = router;
