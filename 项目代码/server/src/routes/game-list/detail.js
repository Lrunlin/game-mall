const Router = require("koa-router");
const db = require("@/db");

const router = new Router();

router.get("/game/:id", async ctx => {
  try {
    const gameId = ctx.params.id;

    const [game] = await db.query(`SELECT * FROM game_list WHERE id = ?`, [gameId]);

    if (!game.length) {
      ctx.body = {
        success: false,
        message: "游戏不存在",
      };
      return;
    }

    ctx.body = {
      success: true,
      data: game[0],
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "查询游戏信息失败",
    };
  }
});

module.exports = router;
