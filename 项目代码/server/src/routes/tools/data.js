const Router = require("koa-router");
const db = require("@/db");

let router = new Router();

router.get("/statistics", async ctx => {
  const [totalUsers] = await db.query("SELECT COUNT(*) AS totalUsers FROM user");
  const [totalArticle] = await db.query("SELECT COUNT(*) AS totalArticle FROM article");
  const [totalOrders] = await db.query("SELECT COUNT(*) AS totalOrders FROM orders");
  const [totalCommodity] = await db.query("SELECT COUNT(*) AS totalCommodity FROM commodity");

  const [ordersLast7Days] = await db.query(`
    SELECT
      DATE(create_time) AS orderDate,
      COUNT(*) AS orderCount
    FROM
      orders
    WHERE
      create_time >= NOW() - INTERVAL 7 DAY
    GROUP BY
      orderDate
    ORDER BY
      orderDate
  `);

  ctx.body = {
    success: true,
    data: {
      totalArticle: totalArticle[0].totalArticle,
      totalUsers: totalUsers[0].totalUsers,
      totalOrders: totalOrders[0].totalOrders,
      totalCommodity: totalCommodity[0].totalCommodity,
      ordersLast7Days,
    },
  };
});

module.exports = router;
