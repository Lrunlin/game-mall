const Router = require("koa-router");
const db = require("@/db");
const router = new Router();
const id = require("@/utils/id");
const auth = require("@/modules/auth");

router.post("/article", auth(), async ctx => {
  try {
    const { title, content, game_id, cover } = ctx.request.body;

    const [result] = await db.query(
      `INSERT INTO article (id, title, content, game_id, cover,user_id, create_time) VALUES (?, ?, ?, ?, ?,?, NOW())`,
      [id(), title, content, game_id, JSON.stringify(cover), ctx.id]
    );

    ctx.body = {
      success: !!result?.affectedRows,
      message: "发布成功",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "发布失败",
    };
  }
});

module.exports = router;
