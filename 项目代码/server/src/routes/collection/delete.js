const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.delete("/collection/:id", auth(), async ctx => {
  try {

    // 删除收藏记录
    const result = await db.query("DELETE FROM collection WHERE user_id = ? AND item_id = ?", [
      ctx.id,
      ctx.params.id,
    ]);

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "商品收藏已取消",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "取消商品收藏失败",
      error: error.message,
    };
  }
});

module.exports = router;
