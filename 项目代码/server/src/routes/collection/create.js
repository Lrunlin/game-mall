const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const id = require("@/utils/id");
const router = new Router();

router.post("/collection", auth(), async ctx => {
  try {
    const { item_id, } = ctx.request.body;

    // 检查是否已经收藏
    const existingCollection = await db.query(
      "SELECT id FROM collection WHERE user_id = ? AND item_id = ?",
      [ctx.id, item_id]
    );

    if (existingCollection[0]?.length > 0) {
      ctx.body = {
        success: false,
        message: "商品已经被收藏过了",
      };
      return;
    }

    // 插入收藏到数据库
    const result = await db.query(
      "INSERT INTO collection (id, user_id, item_id, create_time) VALUES (?, ?, ?, NOW())",
      [id(), ctx.id, item_id]
    );

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "商品收藏成功",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "商品收藏失败",
      error: error.message,
    };
  }
});

module.exports = router;
