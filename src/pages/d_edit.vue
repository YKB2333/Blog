<template>
  <div class="main">
    <commonhead></commonhead>
    <div class="message_title">
      <span>我的动态</span>
    </div>
    <div class="me_title">
      <span>&nbsp;标题:</span>
      <input class="info_title" v-model="title" type="text">
    </div>

    <textarea type="text" v-model="message_info" class="info_area"></textarea>
    <span class="text_center btn_style">
      <button class="submit_btn" @click="written">发表</button>
      <button class="submit_btn ml2" @click="show_info">查看动态</button>
    </span>
    <div :class="[classbg, classFade]" ref="bg">
      <div class="modal" id="myModal" tabindex="2" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog">
          <div class="modal-content fadeIn">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" @click="closemodel">&times;</button>
              <h4 class="modal-title" id="myModalLabel">提示</h4>
            </div>
            <div class="modal-body">{{errinfo}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="con_id != '' " key="1" class="loadingbox" ref="loadingbox" >
      <img src="../assets/img/loading.gif" class="w100 loading">
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
      title:"",
      classbg: "bg",
      classFade: "hide",
      errinfo: "",
      con_id: ""
    };
  },
  components: {
    commonhead: commonhead
  },
  methods: {
    written: function() {
      var message_info = this.message_info;
      this.author = unescape(setCookie.setInfo().name);
      var author_info = this.author;
      var currentdate = gettime.gettimer();
      var self = this;
      if (message_info != "" && this.author != "") {
        if(this.con_id){
          //如果文章id存在,则更新数据库的对应文章
            axios({
            method: "post",
            url: "http://47.98.140.212:1811/blog/update",
            data: {
              id:self.con_id,
              diary_list: message_info,
              author: author_info,
              title:self.title,
              date: currentdate
            },
            timeout: 3000
          })
          .then(function(response) {
            
            // console.log(response);
            if (response.status == "200") {
              self.classFade = "";
              self.errinfo = "发表成功！";
            } else {
              self.classFade = "";
              self.errinfo = "发表失敗，未知的错误！";
            }
          })
          .catch(function(error) {
            console.log(error);
            self.classFade = "";
            self.errinfo =
              "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
          });
        }else{
          var con_id = new Date();
          con_id = con_id.getTime();
          axios({
          method: "post",
          url: "http://47.98.140.212:1811/blog/insert",
          data: {
              id:con_id,
              content: message_info,
              author: author_info,
              title:self.title,
              date: currentdate,
              comment_len:0
          },
          timeout: 3000
        })
          .then(function(response) {
            // console.log(response);
            if (response.status == "200") {
              self.classFade = "";
              self.errinfo = "发表成功！";
            } else {
              self.classFade = "";
              self.errinfo = "发表失敗，未知的错误！";
            }
          })
          .catch(function(error) {
            console.log(error);
            self.classFade = "";
            self.errinfo =
              "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
          });
        }
        
      } else if (this.author == "") {
        this.classFade = "";
        this.errinfo = "未登录，请登录！";
      } else if (message_info == "") {
        this.classFade = "";
        this.errinfo = "动态不能为空！";
      }
    },
    closemodel: function() {
      this.classFade = "hide";
      if (this.errinfo == "发表成功！") {
        this.$router.push("/diary/diary_show");
      }
    },
    show_info() {
      this.author = unescape(setCookie.setInfo().name);
      if (this.author == "") {
        this.classFade = "";
        this.errinfo = "未登录，请登录！";
      } else {
        this.$router.push("/diary/diary_show");
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      let { id } = this.$route.params;
      this.con_id = id;
    }
  },
  mounted() {
    //如果有传文章id过来,则是对内容进行编辑
    var self = this;
    if (self.con_id) {
      axios({
        method: "get",
        url: "http://47.98.140.212:1811/List/single?id=" + self.con_id,
        timeout: 3000
      })
        .then(function(response) {
          self.$refs.loadingbox.style.display = "none";//关闭加载图标
          self.message_info = response.data[0].content;
          self.title = response.data[0].title;
        })
        .catch(function(error) {
          console.log(error, 1111);
          self.classFade = "";
          self.errinfo = "服务器繁忙，请刷新页面或者稍后重试!(Error code: 504)";
        });
    }
  }
};
</script>
<style scoped src="../assets/css/m_edit.css"></style>