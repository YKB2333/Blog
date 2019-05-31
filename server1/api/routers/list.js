const Router = require('koa-router');
const db = require('../db');
// 创建路由
var router = new Router();


/**
 * ctx
 */
router.get('/:alldiaryList',async (ctx,next)=>{
    let {alldiaryList}=ctx.params;
    // let {attributeId} = ctx.query;
    if(alldiaryList=="all"){//所有博客
        var res = await db.find2("bloglist",{});
            // console.log(res)
            ctx.body = res
    }else if(alldiaryList=="person"){
        let {author} = ctx.query;
        console.log(author)
        var res = await db.find("bloglist",{author});
        // console.log(res)
        ctx.body = res
    }else if(alldiaryList=="search"){//更具关键字查询
        let {keyword} = ctx.query;
        var reg = new RegExp(keyword,"gi");//正则
        var res = await db.find("bloglist",{$or:[{"title":reg},{"author":reg},{"content":reg}]});//字符中含有keyword
        ctx.body = res
    }else if(alldiaryList=="single"){
        let {id} = ctx.query;
        id=id*1
        var res = await db.find("bloglist",{id});
        ctx.body = res
    }else if(alldiaryList=="singledelete"){
        let {id} = ctx.query;
        id=id*1
        var res = await db.find("bloglist",{id});
        ctx.body = res
    }else if(alldiaryList=="commentGet"){
        let {type_id} = ctx.query;
        var res = await db.find("commentlist",{type_id});
        // console.log(res)
        ctx.body = res
    }else if(alldiaryList=="sensitiveGet"){
        var res = await db.find("sensitive");
        // console.log(res)
        ctx.body = res
    }

})
router.post('/:alldiaryList',async (ctx,next)=>{
    // console.log(ctx.request.body)
    let {alldiaryList}=ctx.params;
    if(alldiaryList=="commentOn"){
        // let {type_id} = ctx.query;
        let commentObj = ctx.request.body; 
        var res1 = await db.find("sensitive");
        res1.forEach(function(item){
            var reg = new RegExp(item.sensitive,"gi");
            commentObj.comment_message = commentObj.comment_message.replace(reg,"**");
        })
        var res = await db.insert("commentlist",commentObj);
        // console.log(res)
        ctx.body = res
    }
})

module.exports = router;
