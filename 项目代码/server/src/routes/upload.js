let Router = require("koa-router");
let multer = require("@koa/multer");
let fs = require("fs");
let { v4 } = require("uuid");
let router = new Router();

let uploadOption = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: 1024 * 1024 * 10, //5MB
  },
});
router.post("/static", uploadOption.single("image"), async ctx => {
  try {
    let buffer = ctx.file.buffer;
    let fileName = `${v4().replace(/-/g, "")}.${ctx.file.originalname.split(".").slice(-1)[0]}`;
    fs.writeFileSync(`public/${fileName}`, buffer);
    ctx.body = { success: true, message: "上传成功", data: fileName };
  } catch (error) {
    ctx.body = { success: false, message: "上传错误" };
  }
});
module.exports = router;
