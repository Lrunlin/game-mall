const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const id = require("@/utils/id");
const router = new Router();

router.post("/notice/history", auth(), async ctx => {
  try {
    const userId = ctx.id;
    const { noticeIds } = ctx.request.body;

    // 遍历通知ID数组，逐个添加通知历史记录
    for (const noticeId of noticeIds) {
      // 检查通知历史记录是否已存在
      const [existingHistory] = await db.query(
        "SELECT * FROM notice_history WHERE user_id = ? AND notice_id = ?",
        [userId, noticeId]
      );

      if (!existingHistory.length) {
        // 创建通知历史记录
        await db.query("INSERT INTO notice_history (id, user_id, notice_id) VALUES (?, ?, ?)", [
          id(),
          userId,
          noticeId,
        ]);
      }
    }

    ctx.body = {
      success: true,
      message: "成功添加通知历史记录",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "添加通知历史记录失败",
    };
  }
});

module.exports = router;
