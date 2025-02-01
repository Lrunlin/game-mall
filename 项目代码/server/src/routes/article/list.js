const Router = require("koa-router");
const db = require("@/db");
const router = new Router();
const auth = require("@/modules/auth");

router.get("/article", auth(), async ctx => {
  try {
    let query = `
      SELECT * FROM article WHERE state = 1
    `;

    if (ctx.query.user) {
      query += ` and user_id=${ctx.id}`;
    }

    let [articles] = await db.query(query);

    for (const article of articles) {
      let [userData] = await db.query(`select * from user where id=?`, [article.user_id]);
      // 否则，将用户信息添加到文章数据中
      article.user_data = {
        id: userData[0].id,
        name: userData[0].name,
        email: userData[0].email,
        avatar: userData[0].avatar,
      };

      let [comment] = await db.query(`select count(id) as count from comment where article_id=?`, [
        +article.id,
      ]);
      article.comment_count = comment[0].count;

      if (article.game_id) {
        const [commodity] = await db.query(`SELECT * FROM game_list WHERE id = ?`, [
          article.game_id,
        ]);
        article.game_data = commodity[0];
      }
    }

    ctx.body = {
      success: true,
      data: articles,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "查询文章列表失败",
      error: error.message,
    };
  }
});

module.exports = router;
