const Router = require("koa-router");
const db = require("@/db");
const router = new Router();

router.get("/commodity/:id", async ctx => {
  const [result] = await db.query(`select * from commodity where id=${ctx.params.id};`);

  ctx.body = {
    success: result.length,
    data: result[0],
  };
});

module.exports = router;
