const Router = require('koa-router');

const db = require('../db');

// 创建路由
var router = new Router();


/**
 * ctx
 */
router.get('/:condition',async (ctx,next)=>{
    // 解构
    let {condition} = ctx.params;
    let res;
    // switch(condition){
    //     case "new":
    //         res = await db.find('find',{});
    //         break;
    //     case "superman":
    //         res = await db.find('find',{"detail.articleType":"达人游记"});
    //         break;
    //     case "official":
    //         res = await db.find('find',{"detail.articleType":"官方推荐"});
    //         break;
    //     default :
    //         res = await db.find('find',{"dests.destName":condition});
    //     break;
    // }
    ctx.body={msg:"y"};
})

router.post("/",async (ctx,next)=>{

    //传新旧用户名或密码查询数据库并更新数据
    let {oldName,newName,oldPwd,newPwd} = ctx.request.body;
    console.log(oldName,newName,oldPwd,newPwd)
    if(oldName){
        var res = await db.update('user',{"username":oldName},{$set:{"username":newName}});
        var res2 = await db.update('bloglist',{"author":oldName},{$set:{"author":newName}});
    }else if(oldPwd){
        //密码存在数据库中是整型数据
        oldPwd=oldPwd*1;
        newPwd=newPwd*1;
        var res = await db.update('user',{"pwd":oldPwd},{$set:{"pwd":newPwd}});
    }
    ctx.body={
            code:1,
            msg:"true",
            res
        }
    
})
module.exports = router;