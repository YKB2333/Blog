<template>
  <div class="main">
    <commonhead></commonhead>
    <div :class="[message_title,isFix]">
      <span>动态列表：</span>
      <select name="myselect" id="myselect">
        <option selected value="all">全部动态</option>
      </select>
      <i class="iconfont iconsousuo fr" style="font-size:1rem;" @click="updateShow"></i>
    </div>
    <div v-show="isShow">
      <input
        style="padding-left:.5rem;width:80%;height:1.1rem;"
        type="text"
        placeholder="Search"
        ref="searchCon"
      ><input @click="search" type="button" style="width:20%;height:1.1rem;" value="搜索">
    </div>
    <ul class="bg_brown">
      <li v-for="(item, index) in items" v-if="index < page_num">
        <div class="wb-item-wrap">
          <div class="wb-item">
            <div class="card m-panel card9 f-weibo">
              <div class="card-wrap">
                <header class="weibo-top m-box">
                  <div class="m-avatar-box m-box-center">
                    <a href="/profile/2714692791" class="m-img-box">
                      <img
                        src="https://tvax2.sinaimg.cn/crop.0.0.1006.1006.180/a1ceecb7ly8fxo6wkzvb2j20ry0rywg2.jpg"
                      >
                      <i class="m-icon m-icon-goldv-static"></i>
                    </a>
                  </div>
                  <div class="m-box-dir m-box-col m-box-center">
                    <div class="m-text-box">
                      <a href="javascript:;" class>
                        <h3 class="m-text-cut h3_text">
                          {{ item.author }}
                          <i class="m-icon m-icon-vipl5"></i>
                        </h3>
                      </a>
                      <h4 class="m-text-cut">
                        <span class="time">{{ item.date}}</span>
                      </h4>
                    </div>
                  </div>
                  <div callback="follow()" class="m-add-box m-followBtn">
                    <span class="m-add-box">
                      <i class="m-font m-font-plus"></i>
                      <h4>关注</h4>
                    </span>
                  </div>
                </header>
              </div>
              <article class="weibo-main">
                <div class="card-wrap">
                  <div class="weibo-og">
                    <div class="weibo-text">
                      <a href="javascript:;" @click.stop="gocontent(item.id)">
                        <span class="surl-text">#{{ item.title }}#</span>
                      </a>
                    </div>
                    <div>
                      <div class="weibo-media-wraps weibo-media f-media media-b">
                        <ul class="m-auto-list"></ul>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <footer class="f-footer-ctrl">
                <div class="m-diy-btn m-box-center-a">
                  <img style="width:100%;" src="../assets/img/message_icon.png">
                  <h4>{{item.comment_len > 99 ? "99+" : item.comment_len}}</h4>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div :class="[up_pic,up_isShow]" @click="goTop">
      <img src="../assets/img/up.png" class="w100">
    </div>
    <div class="loadingbox" ref="loadingbox">
      <img src="../assets/img/loading.gif" class="w100 loading">
    </div>
    <commonfoot :activeIdx="0"></commonfoot>
  </div>
</template>

<script>
import { setCookie } from "../js/setcookie.js";
import { gettime } from "../js/getTime.js";
import axios from "axios";
import commonhead from "../components/common_head.vue";
import commonfoot from "../components/Footer_ykb.vue";
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
      classbg: "bg",
      classFade: "hide",
      errinfo: "",
      loading_pic: "loading_pic",
      hidden: true,
      reward_area: "reward_area",
      reward_hide: "hide",
      text_right: "text-right",
      icon_hide: "",
      up_pic: "up_pic",
      up_isShow: "hidden",
      message_title: "message_title",
      isFix: "beRelative",
      isShow: false
    };
  },
  components: {
    commonhead,
    commonfoot
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
        document.body.scrollTop; //滚动条滚动的距离
      var scrollHeightjs = document.body.scrollHeight; //整个页面的高度
      var windowHeightjs = document.documentElement.clientHeight; //可视区域高度
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
          if (self.hidden) {
            //函数节流
            self.hidden = false;
            var obj =
              "<li style='height:4rem;text-align: center;'><img class='w100 loadImg' style='width: 10%;height:40%;'></li>";
            $(".bg_brown").append(obj); //加载图出现
            $(".loadImg")[0].src = require("../assets/img/loading.gif");
            setTimeout(function() {
              $(".loadImg")
                .parent("li")
                .remove();
              flag += 8;
              var remainder = self.list_total - self.page_num;
              if (remainder >= 8) {
                self.page_num += 8;
              } else {
                self.page_num += remainder;
              }
              self.hidden = true;
            }, 1000);
          }
        } else {
          if ($(".endInfo").length == 0) {
            var obj =
              "<li  class='result' style='height:4rem;''><span class='endInfo' style='width: 100%; display: block;text-align: center; font-size: 0.8rem;padding: 0.5rem 0;'>别拉了，已经加载完了!</span></li>";
            $(".bg_brown").append(obj);
          }
        }
      }
    };
    if (this.author == "") {
      this.classFade = "";
      this.errinfo = "未登录，请先登录！";
    } else {
      axios({
        method: "get",
        url: "http://47.98.140.212:1811/List/all",
        data: {},
        timeout: 3000
      })
        .then(function(response) {
          self.$refs.loadingbox.style.display = "none";//关闭加载图标
          self.items = response.data;
          self.list_total = response.data.length;
          var list_total = self.list_total;
          if (self.list_total >= 5) {
            self.page_num = 5;
          } else {
            self.page_num = self.list_total;
          }
        })
        .catch(function(error) {
          console.log(error, 1111);
          self.classFade = "";
          self.errinfo = "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
        });
    }
  },
  methods: {
    //更新搜索框显示状态
    updateShow() {
      this.isShow = !this.isShow;
    },
    gocontent(id, e) {
      this.$router.push("/content?id=" + id);
    },
    closemodel: function() {
      this.classFade = "hide";
    },
    reward: function(index) {
      $(".reward_area")
        .eq(index)
        .removeClass("hide");
      $(".message_icon")
        .eq(index)
        .addClass("hide");
    },
    comment: function(index) {
      var name = this.author;
      var time = gettime.gettimer();
      var content = $(".reward_input")
        .eq(index)
        .val();
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
        "<span class='content' style='padding-top: 0.5rem;display: inline-block;'>" +
        content +
        "</span>" +
        "</li>";
      axios({
        method: "post",
        url: "api/user/commentOn",
        data: {
          userid: name,
          msg_id: msg_id,
          comment_message: content,
          create_time: time
        },
        timeout: 3000
      })
        .then(function(response) {
          // console.log(response.data)
        })
        .catch(function(error) {
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
    search: function() {
      var self = this;
      $(".result")
        .remove();
      axios({
        method: "get",
        url:
          "http://47.98.140.212:1811/List/search?keyword=" +
          self.$refs.searchCon.value,
        timeout: 3000
      })
        .then(function(response) {
          // console.log(response.data)
          self.items = response.data;
          self.list_total = response.data.length;
          var list_total = self.list_total;
          if (self.list_total >= 5) {
            self.page_num = 5;
          } else {
            self.page_num = self.list_total;
          }
        })
        .catch(function(error) {
          console.log(error, 1111);
          self.classFade = "";
          self.errinfo = "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
        });
    },
    goTop: function() {
      $("html,body").animate(
        {
          scrollTop: "0px"
        },
        200
      );
    }
  }
};
</script>
<style scoped src="../assets/css/m_edit.css"></style>

