<template>
  <div class='main' :style="{'backgroundColor':'#fff'}">
    <commonhead></commonhead>
    <ul class='bgc_brown'>
      <li v-for="(item, index) in items" v-if="index < page_num" class='infoList'>
        <div class='user_info_show'>
          <div class='user_pic fl'>
            <img src='../assets/img/user.jpg' class='w100'>
          </div>
          <div class='fl'>
            <span class='message_author'>{{ item.author }}</span>
            </br>
            <span class='message_date'>{{ item.date}} {{item.managerRecommend}}</span>
          </div>
          <div class='clear'></div>
        </div>
        <h1 class='message_info1'>{{ item.title }} </h1>
        <pre class='message_info2'>{{ item.content }} </pre>
        <div :class="[text_right,icon_hide]">
          <div class='message_icon' @click='reward(index)'>
            <img src='../assets/img/message_icon.png' class='w100'>
          </div>
        </div>
        <div :class='[reward_area,reward_hide]'>
          <form action="">
            <input type="hidden" name="msgId" :value="item.msg_id" class='msg_id'>
            <textarea type='text' class='reward_input' placeholder="在这里评论"></textarea>
            <p class='two_btn'>
              <span class='comment_btn' @click='comment(index)'>评论</span>
              <span class='cancel_btn ml2' @click='cancel(index)'>取消</span>
            </p>
          </form>
        </div>
        <ul class='reward_list'></ul>
      </li>
    </ul>
    <div :class="[classbgc, classFade]" ref='bgc'>
      <div class="modal" id="myModal" tabindex="2" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog">
          <div class="modal-content fadeIn">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" @click='closemodel'>
                &times;
              </button>
              <h4 class="modal-title" id="myModalLabel">
                提示
              </h4>
            </div>
            <div class="modal-body">
              {{errinfo}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    setCookie
  } from "../js/setcookie.js";
  import {
    gettime
  } from "../js/getTime.js";
  import axios from "axios";
  import commonhead from "../components/common_head.vue";
  var rocker = require("../../server/sqlMap.js");
  export default {
    data() {
      return {
        message_info: "",
        author: "",
        date: "",
        items: "",
        list_total: "",
        page_num: "",
        classbgc: "bgc",
        classFade: "hide",
        errinfo: "",
        loading_pic: "loading_pic",
        hidden: "hide",
        reward_area: "reward_area",
        reward_hide: "hide",
        text_right: "text-right",
        icon_hide: "",
        up_pic: "up_pic",
        up_isShow: "hidden",
        message_title: "message_title",
        isFix: "beRelative",
        con_id:window.location.hash.slice(-13),
        sensitive:[]
      };
    },
    components: {
      commonhead: commonhead
    },
    created() {
      var message_info = this.message_info;
      this.author = unescape(setCookie.setInfo().name);
      var author_info = this.author;
      var con_id = this.con_id;
      var currentdate = gettime.gettimer();
      var self = this;
      var flag = 0;
      if (this.author == "") {
        this.classFade = "";
        this.errinfo = "未登录，请先登录！";
      } else {
        axios({
            method: "get",
            url: "http://47.98.140.212:1811/List/single?id="+con_id,
            timeout: 3000
          })
          .then(function (response) {
            console.log(response.data)
            self.items = response.data;
            self.list_total = response.data.length;
            var list_total = self.list_total;
            if (self.list_total >= 8) {
              self.page_num = 8;
            } else {
              self.page_num = self.list_total;
            }
          })
          .catch(function (error) {
            console.log(error,1111);
            self.classFade = "";
            self.errinfo = "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
          });
        axios({
            method: "get",
            url: "http://47.98.140.212:1811/List/commentGet?type_id="+con_id ,
            data: {},
            timeout: 3000
          })
          .then(function (response) {
            console.log(response)
            var length = response.data.length;
            for (var i = 0; i < length; i++) {
              var name = response.data[i].userid;
              var time = response.data[i].create_time;
              var content = response.data[i].comment_message;
              var msg_id = response.data[i].msg_id;
              var obj =
                "<li style='padding: 0.8rem 0.5rem;border: 1px solid #cdcdcd;margin: 0 0.7rem 0.5rem;list-style-type: none;'>" +
                "<span class='name'>" +
                name +
                "</span>" +
                "<span style='padding: 0 0.5rem;'>|</span>" +
                "<span class='time'>" +
                time +
                "</span>" +
                "<span class='floor' style='background-color: #CDCDCD;float: right;padding: 0.1rem 0.5rem;border-radius: 15%;'>" +
                msg_id +
                "#" +
                "</span>" +
                "</br>" +
                "<span class='content' style='padding-top: 0.5rem;display: inline-block;word-wrap:break-word;width: 100%;'>" +
                content +
                "</span>" +
                "</li>";
              $(".reward_list")
                .append(obj);
            }
          })
          .catch(function (error) {
            console.log(error);
            self.classFade = "";
            self.errinfo = "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
          });
          //拿到敏感词数据
          axios({
            method: "get",
            url: "http://47.98.140.212:1811/List/sensitiveGet",
            timeout: 3000
          })
          .then(function (response) {
            self.sensitive = response.data;
          })
          .catch(function (error) {
            console.log(error);
            self.classFade = "";
            self.errinfo = "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
          });
      }
    },
    methods: {
      closemodel: function () {
        this.classFade = "hide";
      },
      reward: function (index) {
        $(".reward_area")
          .eq(index)
          .removeClass("hide");
        $(".message_icon")
          .eq(index)
          .addClass("hide");
      },
      comment: function (index) {
        var self = this;
        var name = self.author;
        var time = gettime.gettimer();
        var content = $(".reward_input")
          .eq(index)
          .val();
        //过滤的敏感词数组
        self.sensitive.forEach(function(item){
            var reg = new RegExp(item.sensitive,"gi");
            content = content.replace(reg,"**");
        })
        var msg_id = $(".msg_id")
          .eq(index)
          .val();
        var floor =
          $(".reward_list")
          .eq(index)
          .children().length + 1;
        var obj =
          "<li style='padding: 0.8rem 0.5rem;border: 1px solid #cdcdcd;margin: 0 0.7rem 0.5rem;list-style-type: none;'>" +
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
          "<span class='content' style='padding-top: 0.5rem;display: inline-block;word-wrap:break-word ; width: 100%;'>" +
          content +
          "</span>" +
          "</li>";
        axios({//把新评论添加到数据库,并更新评论数量
            method: "post",
            url: "http://47.98.140.212:1811/List/commentOn",
            data: {
              userid: name,
              msg_id: floor,
              comment_message: content,
              create_time: time,
              type_id:self.con_id//有瑕疵
            },
            timeout: 3000
          })
          .then(function (response) {
            if(response.data.ok){//还没测试
              axios({//把新评论添加到数据库,并更新评论数量
                method: "post",
                url: "http://47.98.140.212:1811/blog/updateCommentLen",
                data: {
                  type_id:self.con_id
                },
                timeout: 3000
              })
              .then(function (response) {
                console.log(response.data)
              })
              .catch(function (error) {
                console.log(error);
                self.classFade = "";
                self.errinfo = "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
              });
            }
          })
          .catch(function (error) {
            console.log(error);
            self.classFade = "";
            self.errinfo = "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
          });
        $(".reward_list")
          .eq(index)
          .append(obj);
        $(".reward_area")
          .eq(index)
          .addClass("hide");
        $(".message_icon")
          .eq(index)
          .removeClass("hide");
        $(".reward_input")
          .eq(index)
          .val("");
      },
      cancel: function (index) {
        $(".reward_area")
          .eq(index)
          .addClass("hide");
        $(".message_icon")
          .eq(index)
          .removeClass("hide");
        $(".reward_input")
          .eq(index)
          .val("");
      },
    }
  };

</script>
<style scoped src="../assets/css/blogcon.css"></style>
