/**
* @描述: 登录页面
* @作者:
* @创建时间: 2021-07-27 17:37:36
*/
<template>
  <view>
    <view class="header">
      <!--      <image src="/static/img/public/login-wx.png"></image>-->
    </view>
    <view class="content">
      <view>申请获取以下权限</view>
      <text>获得你的公开信息(昵称，头像、地区等)</text>
    </view>
    <button class="bottom" type="primary" @tap="wxGetUserInfo">
      授权登录
    </button>

    <!--    <button open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber"></button>-->

    <button open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">唤起授权</button>
  </view>
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import VueMixins from '../../mixins/VueMixins.ts';

@Component({
  name: 'Login'
})
export default class Login extends Mixins(VueMixins) {
  sessionKey = '';
  openId = '';
  userInfo = {
    avatarUrl: '',
    city: '',
    country: '',
    gender: 0,
    language: '',
    nickName: '',
    province: '',
  };
  pageOption = {};

  // 第一授权获取用户信息 ===》按钮触发
  wxGetUserInfo() {
    // 1.获取用户的信息
    uni.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别',
      success: (infoRes) => {
        debugger
        console.log('登录信息：', infoRes);
        this.userInfo = infoRes.userInfo;

        // 用户信息写入缓存
        uni.showToast({title: '登录成功'});
        uni.setStorageSync('user_id', new Date().toString());
        uni.setStorageSync('user_nickName', this.userInfo.nickName);
        uni.setStorageSync('user_avatarUrl', this.userInfo.avatarUrl);
        uni.setStorageSync('user_nu', new Date().toString());

        uni.switchTab({url: '../Home/Home'})

        // 2.提交数据到后台、写入数据库
        // uni.request({
        //   url: _self.apiServer + 'appletsUserInfo',
        //   data: {
        //     openid: _self.openId,
        //     avatarUrl: _self.userInfo.avatarUrl,
        //     city: _self.userInfo.city,
        //     country: _self.userInfo.country,
        //     gender: _self.userInfo.gender,
        //     language: _self.userInfo.language,
        //     nickName: _self.userInfo.nickName
        //   },
        //   method: 'POST',
        //   success: res => {
        //     if (res.data.code != 0) {
        //       uni.showToast({
        //         title: res.data.msg,
        //         icon: 'none'
        //       });
        //       return false;
        //     }
        //     // 用户信息写入缓存
        //     uni.showToast({ title: '登录成功' });
        //     uni.setStorageSync('user_id', res.data.res.u_id);
        //     uni.setStorageSync('user_nm', res.data.res.u_nickName);
        //     uni.setStorageSync('user_fa', res.data.res.u_avatarUrl);
        //     uni.setStorageSync('user_nu', res.data.res.u_regtime);
        //     // 然后跳回原页面
        //     if (_self.pageOption.backtype == 1) {
        //       uni.redirectTo({ url: _self.pageOption.backpage });
        //     } else {
        //       uni.switchTab({ url: _self.pageOption.backpage });
        //     }
        //   },
        //   fail: () => {
        //     uni.showToast({
        //       title: '用户信息操作失败',
        //       icon: 'none'
        //     });
        //   }
        // });
      },
      fail: (e) => {
        debugger
        uni.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
    return false;
  }

  // 登录
  login() {
    debugger
    // 0. 显示加载的效果
    uni.showLoading({
      title: '登录中...'
    });

    // 1. wx 获取登录用户 code
    uni.login({
      provider: 'weixin',
      success: loginRes => {
        debugger
        console.log(loginRes);
        this.js_code = loginRes.code;
        // 2. 将用户登录code传递到后台置换用户SessionKey、OpenId等信息
        uni.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          method: 'GET',
          data: {
            appid: this.appid, //你的小程序的APPID
            secret: this.secret, //你的小程序的secret,
            js_code: this.js_code, //wx.login 登录成功后的code
            grant_type: 'authorization_code'
          },
          success: codeRes => {
            debugger
            console.log(codeRes);
            this.openId = codeRes.data.openid;
            this.sessionKey = codeRes.data.session_key;

            // 用户信息写入缓存
            uni.showToast({title: '登录成功'});
            uni.setStorageSync('user_id', new Date().toString());
            uni.setStorageSync('user_nickName', this.userInfo.nickName);
            uni.setStorageSync('user_avatarUrl', this.userInfo.avatarUrl);
            uni.setStorageSync('user_nu', new Date().toString());
            uni.switchTab({url: '/pages/Home/Home'});
            // 隐藏loading
            uni.hideLoading();

            // 3.通过 openId 判断用户是否授权
            // uni.request({
            //   url: _self.apiServer + 'loginApplets',
            //   data: {
            //     openid: _self.openId
            //   },
            //   method: 'POST',
            //   success: openIdRes => {
            //     console.log(openIdRes);
            //     // 隐藏loading
            //     uni.hideLoading();
            //     // 还没授权登录、请先授权然后登录
            //     if (openIdRes.data.code == 1) {
            //       // 提示消息、让用户授权
            //       uni.showToast({
            //         title: openIdRes.data.msg,
            //         icon: 'none'
            //       });
            //     }
            //     // 已经授权了、查询到用户的数据了
            //     if (openIdRes.data.code == 0) {
            //       // 用户信息写入缓存
            //       uni.showToast({ title: '登录成功' });
            //       uni.setStorageSync('user_id', openIdRes.data.res.u_id);
            //       uni.setStorageSync('user_nm', openIdRes.data.res.u_nickName);
            //       uni.setStorageSync('user_fa', openIdRes.data.res.u_avatarUrl);
            //       uni.setStorageSync('user_nu', openIdRes.data.res.u_regtime);
            //       // 然后跳回原页面
            //       if (_self.pageOption.backtype == 1) {
            //         uni.redirectTo({ url: _self.pageOption.backpage });
            //       } else {
            //         uni.switchTab({ url: _self.pageOption.backpage });
            //       }
            //     }
            //   },
            //   fail: () => {
            //     uni.showToast({
            //       title: '获取授权信息失败',
            //       icon: 'none'
            //     });
            //     return false;
            //   }
            // });
          },
          fail: () => {
            uni.showToast({
              title: '获取 SesssionKey OpenId 失败',
              icon: 'none'
            });
            return false;
          }
        });
      },
      fail: () => {
        uni.showToast({
          title: '获取 code 失败',
          icon: 'none'
        });
        return false;
      }
    });
    return false;
  }

  onGetPhoneNumber(e) {
    debugger
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") {       //用户决绝授权
      debugger
      //拒绝授权后弹出一些提示

    } else {      //允许授权
      debugger
      console.log(e.detail.encryptedData)
      e.detail.encryptedData      //加密的用户信息
      e.detail.iv     //加密算法的初始向量  时要用到
    }
  }

  onLoad(options) {
    debugger
    // 接收跳转的参数
    this.pageOption = options;
    //默认加载
    // this.login();
  }
}
</script>

<style>

</style>
