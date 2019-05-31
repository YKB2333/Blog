const Koa = require('koa');
const static = require('koa-static');
const cors = require("koa-cors");
const proxy = require('koa-server-http-proxy')
const fs = require("fs")


// 路由
const routers = require('./api/routers');

// 创建koa应用
const app = new Koa();//app.context

app.use(cors());


// 创建静态资源服务
app.use(static('./'));

// app.use(proxy('/ylbapi', {
//   target: 'https://m.yanglaoban.com',
//   pathRewrite: { '^/ylbapi': '/' },
//   changeOrigin: true
// }))


// 处理status为404或null时，完善response信息
app.use(routers.allowedMethods());
app.use(routers.routes());

// app.use((ctx,next)=>{
// 	let connect = fs.readFileSync("index.html","utf-8");
// 	ctx.status = 200;
//   ctx.type = "text/html;charset=utf-8"
//   ctx.body = connect
// })
// 监听端口
app.listen(1811,()=>{
    console.log('server is running on http://localhost:1811');
})