const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/collection/:id", auth(), async ctx => {
  try {
    // 查询是否收藏
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM collection WHERE user_id = ? AND item_id = ?",
      [ctx.id, ctx.params.id]
    );

    ctx.body = {
      success: true,
      data: result[0][0]?.count > 0,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "查询收藏状态失败",
      error: error.message,
    };
  }
});

module.exports = router;
