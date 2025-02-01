const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const id = require("@/utils/id");
const router = new Router();

router.post("/commodity", auth(), async ctx => {
  try {
    const { name, description, cover, banner, price,  inventory, game_type,  tags } =
      ctx.request.body;

    // 插入商品到数据库
    const result = await db.query(
      `INSERT INTO commodity (id, name, description, cover, banner, price, create_time, state, inventory, game_type, user_id, tags) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), 1, ?, ?, ?, ?)`,
      [
        id(),
        name,
        description,
        cover,
        JSON.stringify(banner),
        price,
        inventory,
        game_type,
        ctx.id,
        JSON.stringify(tags),
      ]
    );

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "商品添加成功",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "商品添加失败",
      error: error.message,
    };
  }
});

module.exports = router;
