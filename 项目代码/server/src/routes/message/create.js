const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const { id } = require("lodash-toolkit");
const io = require("@/socket/index");

const router = new Router();

router.post("/message", auth(), async ctx => {
  try {
    const { receive_id, content, picture } = ctx.request.body;

    let _id = id();
    // 插入聊天记录到数据库
    const result = await db.query(
      `INSERT INTO message (id,send_id, receive_id,picture, content, create_time) VALUES (?,?,?,?, ?, NOW())`,
      [_id, ctx.id, receive_id, picture, content]
    );

    // 返回最新记录
    const [chatHistory] = await db.query(
      `SELECT m.id, m.send_id, m.receive_id, m.content, m.create_time, m.is_read, m.picture, u1.name AS sender_name, u1.avatar AS sender_avatar, u2.name AS receiver_name, u2.avatar AS receiver_avatar 
       FROM message m 
       INNER JOIN user u1 ON m.send_id = u1.id 
       INNER JOIN user u2 ON m.receive_id = u2.id 
       WHERE m.id=?
       ORDER BY m.create_time ASC`,
      [_id]
    );

    io.to(+receive_id).emit("message", chatHistory[0]);

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "聊天记录创建成功",
      data: chatHistory[0],
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "聊天记录创建失败",
      error: error.message,
    };
  }
});

module.exports = router;
