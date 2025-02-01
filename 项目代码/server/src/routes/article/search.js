const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/article/list/search", async ctx => {
  try {
    const { keyword } = ctx.query;

    let query = `
      SELECT
        *
      FROM
        article 
      WHERE
        state = 1 AND (title LIKE ? OR content LIKE ?)
    `;

    let [articles] = await db.query(query, [`%${keyword}%`, `%${keyword}%`]);

    articles = articles.filter(item => item.id);

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
      message: "搜索失败",
      error: error.message,
    };
  }
});

module.exports = router;
