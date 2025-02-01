const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/collection", auth(), async ctx => {
  try {
    const [result] = await db.query(
      `SELECT
    c.id AS collection_id,
    c.item_id,
    c.user_id,
    c.create_time AS collection_time,
    c2.id AS commodity_id,
    c2.name AS commodity_name,
    c2.description AS commodity_description,
    c2.cover AS commodity_cover,
    c2.banner AS commodity_banner,
    c2.price AS commodity_price,
    c2.create_time AS commodity_create_time
FROM
    collection c
LEFT JOIN
    commodity c2 ON c.item_id = c2.id
WHERE
    c.user_id = ?
ORDER BY
    c.create_time DESC;
`,
      [ctx.id]
    );
    
    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "查询收藏列表",
      error: error.message,
    };
  }
});

module.exports = router;
