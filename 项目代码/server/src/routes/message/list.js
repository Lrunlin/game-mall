const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/message", auth(), async ctx => {
  try {
    const { senderId, receiverId } = ctx.query;

    // 查询聊天记录并联表查询发送者和接收者的额外信息
    const chatHistory = await db.query(
      `SELECT m.id, m.send_id, m.receive_id, m.content, m.create_time, m.is_read, m.picture, u1.name AS sender_name, u1.avatar AS sender_avatar, u2.name AS receiver_name, u2.avatar AS receiver_avatar 
       FROM message m 
       INNER JOIN user u1 ON m.send_id = u1.id 
       INNER JOIN user u2 ON m.receive_id = u2.id 
       WHERE (m.send_id = ? AND m.receive_id = ?) OR (m.send_id = ? AND m.receive_id = ?) 
       ORDER BY m.create_time ASC`,
      [senderId || ctx.id, receiverId || ctx.id, receiverId || ctx.id, senderId || ctx.id]
    );
    let user_id = senderId != ctx.id ? receiverId : senderId;

    let [user_data] = await db.query(`select * from user where id=?`, [user_id]);

    ctx.body = {
      success: true,
      data: { message: chatHistory[0], user_data: user_data[0] },
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "查询聊天记录失败",
      error: error.message,
    };
  }
});

module.exports = router;
