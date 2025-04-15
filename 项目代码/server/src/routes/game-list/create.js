const Router = require("koa-router");
const db = require("@/db");
const { id } = require("lodash-toolkit");

const router = new Router();

router.post("/game", async ctx => {
  try {
    const { name, icon } = ctx.request.body;

    const [result] = await db.query(
      `INSERT INTO game_list (id, name, icon, create_time) VALUES (?, ?, ?, NOW())`,
      [id(), name, icon]
    );

    ctx.body = {
      success: !!result?.affectedRows,
      message: "添加成功",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "添加失败",
    };
  }
});

module.exports = router;
