const Router = require('koa-router');

const db = require('../db');

// 创建路由
var router = new Router();


/**
 * ctx
 */
router.post('/:condition',async (ctx,next)=>{
    // 解构
    // let {username,password,gender} = ctx.request.body;
    let {condition} = ctx.params;
    switch(condition){
        case "check":
            var res = await db.find('user');
            ctx.body = res;
            break;
        case "register":
            var {username,pwd} = ctx.request.body;
            pwd=pwd*1;
            var res = await db.insert('user',{username,pwd});
            ctx.body = res;
            break;
    }
    // let data = {username,password,gender,regtime:Date.now()}
    

    
    // 存入数据库

})

// 判断用户名是否存在
// router.get('/',async (ctx,next)=>{
//     let {username} = ctx.query;

//     let res = await db.find('user',{username});console.log(ctx.query,username,res)

//     if(res.length>0){
//         ctx.body = 'no'
//     }else{
//         ctx.body = 'yes'
//     }
// })

module.exports = router;