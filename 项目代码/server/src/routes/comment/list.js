const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/comment/:article_id", auth(), async ctx => {
  try {
    const [list] = await db.query(`select * from comment where article_id=? and reply is null;`, [
      ctx.params.article_id,
    ]);

    // 为用户设置用户名和头像
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const [user] = await db.query(`select name,id,avatar from user where id=?;`, [item.user_id]);
      list[index].user_data = user[0];
      list[index].children = [];
    }

    // 回复
    const [reply] = await db.query(
      `select * from comment where article_id=? and reply is not null order by create_time asc;`,
      [ctx.params.article_id]
    );
    for (let index = 0; index < reply.length; index++) {
      // 为用户设置用户名和头像
      const item = reply[index];
      const [user] = await db.query(`select name,id,avatar from user where id=?;`, [item.user_id]);
      reply[index].user_data = user[0];
      // 设置二级回复以及底层回复
      list.forEach((_item, index, array) => {
        let result = [_item, ..._item.children].find(el => el.id == item.reply);
        if (result) {
          list[index].children.push(
            Object.assign(item, {
              reply_data: { id: result.user_data.id, name: result.user_data.name },
            })
          );
        }
      });
    }


    ctx.body = {
      success: true,
      message: "文章中的评论列表",
      data: list,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "文章中的评论列表查询失败",
      error: error.message,
    };
  }
});

module.exports = router;
