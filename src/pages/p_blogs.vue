<template>
  <div class="main">
    <commonhead></commonhead>
    <h1>个人博客</h1>
    <ul class="bg_brown">
      <li v-for="(item, index) in items" v-if="index < page_num" class="infoList">
        <div class="user_info_show" style="position:relative;">
          <div class="fl">
            <span class="message_author">标题</span>
            </br>
          </div>
          <div class="elbutton" type="text" @click="open(item.id)">
            <i class="iconfont iconshezhi"></i>
          </div>
          <div class="clear"></div>
        </div>
        <div style="margin-bottom: .5rem; overflow:;">
          <a class="message_info" @click.stop="gocontent(item.id)">{{ item.title }}</a>
          <div class="fr msg">
            <img style="vertical-align: middle;" src="../assets/img/message_icon.png" class="w100"><span>{{item.comment_len}}</span>
          </div>
        </div>
        <div :class="[text_right,icon_hide]">
          <div class="message_icon">
            <span class="message_date fr">{{ item.date}}</span>
          </div>
        </div>
      </li>
      <li class="nullLi" v-if="blogShow">...你的博客是空的...</li>
    </ul>
    <div class="loadingbox" ref="loadingbox">
      <img src="../assets/img/loading.gif" class="w100 loading">
    </div>
  </div>
</template>

<script>
import { setCookie } from "../js/setcookie.js";
import { gettime } from "../js/getTime.js";
import axios from "axios";
import { MessageBox } from "mint-ui";
import "mint-ui/lib/style.css";
import commonhead from "../components/common_head.vue";
var rocker = require("../../server/sqlMap.js");

export default {
  data() {
    return {
      visible: false,
      message_info: "",
      author: "",
      date: "",
      items: "",
      list_total: "",
      page_num: "",
      classbg: "bg",
      classFade: "hide",
      errinfo: "",
      loading_pic: "loading_pic",
      text_right: "text-right",
      icon_hide: "",
      hidden: "hide",
      up_pic: "up_pic",
      up_isShow: "hidden",
      blogShow:false
    };
  },
  components: {
    commonhead,
    MessageBox
  },
  created() {
    var message_info = this.message_info;
    this.author = unescape(setCookie.setInfo().name);
    var author_info = this.author;
    var currentdate = gettime.gettimer();
    var self = this;
    var flag = 0;
    window.onscroll = function() {
      var scrollTopjs =
        document.documentElement.scrollTop ||
        window.pageYOfset ||
        document.body.scrollTop;
      var scrollHeightjs = document.body.scrollHeight;
      var windowHeightjs = document.documentElement.clientHeight;
      var opt = $("#myselect").val();
      var nowName = self.author;
      if (scrollTopjs > 800) {
        self.up_isShow = "";
      } else {
        self.up_isShow = "hidden";
      }
      if (scrollTopjs > 60) {
        self.isFix = "beFix";
      } else {
        self.isFix = "beRelative";
      }
      // console.log(scrollTopjs,windowHeightjs,scrollHeightjs)
      if (Math.round(scrollTopjs) + windowHeightjs == scrollHeightjs) {
        if (self.page_num < self.list_total) {
          self.hidden = "";
          flag += 8;
          var remainder = self.list_total - self.page_num;
          if (remainder >= 8) {
            self.page_num += 8;
          } else {
            self.page_num += remainder;
          }
          axios({
            method: "get",
            url: "http://47.98.140.212:1811/List/commentGet",
            data: {},
            timeout: 3000
          })
            .then(function(response) {
              var length = response.data.length;
              for (var i = 0; i < length; i++) {
                var name = response.data[i].userid;
                var time = response.data[i].create_time;
                var content = response.data[i].comment_message;
                var msg_id = response.data[i].msg_id;
                var floor =
                  $(".reward_list")
                    .eq(msg_id - 1)
                    .children().length + 1;
                var obj =
                  "<li style='padding: 0.8rem 0.5rem;border: 1px solid #cdcdcd;margin: 0 21px 10px;list-style-type: none;'>" +
                  "<span class='name'>" +
                  name +
                  "</span>" +
                  "<span style='padding: 0 0.5rem;'>|</span>" +
                  "<span class='time'>" +
                  time +
                  "</span>" +
                  "<span class='floor' style='background-color: #CDCDCD;float: right;padding: 0.1rem 0.5rem;border-radius: 15%;'>" +
                  floor +
                  "#" +
                  "</span>" +
                  "</br>" +
                  "<span class='content' style='padding-top: 0.5rem;display: inline-block;'>" +
                  content +
                  "</span>" +
                  "</li>";
                if (msg_id > flag) {
                  $(".reward_list")
                    .eq(msg_id - 1)
                    .append(obj);
                }
              }
            })
            .catch(function(error) {
              console.log(error);
              self.classFade = "";
              self.errinfo =
                "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
            });
        } else {
          if ($(".endInfo").length == 0) {
            var obj =
              "<span class='endInfo' style='width: 100%; display: block;text-align: center; font-size: 0.8rem;padding: 0.5rem 0;'>别拉了，已经加载完了!</span>";
            $(".bg_brown").append(obj);
          }
        }
      } else {
        self.hidden = "hide";
      }
    };
    if (this.author == "") {
      this.classFade = "";
      this.$router.push("login");
    } else {
      axios({
        method: "get",
        url: "http://47.98.140.212:1811/list/person?author=" + author_info,
        timeout: 3000
      })
        .then(function(response) {
          self.$refs.loadingbox.style.display = "none";//关闭加载图标
          if(response.data.length>0){//如果返回的博客数组的长度大于0则显示列表
              self.items = response.data;
              self.list_total = response.data.length;
              var list_total = self.list_total;
              if (self.list_total >= 8) {
                self.page_num = 8;
              } else {
                self.page_num = self.list_total;
              }
          }else{//没有显示提示
              self.blogShow = true
          } 
          
        })
        .catch(function(error) {
          self.classFade = "";
          self.errinfo = "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
        });
    }
  },
  methods: {
    closemodel: function() {
      this.classFade = "hide";
    },
    goTop: function() {
      $("html,body").animate({ scrollTop: "0px" }, 200);
    },
    open(val) {
      var self = this;
      MessageBox.confirm("此操作将永久删除该文章, 是否继续??").then(
        action => {
          axios({
            method: "post",
            url: "http://47.98.140.212:1811/blog/delete",
            data: {
              id:val,
            },
            timeout: 3000
          })
          .then(function(response) {
            if (response.status == "200") {//删除博客数组中含有当前id的对象
              for(var i=0;i<self.items.length;i++){
                if((self.items[i].id.toString()).indexOf(val)>-1){
                    self.items.splice(i,1);
                  }
            }
              window.location.reload()
            } else {
              self.classFade = "";
              self.errinfo = "删除失敗，未知的错误！";
            }
          })
          .catch(function(error) {
            console.log(error);
            self.classFade = "";
            self.errinfo =
              "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
          });
        }
      );
    },
    gocontent(id) {
      this.$router.push({
        name: "d_edit",
        params: { id }
      });
    }
  }
};
</script>
<style scoped lang="scss">
@import "../assets/css/p_blogs.css";
body {
  background-color: #e4e4e4;
}

.hide {
  display: none;
}

.bg {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 1;
  -moz-opacity: 0.7;
  opacity: 0.7;
  filter: alpha(opacity=70);
}
.w100 {
  width: 36%;
  margin-right: 0.2rem;
}

.main {
  height: 100%;
  background-color: #fff;
  h1 {
    font-size: 0.8rem;
    font-weight: bold;
    background-color: lightskyblue;
    margin-top: 0;
    padding-left: 0.6rem;
    line-height: 2rem;
    text-shadow: cadetblue;
    text-shadow: 8px -5px 3px #fff;
  }
}

/*加载图标*/
.loadingbox{
    position: absolute;
    z-index: 9999;
    top: 3.5rem;
    height: 82.3%;
    width: 100%;
    background: #fff;
}
.loading{
    position: absolute;
    width: 14%;
    top: 5rem;
    bottom: 0;
    right: 0;
    left: 0;
    margin: 0 auto;
}

.bg_brown {
  li {
    padding-left: 0.6rem;
    border-bottom: 0.01rem solid #ccc;
    .message_author {
      line-height: 1.5rem;
    }
    .elbutton {
      position: absolute;
      top: .4rem;
      right: 0;
      margin-right: 0.6rem;
    }
    i {
      font-size: 0.8rem;
    }
  }
  .nullLi{
    height:4rem;
    line-height: 4rem;
    font-size: 1rem;
    text-align: center;
    color:rgb(155, 148, 148);
  }
}

.msg {
  width: 2rem;
  float: right;
}
.text-right {
  text-align: right;
  margin-right: 0.5rem;
  margin-top: 0.1rem;
}
.message_icon {
  width: 42%;
  display: inline-block;
  padding-bottom: 2%;
  margin-right: 0.2rem;
}
</style>