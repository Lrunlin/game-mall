const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");

const router = new Router();

// 更新被告信息
router.put("/arbitrate/defendant/:order_id", auth(), async ctx => {
  try {
    const { order_id } = ctx.params;
    const { defendant_content, defendant_pic } = ctx.request.body;

    // 更新仲裁记录的被告信息
    const result = await db.query(
      `UPDATE arbitrate 
       SET defendant_content = ?, defendant_pic = ? 
       WHERE order_id = ?`,
      [defendant_content, JSON.stringify(defendant_pic), order_id]
    );

    ctx.body = { success: true, message: "仲裁记录修改成功" };
  } catch (error) {
    console.error("修改仲裁记录时出错:", error);
    ctx.body = { success: false, message: "仲裁记录修改失败", error: error.message };
  }
});

module.exports = router;
