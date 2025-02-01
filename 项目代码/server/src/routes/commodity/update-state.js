const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.put("/commodity/state/:id", auth(), async ctx => {
  const id = ctx.params.id;
  const { state } = ctx.request.body;
  const [result] = await db.query(`UPDATE commodity SET state = ? WHERE id = ?`, [state, id]);

  ctx.body = {
    success: !!result?.affectedRows,
  };
});

module.exports = router;
