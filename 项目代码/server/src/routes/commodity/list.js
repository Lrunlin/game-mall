const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/commodity", auth(), async ctx => {
  try {
    let query = `SELECT * FROM commodity WHERE 1=1`;

    // 如果存在 ctx.query.state，要求 state 是 ctx.query.state
    if (ctx.query.state !== undefined) {
      query += ` AND state = ${ctx.query.state}`;
    }

    if (ctx.query.game !== undefined) {
      query += ` AND game_type = ${ctx.query.game}`;
    }

    if (ctx.query.user_id !== undefined) {
      query += ` AND user_id = ${ctx.query.user_id}`;
    }

    if (ctx.query.user !== undefined) {
      query += ` AND user_id = ${ctx.id}`;
    }

    if (ctx.query.inventory) {
      query += ` AND inventory>0`;
    }

    // 执行数据库查询
    const [result] = await db.query(query);

    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "查询失败",
    };
  }
});

module.exports = router;
