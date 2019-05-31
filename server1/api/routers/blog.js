const Router = require('koa-router');
const db = require('../db');
// 创建路由
var router = new Router();


/**
 * ctx
 */
router.get('/:alldiaryList',async (ctx,next)=>{


})
router.post('/:condition',async (ctx,next)=>{
    console.log(ctx.request.body)
    let {condition}=ctx.params;
    switch(condition){
        case "update":
            var {id,diary_list,author,date,title} = ctx.request.body;
            id=id*1;
            var res = await db.update("bloglist",{id,author},{$set:{title,content:diary_list,date}});
            ctx.body = res;
            break;
        case "updateCommentLen":
            var {type_id} = ctx.request.body;
            type_id=type_id*1;
            //查找所增加评论的博客并取其评论长度进行加1
            var res1 = await db.find("bloglist",{"id":type_id});
            var comment_len = res1[0].comment_len + 1;
            //再对评论长度进行更新
            var res2 = await db.update("bloglist",{"id":type_id},{$set:{comment_len}});
            ctx.body = res2;
            break;
        case "insert":
            var res = await db.insert("bloglist",ctx.request.body);
            ctx.body = res;
            break;
        case "delete":
            var res = await db.delete("bloglist",ctx.request.body);
            ctx.body = res;
            break;
    }
})

module.exports = router;
