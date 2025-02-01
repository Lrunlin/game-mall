const Router = require("koa-router");
const db = require("@/db");
const router = new Router();

router.get("/article/:id", async ctx => {
  const [article] = await db.query(
    `SELECT
  *
FROM
  article where id=? and state=1;
`,
    [ctx.params.id]
  );

  if (article.length) {
    if (article[0].game_id) {
      // 如果存在商品 ID，则联表查询商品信息
      const [commodity] = await db.query(`SELECT * FROM game_list WHERE id = ?`, [
        article[0].game_id,
      ]);
      article[0].game = commodity[0];
    }

    const [user] = await db.query(`SELECT * FROM user WHERE id = ?`, [
      article[0].user_id,
    ]);

    // 否则，将用户信息添加到文章数据中
    article[0].user_data = {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      avatar: user[0].avatar,
    };
  }

  ctx.body = {
    success: !!article.length,
    data: article[0],
  };
});

module.exports = router;
