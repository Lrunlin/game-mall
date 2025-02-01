const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.put("/user", auth(), async ctx => {
  try {
    const { name, email, avatar, password } = ctx.request.body;

    // 构建 SQL 语句
    let updateFields = [];
    let values = [];

    if (name) {
      updateFields.push("name = ?");
      values.push(name);
    }

    if (email) {
      updateFields.push("email = ?");
      values.push(email);
    }

    if (avatar) {
      updateFields.push("avatar = ?");
      values.push(avatar);
    }

    if (password) {
      updateFields.push("password = ?");
      values.push(password);
    }

    if (updateFields.length === 0) {
      ctx.body = {
        success: false,
        message: "未提供任何要修改的字段",
      };
      return;
    }

    const userId = ctx.id;

    const result = await db.query(`UPDATE user SET ${updateFields.join(", ")} WHERE id = ?`, [
      ...values,
      userId,
    ]);

    if (result[0]?.affectedRows > 0) {
      ctx.body = {
        success: true,
        message: "用户信息修改成功",
      };
    } else {
      ctx.body = {
        success: false,
        message: "未找到匹配的用户记录或无权限修改",
      };
    }
  } catch (error) {
    ctx.body = {
      success: false,
      message: "用户信息修改失败",
      error: error.message,
    };
  }
});

module.exports = router;
