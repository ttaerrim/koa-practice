const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();

// 첫 번째는 path, 두 번째는 라우트 처리할 함수 전달
router.get("/", (ctx) => {
  ctx.body = "home";
});
router.get("/about/:name?", (ctx) => {
  const { name } = ctx.params;
  ctx.body = name ? `${name}의 소개` : "소개";
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log("listening to port 4000");
});
