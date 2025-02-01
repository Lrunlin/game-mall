const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const id = require("@/utils/id");

const router = new Router();

router.post("/arbitrate", auth(), async ctx => {
  try {
    const { order_id, plaintiff_content, reason_pic } = ctx.request.body;
    const plaintiff_id = ctx.id; // 当前登录用户即为原告

    // 检查参数是否完整
    if (!order_id || !plaintiff_content || !reason_pic) {
      ctx.body = { success: false, message: "缺少参数" };
      return;
    }

    let [order_data] = await db.query(`select commodity_data from orders where id=?`, [order_id]);

    // 插入新的仲裁记录到数据库
    const _id = id(); // 生成新的记录ID
    const result = await db.query(
      `INSERT INTO arbitrate (id, order_id, plaintiff_id, plaintiff_content, reason_pic, create_time,defendant_id)
       VALUES (?, ?, ?, ?, ?, NOW(),?)`,
      [
        _id,
        order_id,
        plaintiff_id,
        plaintiff_content,
        JSON.stringify(reason_pic),
        order_data[0].commodity_data.user_id,
      ]
    );
    await db.query(
      `UPDATE orders 
       SET state = 2 
       WHERE id = ?`,
      [order_id]
    );
    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "仲裁记录创建成功",
      data: {
        id: _id,
        order_id,
        plaintiff_id,
        plaintiff_content,
        reason_pic,
      },
    };
  } catch (error) {
    console.error(error);
    ctx.body = { success: false, message: "仲裁记录创建失败", error: error.message };
  }
});

module.exports = router;
