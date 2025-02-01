const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const id = require("@/utils/id");
const router = new Router();

router.post("/order", auth(), async ctx => {
  try {
    const { commodity_id, payment_method, notes, count } = ctx.request.body;

    // 查询商品信息
    const [commodity] = await db.query(`SELECT * FROM commodity WHERE id = ? AND state = 1`, [
      commodity_id,
    ]);

    // 检查商品是否存在并且库存是否充足
    if (commodity?.length === 0) {
      ctx.body = {
        success: false,
        message: "商品已下架",
      };
      return;
    }

    const commodityInfo = commodity[0];
    if (commodityInfo.inventory < count) {
      ctx.body = {
        success: false,
        message: "商品库存不足",
      };
      return;
    }

    // 插入订单到数据库
    const result = await db.query(
      `INSERT INTO orders (id, user_id, commodity_data, payment_method, notes, state, create_time) 
       VALUES (?, ?, ?, ?, ?, 0, NOW())`,
      [
        id(),
        ctx.id,
        JSON.stringify({ ...commodityInfo, count: count }),
        `${payment_method}:${id()}`,
        notes,
      ]
    );

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "订单创建成功",
    };

    if (result[0]?.affectedRows) {
      await db.query(`UPDATE commodity SET inventory = inventory - ${count} WHERE id = ?`, [commodity_id]);
    }
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "订单创建失败",
      error: error.message,
    };
  }
});

module.exports = router;
