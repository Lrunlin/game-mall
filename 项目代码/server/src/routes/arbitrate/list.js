const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");

const router = new Router();

router.get("/arbitrate/:order_id", auth(), async ctx => {
  try {
    const { order_id } = ctx.params;

    // 查询仲裁列表
    const [arbitrations] = await db.query(
      `
      SELECT a.*, o.*
      FROM arbitrate a
      LEFT JOIN orders o ON a.order_id = o.id
      WHERE a.order_id = ?
      `,
      [order_id]
    );

    ctx.body = { success: true, data: arbitrations };
  } catch (error) {
    console.error(error);
    ctx.body = { success: false, message: "查询仲裁列表失败", error: error.message };
  }
});

module.exports = router;
