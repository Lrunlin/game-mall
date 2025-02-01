const Router = require("koa-router");
const db = require("@/db");

const router = new Router();

router.get("/game", async ctx => {
  let query = `SELECT * FROM game_list`;
  try {
    if (ctx.query.state) {
      query += ` where state=${ctx.query.state}`;
    }

    query += ` ORDER BY create_time DESC`;

    // 查询游戏列表
    const [games] = await db.query(query);

    ctx.body = {
      success: true,
      data: games,
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "查询游戏列表失败",
    };
  }
});

module.exports = router;
