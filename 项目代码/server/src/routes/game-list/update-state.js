const Router = require("koa-router");
const db = require("@/db");

const router = new Router();

router.put("/game/state/:id", async ctx => {
  try {
    const gameId = ctx.params.id;
    const { state } = ctx.request.body;

    // 检查游戏是否存在
    const [existingGame] = await db.query(`SELECT * FROM game_list WHERE id = ?`, [gameId]);

    if (!existingGame) {
      ctx.body = {
        success: false,
        message: "游戏不存在",
      };
      return;
    }

    // 更新游戏状态
    await db.query(`UPDATE game_list SET state = ? WHERE id = ?`, [state, gameId]);

    ctx.body = {
      success: true,
      message: "游戏状态更新成功",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "更新游戏状态失败",
    };
  }
});

module.exports = router;
