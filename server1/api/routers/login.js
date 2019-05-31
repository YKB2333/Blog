const Router = require('koa-router');

const db = require('../db');

// 创建路由
var router = new Router();

/**
 * ctx
 */
router.post('/', async (ctx, next) => {

    // 解构
    let { username, pwd} = ctx.request.body;
    pwd = pwd*1;//把得到的密码装换成整型
    let res = await db.find('user', { username, pwd}); 
    res = res[0];//res就是你查询得到用户的所有信息
    if (res) {
        ctx.body = [{
                // code: 1,
                msg: 'success',
                //把用户名，与权限值返回主页
                user_name: res.username,
                user_pwd: res.pwd,
            }
        ]
    } else {
        ctx.body = {
            code: "1",
            msg: 'fail'
        }
    }

})

module.exports = router;