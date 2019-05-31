<template>
  <div class="main">
    <commonhead></commonhead>
    <div class="vippage-container">
      <div class="vip-header">
        <div class="user-icon">
          <a href="###">
            <i class="iconfont iconxiaoxi"></i>
          </a>
        </div>
        <a href="###" class="user-portrati">
          <img src="../assets/img/portrait.png">
        </a>
      </div>
      <section class="ul-order">
        <ul class="ul clearfixed">
          <li class="orderCount" @click="goto('/diary/diary_show')">
            <a href="javascript:;">
              <i class="iconfont icondaishiyong"></i>
              首页
            </a>
          </li>
          <li class="orderCount" @click="goto('/diary/d_edit')">
            <a href="javascript:;">
              <i class="iconfont icondaifukuan"></i>
              博客
            </a>
          </li>
          <li class="orderCount" >
            <a href="javascript:;">
              <i class="iconfont iconlingdang"></i>
              信息
            </a>
          </li>
          <li class="orderCount" >
            <a href="javascript:;">
              <i class="iconfont icondaifukuan"></i>
              帮助
            </a>
          </li>
        </ul>
        <ul class="ul-t">
          <li @click="goto('/person_blogs')">
            <a href="javascript:;">
              <i class="iconfont icondd"></i>
              个人博客
              <span>
                <i class="iconfont iconxiangyouanniu"></i>
              </span>
            </a>
          </li>
          <li @click="alertBtn">
            <a href="javascript:;">
              <i class="iconfont iconicon--"></i>
              我的关注
              <span>
                <i class="iconfont iconxiangyouanniu"></i>
              </span>
            </a>
          </li>
          <li @click="goto({path:'/reset',query:{content:'重置账号'}})" >
            <a href="javascript:;">
              <i class="iconfont iconicon--"></i>
              重置账号
              <span>
                <i class="iconfont iconxiangyouanniu"></i>
              </span>
            </a>
          </li>
          <li @click="goto({path:'/reset',query:{content:'重置密码'}})">
            <a href="javascript:;">
              <i class="iconfont iconicon--"></i>
              重置密码
              <span>
                <i class="iconfont iconxiangyouanniu"></i>
              </span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { setCookie } from "../js/setcookie.js";
import { gettime } from "../js/getTime.js";
import axios from "axios";
import commonhead from "../components/common_head.vue";
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
      hidden: "hide",
      up_pic: "up_pic",
      up_isShow: "hidden"
    };
  },
  components: {
    commonhead: commonhead
  },
  created() {
    var message_info = this.message_info;
    this.author = unescape(setCookie.setInfo().name);
    var author_info = this.author;
    var currentdate = gettime.gettimer();
    var self = this;
    if (this.author == "") {
      this.classFade = "";
      this.$router.push("login");
      //   this.errinfo = "未登录，请登录！";
    } else {
      //   axios({
      //     method: "get",
      //     url: "api/user/messageList",
      //     data: {
      //       message_list: message_info,
      //       author: author_info,
      //       date: currentdate
      //     },
      //     timeout: 3000
      //   })
      //     .then(function(response) {
      //       self.items = response.data;
      //       self.list_total = response.data.length;
      //       if (self.list_total >= 8) {
      //         self.page_num = 8;
      //       } else {
      //         self.page_num = self.list_total;
      //       }
      //       // console.log(response.data);
      //     })
      //     .catch(function(error) {
      //       console.log(error);
      //       self.classFade = "";
      //       self.errinfo = "服務器繁忙，請刷新頁面或者稍後重試!(Error code: 504)";
      //     });
    }
  },
  methods: {
    closemodel: function() {
      this.classFade = "hide";
    },
    goTop: function() {
      $("html,body").animate({ scrollTop: "0px" }, 200);
    },
    goto(path) {
      this.$router.push(path);
    },
    alertBtn(){
      alert("功能还没开放,敬请期待")
    }
  }
};
</script>
<style scoped lang="scss">
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
  width: 70%;
}
.vippage-container {
  background-color: #f2f4f6;
}
.vippage-container a {
  text-decoration: none;
  &.user-portrati {
    img {
      margin-top: 0.81rem;
    }
  }
}
.vippage-container .vip-header {
  height: 4.8rem;
  text-align: center;

  background: url(../assets/img/top-bg.png) no-repeat 0 0;
  background-size: 100% 100%;
  position: relative;
}
.vippage-container .vip-header .user-icon {
  position: absolute;
  top: 0.43rem;
  right: 0.5rem;
}
.vippage-container .vip-header .user-icon i {
  color: #fff;
  font-size: 0.85rem;
  margin-left: 0.2rem;
}
.vippage-container .vip-header .user-portrait {
  position: absolute;
  top: 1rem;
  left: 0.8rem;
  display: block;
  width: 1.56rem;
  height: 1.56rem;
  border-radius: 100%;
  overflow: hidden;
  border: 2px solid #fff;
  background-size: 100% 100%;
}
.vippage-container .vip-header .user-portrait img {
  width: 100%;
  height: 100%;
}
.vippage-container .vip-header .user-name {
  position: absolute;
  top: 1.5rem;
  left: 2.8rem;
  color: white;
  font-size: 0.5rem;
}
.vippage-container .vip-header .user-pay {
  display: block;
  position: absolute;
  top: 1.56rem;
  right: 0.6rem;
  background-color: #fee489;
  color: #52492b;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 1.1rem;
  line-height: 0.6rem;
  padding: 0 0.23rem;
  font-size: 0.35rem;
  padding-right: 0.5rem;
}
.vippage-container .vip-header .user-pay i {
  transform: rotate(180deg);
  position: absolute;
  right: 0.05rem;
  top: 0rem;
  font-size: 0.5rem;
}
.vippage-container .vip-header .integral {
  position: absolute;
  bottom: 0.8rem;
  right: 0.6rem;
  line-height: 0.6rem;
  border-radius: 1.1rem;
  padding: 0 0.23rem;
  background-color: rgba(12, 78, 90, 0.65);
  -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  color: #fff;
  font-size: 0.35rem;
}
.vippage-container .ul-order {
  background: white;
  padding: 0;
  overflow: hidden;
  padding: 0;
  margin-bottom: 0.33rem;
}
.vippage-container .ul-order .ul {
  padding: 0.63rem 0;
  color: #333;
  text-align: center;
  overflow: hidden;
  clear: both;
  list-style: none;
  border-bottom: 0.013333rem solid #e8e8e8;
}
.vippage-container .ul-order .ul li {
  width: 25%;
  float: left;
}
.vippage-container .ul-order .ul li a {
  display: inline-block;
}
.vippage-container .ul-order .ul li a i {
  display: block;
  margin-bottom: 0.1rem;
  color: orange;
  font-size: 1rem;
}
.vippage-container .ul-order .ul li:nth-child(2) i {
  color: green;
}
.vippage-container .ul-order .ul li:nth-child(3) i {
  color: #ff1e00;
}
.vippage-container .ul-order .ul li:nth-child(4) i {
  color: #09affc;
}
.vippage-container .ul-t {
  background: white;
  position: relative;
  font-size: 0.6rem;
  color: #333;
  overflow: hidden;
}
.vippage-container .ul-t li {
  border-bottom: 0.013333rem solid #e8e8e8;
  line-height: 2.1rem;
  padding: 0 0.4rem;
}
.vippage-container .ul-t li a {
  font-size: 0.8rem;
  color: #333;
}
.vippage-container .ul-t li a > i {
  font-size: 0.85rem;
  color: #cbd6e7;
  vertical-align: middle;
  margin-right: 0.2rem;
}
.vippage-container .ul-t li a span {
  position: absolute;
  right: 0.6rem;
}
.vippage-container .ul-t li a span i {
  color: #bbb;
  font-size: 0.51rem;
  margin: 0 0 0 0.43rem;
}
.vippage-container .ul-t:last-child {
  margin-top: 0.2rem;
}

/*# sourceMappingURL=vip-message.css.map */

.main {
  height: 100%;
}

.main {
  background-color: #fff;
}
</style>