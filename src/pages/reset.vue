<template>
  <div class="mylogin h100">
    <div class="login h100">
      <div class="common_head" style="text-align:center;">
        <span class="back" @click="goback" style="font-size:1rem;">&lt;</span>
        <span>{{content}}</span>
      </div>
      <form>
        <div v-if="content=='重置账号'" class="form-area">
          <div class="form-box">
            <i class="iconfont iconwode"></i>
            <input
              type="text"
              placeholder="请设置新用户名"
              required="required"
              name="username"
              v-model="userName1"
            >
          </div>
          <br>
          <div class="form-box">
            <i class="iconfont iconwode"></i>
            <input
              type="text"
              placeholder="再次输入新用户名"
              required="required"
              name="username"
              v-model="userName2"
            >
          </div>
          <br>
          <div class="two-btns">
            <input type="button" @click="checkUser" value="完成">
            <div class="clear"></div>
          </div>
        </div>
        <div v-if="content=='重置密码'" class="form-area">
          <div class="form-box">
            <i class="iconfont iconerweima"></i>
            <input type="text" placeholder="请设置新密码" required="required" name="pwd" v-model="pwd1">
          </div>
          <br>
          <div class="form-box">
            <i class="iconfont iconerweima"></i>
            <input type="text" placeholder="再次输入新密码" required="required" name="pwd" v-model="pwd2">
          </div>
          <br>
          <div class="two-btns">
            <input type="button" @click="checkPwd" value="完成">
            <div class="clear"></div>
          </div>
        </div>
      </form>
      <input class="check_btn" type="hidden" id="chkRememberPass" name="chkRememberPass" checked>
      <div :class="[classbg, classFade]" ref="bg">
        <div class="modal" id="myModal" tabindex="2" role="dialog" aria-labelledby="myModalLabel">
          <div class="modal-dialog">
            <div class="modal-content fadeIn">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" @click="closemodel">&times;</button>
                <h4 class="modal-title" id="myModalLabel">提示</h4>
              </div>
              <div class="modal-body">
                <span>{{notice_info}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { setCookie } from "../js/setcookie.js";
import axios from "axios";
import "../js/init.js";
export default {
  computed: mapState({
    user_name: state => state.user_name
  }),
  data() {
    return {
      userName1: "",
      userName2: "",
      pwd1: "",
      pwd2: "",
      classbg: "bg",
      classFade: "",
      notice_info: "用户名错误或者不存在！",
      info_hide: "hide",
      direct: "direct",
      pl2: "pl2",
      content: ""
    };
  },
  created() {
    // this.pwd = setCookie.setInfo().mypwd;
    this.content = this.$route.query.content;
    this.classFade = "hide";
  },
  methods: {
    closemodel: function() {
      this.classFade = "hide";
      this.$router.push("/person_center");
    },
    checkUser() {
      this.notice_info = "用户名错误或者不存在！";
      var name1 = this.userName1;
      var name2 = this.userName2;
      var self = this; //很关键
      if (name1 != "" && name2 != "" && name1 == name2) {
        axios({//检查所有用户名,通过遍历判断用户名是否被注册
          method: "post",
          url: "http://47.98.140.212:1811/registry/check",
          timeout: 3000
        }).then(function(response) {
          var i;
          var flag = "noExist";
          for (i in response.data) {
            if (name2 == response.data[i].username) {
              flag = "Exist";
            }
          }
          if (flag == "Exist") {
            self.notice_info = "用户名已被注册";
            self.classFade = "";
          } else if (flag == "noExist") {
            axios({//用户名不存在则更新用户名表和博客表的用户信息
              method: "post",
              url: "http://47.98.140.212:1811/update",
              data: {
                oldName: setCookie.getCookieValue("userName"),
                newName: name2
              },
              timeout: 3000
            })
              .then(function(response) {
                let { msg } = response.data;
                if (msg == "true") {
                  //重新设置cookie
                  var cookie_name = unescape(setCookie.setInfo().name); //获得cookie的name
                  var cookie_pwd = unescape(setCookie.setInfo().mypwd); //获得cookie的name
                  if (
                    (cookie_name != name2 &&
                      name2 != "" &&
                      cookie_name != "") ||
                    cookie_name == ""
                  ) {
                    setCookie.getInfo(self.userName2, cookie_pwd);
                    setCookie.userLogin();
                    self.notice_info = "账号修改成功！";
                  } else if (
                    cookie_name == name2 &&
                    name2 != "" &&
                    cookie_name != ""
                  ) {
                    self.notice_info = "账号修改成功！";
                  }
                }
                self.classFade = "";
              })
              .catch(function(error) {
                console.log(error);
                self.classFade = "";
                self.notice_info =
                  "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
              });
          }
        });
      } else {
        self.classFade = "";
      }
    },
    checkPwd() {
      this.notice_info = "密码错误或者不存在！";
      var pwd1 = this.pwd1;
      var pwd2 = this.pwd2;
      var self = this; //很关键
      if (pwd1 != "" && pwd2 != ""&& pwd1 == pwd2) {
        axios({
          method: "post",
          url: "http://47.98.140.212:1811/update",
          data: {
            oldPwd: setCookie.getCookieValue("userPass"),
            newPwd: pwd2
          },
          timeout: 3000
        })
          .then(function(response) {
            let { msg } = response.data;
            if (msg == "true") {
              //重新设置cookie
              var cookie_name = unescape(setCookie.setInfo().name); //获得cookie的name
              var cookie_pwd = unescape(setCookie.setInfo().mypwd); //获得cookie的name
              if (
                (cookie_pwd != pwd2 && pwd2 != "" && cookie_pwd != "") ||
                cookie_pwd == ""
              ) {
                setCookie.getInfo(cookie_name,self.pwd2 );
                setCookie.userLogin();
                self.notice_info = "密码修改成功！";
              } 
            }
            self.classFade = "";
          })
          .catch(function(error) {
            console.log(error);
            self.classFade = "";
            self.notice_info =
              "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
          });
      } else {
        self.classFade = "";
      }
    },
    goback() {
      this.$router.back();
    }
  }
};
//使用scoped属性可以保证样式只在该组件中起作用
</script>
<style scoped lang="scss">
.login {
  z-index: 2;
  background: rgb(235, 235, 235);
  height: 100%;
}

.login .form-area {
  width: 100%;
  padding-top: 2rem;
  text-align: center;
}

.login .login-icon {
  display: inline-block;
  width: 6%;
  vertical-align: middle;
}

.login .two-btns {
  width: 12rem;
  margin: 0 auto;
  margin-top: 0.4rem;
}

.login input[type="text"] {
  width: 12rem;
  height: 1.6rem;
  font-size: 0.6rem;
  padding: 0 1.8rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  color: #000;
  font-family: auto;
}

.login input[type="password"] {
  width: 12rem;
  height: 1.6rem;
  font-size: 0.6rem;
  padding: 0 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  color: #000;
  font-family: "Exo", sans-serif;
  margin-top: 1rem;
  font-family: auto;
}

.login input[type="button"],
.login input[type="submit"] {
  width: 100%;
  height: 1.6rem;
  font-size: 0.6rem;
  line-height: 1.2rem;
  background: #58dad3;
  border: 1px solid #fff;
  cursor: pointer;
  border-radius: 2px;
  color: #fff;
  font-family: "Exo", sans-serif;
}

.login input[type="button"]:active {
  opacity: 0.6;
}

.login input[type="submit"]:active {
  opacity: 0.6;
}

.login input[type="text"]:focus {
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.login input[type="password"]:focus {
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.login input[type="button"]:focus {
  outline: none;
}

::-webkit-input-placeholder {
  color: #000;
}

.form-box {
  position: relative;
  .iconwode,
  .iconerweima {
    position: absolute;
    font-size: 1rem;
    top: 0.34rem;
    left: 2.4rem;
  }
}

::-moz-input-placeholder {
  color: #000;
}

.footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #000000;
  height: 2rem;
  z-index: 555;
  text-align: center;
  color: #fff;
  font-size: 0.7rem;
  letter-spacing: 0.3rem;
  line-height: 2rem;
}

.footer a {
  color: #fff;
  text-decoration: none;
}

.pl2 {
  padding-left: 2rem;
}

.direct {
  padding: 0 1.5rem;
}
</style>
