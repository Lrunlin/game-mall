const Router = require("koa-router");
const db = require("@/db"); // 假设有一个 db 模块用于执行数据库操作
const auth = require("@/modules/auth");
const router = new Router();
const id = require("@/utils/id");

router.post("/notice", auth(), async ctx => {
  try {
    const { title, content, isTop } = ctx.request.body;

    // 检查参数是否完整
    if (!title || !content) {
      ctx.body = {
        success: false,
        message: "参数不完整",
      };
      return;
    }

    // 在数据库中插入通知记录
    const insertNoticeQuery = `
      INSERT INTO notice (id,title, content, isTop, create_time)
      VALUES (?,?, ?,  ?, NOW())
    `;
    const [insertResult] = await db.query(insertNoticeQuery, [id(), title, content, isTop]);

    ctx.body = {
      success: true,
      message: "通知添加成功",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "通知添加失败",
      error: error.message,
    };
  }
});

module.exports = router;
