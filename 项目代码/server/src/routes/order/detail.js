const Router = require("koa-router");
const db = require("@/db");
const router = new Router();
const auth = require("@/modules/auth");

router.get("/order/:orderId",auth(), async ctx => {
  try {
    const orderId = ctx.params.orderId;

    const [result] = await db.query(`SELECT * FROM orders WHERE id = ?`, [orderId]);

    if (result.length === 0) {
      ctx.body = {
        success: false,
        message: "订单不存在",
      };
    } else {
      ctx.body = {
        success: true,
        data: result[0],
      };
    }
  } catch (error) {
    ctx.body = {
      success: false,
      message: "查询订单信息失败",
      error: error.message,
    };
  }
});

module.exports = router;
