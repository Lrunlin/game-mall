const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");

const router = new Router();

router.get("/arbitrate/:order_id", auth(), async ctx => {
  let order_id = ctx.params.order_id;
  try {
    // 查询原告和被告是当前用户的仲裁记录，并联表查询订单信息
    const [arbitrationRecords] = await db.query(
      `
      SELECT a.*, o.*
      FROM arbitrate a
      INNER JOIN orders o ON a.order_id = o.id
      WHERE a.order_id = ? 
      ORDER BY a.create_time DESC
      `,
      [order_id]
    );

    if (arbitrationRecords.length) {
      let data = arbitrationRecords[0];
      let [plaintiff_data] = await db.query(`select * from user where id=?`, [data.plaintiff_id]);
      let [defendant_data] = await db.query(`select * from user where id=?`, [data.defendant_id]);
      arbitrationRecords[0].plaintiff_data = plaintiff_data;
      arbitrationRecords[0].defendant_data = defendant_data;
    }

    ctx.body = { success: true, data: arbitrationRecords[0] };
  } catch (error) {
    console.error("查询仲裁记录时出错:", error);
    ctx.body = { success: false, message: "查询仲裁记录失败", error: error.message };
  }
});

module.exports = router;
