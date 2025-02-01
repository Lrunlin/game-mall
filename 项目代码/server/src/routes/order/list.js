const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/order", auth(), async ctx => {
  try {
    let query = `SELECT o.id, o.user_id, u.name AS user_name, u.avatar AS user_avatar,o.commodity_data, o.payment_method, o.notes, o.state, o.create_time 
       FROM orders o 
       INNER JOIN user u ON o.user_id = u.id 
      `;

    // 查询订单列表并联表查询用户信息

    if (ctx.query.user) {
      query += ` where o.user_id=${ctx.query.user_id || ctx.id}`;
    }
    query += ` ORDER BY o.create_time DESC `;

    const orders = await db.query(query);

    ctx.body = {
      success: true,
      data: orders[0],
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "查询订单列表失败",
      error: error.message,
    };
  }
});

module.exports = router;
