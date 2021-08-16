<script>
import Vue from 'vue';

export default {
  onLaunch: function () {
    uni.getSystemInfo({
      success: function (e) {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.ScreenHeight = e.screenHeight;
        Vue.prototype.ScreenWidth = e.screenWidth;

        if (e.platform == 'android') {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        ;
        // #endif
        // #ifdef MP-WEIXIN
        Vue.prototype.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        Vue.prototype.Custom = custom;
        Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        Vue.prototype.ScreenHeight = e.screenHeight;
        Vue.prototype.ScreenWidth = e.screenWidth;
        // #endif
        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;

        Vue.prototype.ScreenHeight = e.screenHeight;
        Vue.prototype.ScreenWidth = e.screenWidth;
        // #endif
      }
    })
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style>
@import url("colorui/main.css");
@import url("colorui/icon.css");
/*每个页面公共css */
</style>
