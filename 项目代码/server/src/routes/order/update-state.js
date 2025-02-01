const Router = require("koa-router");
const db = require("@/db");
const router = new Router();
const auth = require("@/modules/auth");

router.put("/order/state/:id", auth(), async ctx => {
  try {
    const orderId = ctx.params.id; // 获取订单ID

    // 更新订单状态为已完成
    const updateQuery = `
      UPDATE orders
      SET state = ${ctx.request.body.state}
      WHERE id = ${orderId}
    `;
    await db.query(updateQuery);

    ctx.body = {
      success: true,
      message: "已收货",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "更新订单状态失败",
      error: error.message,
    };
  }
});

module.exports = router;
