const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.put("/commodity/:id", auth(), async ctx => {
  try {
    const { name, description, cover, banner, price, inventory, game_type, tags } =
      ctx.request.body;
    const id = ctx.params.id;

    // // 检查参数是否完整
    // if (
    //   !id ||
    //   !name ||
    //   !description ||
    //   !cover ||
    //   !banner ||
    //   !price ||
    //   !inventory ||
    //   !game_type ||
    //   !tags
    // ) {
    //   ctx.body = { success: false, message: "缺少参数" };
    //   return;
    // }

    // 更新商品信息
    const result = await db.query(
      `UPDATE commodity 
       SET name = ?, description = ?, cover = ?, banner = ?, price = ?, inventory = ?, game_type = ?, tags = ? 
       WHERE id = ?`,
      [
        name,
        description,
        cover,
        JSON.stringify(banner),
        price,
        inventory,
        game_type,
        JSON.stringify(tags),
        id,
      ]
    );

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "商品更新成功",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "商品更新失败",
      error: error.message,
    };
  }
});

module.exports = router;
