import Vue from 'vue'
import App from './App.vue'
import login from './pages/login.vue'       //登录
import content from './pages/blogcon.vue'   //博客内容
import register from './pages/register.vue' //注册
import d_edit from './pages/d_edit.vue'     //博客发表
import p_center from './pages/p_center.vue' //个人中心
import p_blogs from './pages/p_blogs.vue'   //个人博客列表
import d_show from './pages/diary_show.vue' //首页
import reset from './pages/reset.vue'       //重置账号密码界面
import $ from 'jquery'
import './assets/js/bootstrap.min.js'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
// import ElementUI from "element-ui"
import store from './store'
import './assets/font/font-icon/iconfont.css'//引入icon图标

// 注册组件
Vue.use(VueResource)
Vue.use(VueRouter)
// Vue.use(ElementUI)



// 路由
const routes = [{
        path: '/',
        name:"login",
        component: login
    },
    {
        path: '/content',
        name:"content",
        component: content
    },
    {
        path: '/login',
        name:"login",
        component: login
    },
    {
        path: '/register',
        name:"register",
        component: register
    },
    {
        path: '/diary/d_edit',//发表
        name:"d_edit",
        component: d_edit
    },
    {
        path: '/person_center',//个人中心
        name:"p_center",
        component: p_center
    },
    {
        path: '/person_blogs',//个人博客列表
        name:"p_blogs",
        component: p_blogs
    },
    {
        path: '/diary/diary_show',//动态列表,可以显示所有动态,加个搜索框给他
        name:"d_show",
        component: d_show
    },
    {
        path: '/reset',//动态列表,可以显示所有动态,加个搜索框给他
        name:"reset",
        component: reset
    }
]
const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})
new Vue({
        router,
        components: {
            app: App
        },
        store,
        render: h => h(App)
    }).$mount('#app')
    // router.start(App, '#app');