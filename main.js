import Vue from 'vue';
import App from './App';
import QQMapWX from 'static/js/qqmap-wx-jssdk.min';
import store from './store';

Vue.prototype.$store = store;
Vue.prototype.$qqmapsdk = new QQMapWX({
    key: 'KC7BZ-ZPH3D-FDW4E-P3YJB-OYAQQ-M6BBY'
});

import cuCustom from './colorui/components/cu-custom.vue';

Vue.component('cu-custom', cuCustom);

Vue.config.productionTip = false;

App.mpType = 'app';

// 封装全局登录函数
// backpage, backtype 2个参数分别代表：
// backpage : 登录后返回的页面
// backtype : 打开页面的类型[1 : redirectTo 2 : switchTab]
Vue.prototype.$checkLogin = function () {
    // 同步获取本地数据（uid、随机码、用户名、头像）
    let user_id = uni.getStorageSync('user_id');
    let user_nickName = uni.getStorageSync('user_nickName');
    let user_avatarUrl = uni.getStorageSync('user_avatarUrl');
    let user_fa = uni.getStorageSync('user_fa');
    if (!(user_id && user_nickName && user_avatarUrl)) {
        // 使用重定向的方式跳转至登录页面
        // uni.redirectTo({ url: '../login/login?backpage=' + backpage + '&backtype=' + backtype });
        // uni.redirectTo({ url: '../Home/Home' });
        uni.redirectTo({
            url: '../Login/Login', success: (e) => {
                debugger
            }, fail: (e) => {
                debugger
            }
        })
        return false;
    }
    // 登录成功、已经登录返回数组 [用户 id, 用户随机码, 用户昵称, 用户表情]
    return {
        user_id,
        user_nickName,
        user_avatarUrl,
        user_fa
    };
};
// 定义一个全局的请求地址
Vue.prototype.$apiServer = 'http://101.34.73.117:8088';
uni.setStorageSync('$apiServer', 'http://101.34.73.117:8088');

const app = new Vue({
    ...App
});
app.$mount();
