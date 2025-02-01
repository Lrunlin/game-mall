const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/notice", auth(), async ctx => {
  try {
    const { auth, id } = ctx;

    let query = `
      SELECT 
       *
      FROM 
        notice`;

    const [notices] = await db.query(query);

    if (auth == "user") {
      for (let index = 0; index < notices.length; index++) {
        const item = notices[index];
        let [history] = await db.query(`select * from notice_history where notice_id=?`, [item.id]);
        notices[index].is_read = !!history.length;
      }
      notices.sort((a, b) => {
        // 首先按照 isTop 进行排序，isTop 为 true 的排在前面
        if (a.isTop && !b.isTop) {
          return -1;
        } else if (!a.isTop && b.isTop) {
          return 1;
        } else {
          // 如果 isTop 属性相同，则按照实际顺序排序
          return a.value - b.value;
        }
      });
    }

    ctx.body = {
      success: true,
      data: notices,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "查询通知列表失败",
      error: error.message,
    };
  }
});

module.exports = router;
