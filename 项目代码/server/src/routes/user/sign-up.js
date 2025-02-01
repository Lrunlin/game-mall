const Router = require("koa-router");
const db = require("@/db");
const router = new Router();
const id = require("@/utils/id");

router.post("/user", async ctx => {
  try {
    const { name, email, password, avatar } = ctx.request.body;

    const [repeat] = await db.query(`select count(id) from user where email=?`, [email]);
    if (repeat[0]["count(id)"]) {
      ctx.body = {
        success: false,
        message: "已有重复邮箱",
      };
      return;
    }

    const result = await db.query(
      `INSERT INTO user (id,name, email, password,avatar, create_time) VALUES (?, ?, ?,?,?, NOW())`,
      [id(), name, email, password, avatar]
    );

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "注册成功",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "注册失败",
    };
  }
});

module.exports = router;
