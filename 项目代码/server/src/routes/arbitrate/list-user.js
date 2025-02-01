const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");

const router = new Router();

router.get("/arbitrate/list/user", auth(), async ctx => {
  try {
    // 查询原告和被告是当前用户的仲裁记录，并联表查询订单信息
    const [arbitrationRecords] = await db.query(
      `
      SELECT a.*, o.*
      FROM arbitrate a
      INNER JOIN orders o ON a.order_id = o.id
      WHERE a.plaintiff_id = ? OR a.defendant_id = ?
      ORDER BY a.create_time DESC
      `,
      [ctx.id, ctx.id]
    );

    ctx.body = { success: true, data: arbitrationRecords };
  } catch (error) {
    console.error("查询仲裁记录时出错:", error);
    ctx.body = { success: false, message: "查询仲裁记录失败", error: error.message };
  }
});

module.exports = router;
