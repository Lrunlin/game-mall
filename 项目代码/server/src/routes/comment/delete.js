const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.delete("/comment/:id", auth(), async ctx => {
  try {
    const id = ctx.params.id;

    let IDList = [+id]; //被删除的ID数组
    async function fun(id) {
      const [result] = await db.query(`select id from comment where reply=?`, [id]);
      if (result.length) {
        for (let index = 0; index < result.length; index++) {
          const item = result[index];
          IDList.push(item.id);
          await fun(item.id);
        }
      }
    }
    await fun(id);
    const [result] = await db.query(
      `
      DELETE FROM comment
      WHERE id IN (?);
      `,
      [IDList]
    );
    ctx.body = {
      success: !!result?.affectedRows,
      message: !!result?.affectedRows ? "删除成功" : "删除",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "删除失败",
      error: error.message,
    };
  }
});

module.exports = router;
