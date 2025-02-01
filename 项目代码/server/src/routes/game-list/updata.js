const Router = require("koa-router");
const db = require("@/db");

const router = new Router();

router.put("/game/:id", async ctx => {
  try {
    const gameId = ctx.params.id;
    const { name, icon } = ctx.request.body;

    // 检查游戏是否存在
    const [existingGame] = await db.query(`SELECT * FROM game_list WHERE id = ?`, [gameId]);

    if (!existingGame) {
      ctx.body = {
        success: false,
        message: "游戏不存在",
      };
      return;
    }

    // 更新游戏信息
    await db.query(`UPDATE game_list SET name = ?, icon = ? WHERE id = ?`, [name, icon, gameId]);

    ctx.body = {
      success: true,
      message: "游戏信息更新成功",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "更新游戏信息失败",
    };
  }
});

module.exports = router;
