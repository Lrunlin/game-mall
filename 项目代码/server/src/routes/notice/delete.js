const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.delete("/notice/:id", auth(), async ctx => {
  try {
    const noticeId = ctx.params.id;

    // 删除 notice_history 记录
    await db.query(`DELETE FROM notice_history WHERE notice_id = ${noticeId}`);

    // 删除 notice 记录
    await db.query(`DELETE FROM notice WHERE id = ${noticeId}`);

    ctx.body = {
      success: true,
      message: "公告删除成功",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "公告删除失败",
      error: error.message,
    };
  }
});

module.exports = router;
