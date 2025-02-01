const Router = require("koa-router");
const db = require("@/db");

const router = new Router();

router.get("/commodity/list/search", async ctx => {
  try {
    const { keyword } = ctx.query;

    // 执行搜索，根据商品名称或描述包含关键词的条件进行查询
    const [searchResults] = await db.query(
      `
          SELECT
        p.*,
        u.id AS user_id,
        u.name AS user_name,
        u.avatar AS user_avatar,
        gl.id AS game_list_id,
        gl.name AS game_name,
        gl.icon AS game_icon,
         COUNT(c.id) AS collection_count
      FROM
        commodity p
      LEFT JOIN
        user u ON p.user_id = u.id
      LEFT JOIN
        game_list gl ON p.game_type = gl.id
      LEFT JOIN
        collection c ON p.id = c.item_id
      WHERE
        p.name LIKE ? OR p.description LIKE ? and p.inventory>0
      ORDER BY
        p.create_time DESC
    `,
      [`%${keyword}%`, `%${keyword}%`]
    );

    ctx.body = {
      success: true,
      data: searchResults,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "搜索失败",
    };
  }
});

module.exports = router;
