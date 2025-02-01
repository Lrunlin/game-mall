const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/user-list", auth(), async ctx => {
  try {
    const query = `
      SELECT * from user  ORDER BY create_time DESC;
    `;

    const [result] = await db.query(query);

    for (let index = 0; index < result.length; index++) {
      const item = result[index];
      let [order] = await db.query(`select * from orders where user_id=?`, [item.id]);
      let [article] = await db.query(`select * from article where user_id=?`, [item.id]);
      result[index].order_data = order;
      result[index].article_data = article;
    }

    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "查询用户列表失败",
      error: error.message,
    };
  }
});

module.exports = router;
