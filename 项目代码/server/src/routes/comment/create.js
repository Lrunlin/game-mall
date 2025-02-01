const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const id = require("@/utils/id");
const router = new Router();

router.post("/comment", auth(), async ctx => {
  try {
    const { content, article_id, reply } = ctx.request.body;

    // 插入评论到数据库
    const result = await db.query(
      `INSERT INTO comment (id, content, user_id, article_id,reply, create_time) VALUES (?, ?, ?, ?,?, NOW())`,
      [id(), content, ctx.id, +article_id, reply]
    );

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "评论成功",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "评论失败",
      error: error.message,
    };
  }
});

module.exports = router;
