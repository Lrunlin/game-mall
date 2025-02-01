const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/commodity/recommend/list", auth(), async ctx => {
  try {
    // 查询商品列表，联表查询发布者信息以及相应的游戏详细信息
    const [products] = await db.query(`
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
    p.state = 1 AND p.inventory > 0
GROUP BY
    p.id
ORDER BY
    p.create_time DESC;
    `);

    ctx.body = {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "查询商品列表失败",
    };
  }
});

module.exports = router;
