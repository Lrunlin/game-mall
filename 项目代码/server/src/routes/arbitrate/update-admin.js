const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");

const router = new Router();

router.put("/arbitrate/admin/:order_id", auth(), async ctx => {
  try {
    const { winner, note } = ctx.request.body;
    let order_id = ctx.params.order_id;

    // 检查参数是否完整
    if (!order_id || !winner || !note) {
      ctx.body = { success: false, message: "缺少参数" };
      return;
    }

    // 更新仲裁记录
    const result = await db.query(
      `UPDATE arbitrate 
       SET winner = ?, note = ? 
       WHERE order_id = ?`,
      [winner, note, order_id]
    );

    const resultOrder = await db.query(
      `UPDATE orders 
       SET state = 1 
       WHERE id = ?`,
      [order_id]
    );

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "仲裁记录更新成功",
      data: { order_id, winner, note },
    };
  } catch (error) {
    console.error(error);
    ctx.body = { success: false, message: "仲裁记录更新失败", error: error.message };
  }
});

module.exports = router;
