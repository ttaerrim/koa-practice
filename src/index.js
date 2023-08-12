const Koa = require("koa");

const app = new Koa();

// app.use 파라미터로 받는 값은 함수로, 이 함수는 하나의 미들웨어
// 미들웨어 함수에서는 두 가지 파라미터를 받음
// ctx 웹 요청과 응답 정보
// next는 현재 처리 중인 미들웨어의 다음 미들웨어를 호출 next()는 프로미스

app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log("bye");
});
app.use((ctx, next) => {
  console.log(2);
  next();
});
app.use((ctx) => {
  ctx.body = "hello world";
});

app.listen(4000, () => {
  console.log("listening to port 4000");
});
