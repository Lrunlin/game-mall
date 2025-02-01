// 变量别名
const moduleAlias = require("module-alias");
moduleAlias.addAlias("@", __dirname);
let Koa = require("koa");
const app = new Koa();
let staticFiles = require("koa-static");
let Body = require("koa-bodyparser");
let cors = require("@koa/cors");
app.use(staticFiles("public"));
app.use(cors());
app.use(Body());

let getAllRouter = require("@/modules/getAllRouter");
(async () => {
  // console.log((await getAllRouter()).length);
  (await getAllRouter()).forEach(item => {
    app.use(require(item).routes());
  });
})();

const port = 3000;

const http = require("http");
const server = http.createServer(app.callback()); //包装app保证http和socket监听同一端口
module.exports = {
  server,
};
require("@/socket/index");

server.listen(port, function () {
  console.log(`项目运行于: ${port} 端口`);
});
