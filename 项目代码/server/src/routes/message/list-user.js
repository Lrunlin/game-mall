const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");

const router = new Router();

// 聊天列表
router.get("/message/user/list", auth(), async ctx => {
  try {
    const [messages] = await db.query(
      `
      SELECT m.*, u.name AS sender_name, u.avatar AS sender_avatar,
             r.name AS receiver_name, r.avatar AS receiver_avatar
      FROM message m
      LEFT JOIN user u ON m.send_id = u.id
      LEFT JOIN user r ON m.receive_id = r.id
      WHERE m.send_id = ? OR m.receive_id = ?
      ORDER BY m.create_time DESC
      `,
      [ctx.id, ctx.id]
    );

    let list = [];
    messages.forEach(item => {
      if (!list.some(_item => item.receive_id == ctx.id || item.send_id == ctx.id)) {
        let user_data = {
          id: item.receive_id == ctx.id ? item.send_id : item.receive_id,
          name: item.receive_id == ctx.id ? item.sender_name : item.receiver_name,
          avatar: item.receive_id == ctx.id ? item.sender_avatar : item.receiver_avatar,
        };
        list.push({ ...item, user_data: user_data });
      }
    });
    ctx.body = { success: true, data: list };
  } catch (error) {
    console.error(error);
    ctx.body = { success: false, data: [] };
  }
});

module.exports = router;
