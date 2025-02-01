const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");

const router = new Router();

router.get("/arbitrate/list/admin", auth(), async ctx => {
  try {
    const [arbitrateRecords] = await db.query(
      `
      SELECT a.*, 
             o.*, 
             u1.id AS plaintiff_id, 
             u1.name AS plaintiff_name, 
             u1.avatar AS plaintiff_avatar, 
             u2.id AS defendant_id, 
             u2.name AS defendant_name, 
             u2.avatar AS defendant_avatar
      FROM arbitrate a
      LEFT JOIN orders o ON a.order_id = o.id
      LEFT JOIN user u1 ON a.plaintiff_id = u1.id
      LEFT JOIN user u2 ON a.defendant_id = u2.id
      ORDER BY 
             a.winner IS NULL DESC,  /* 将 winner 为 null 的记录排前面 */
             a.create_time DESC     /* 根据创建时间倒序排列 */
    `
    );

    ctx.body = { success: true, data: arbitrateRecords };
  } catch (error) {
    console.error(error);
    ctx.body = { success: false, message: "查询失败", error: error.message };
  }
});

module.exports = router;
