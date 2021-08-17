//我的
<template>
  <scroll-view scroll-y="true">
    <view class="bg-gradual-green text-center" :style="{height:`${CustomBar+100}px`}">
      <view :style="{top:`${CustomBar+5}px`}" style="position: relative;">
        <view class="cu-avatar lg round"
              :style="getAvatarUrl"></view>
        <view class="padding-sm">
          <text class="text-cut">{{userInfo.user_nickName}}</text>
        </view>
      </view>

    </view>

    <uni-card :is-shadow="true">
      <uni-list :border="false">
        <!--全部订单-->
        <uni-list-item link to="../../pages/Order/Order">
          <template slot="header">
            <image class="slot-image" src="/static/order_icon.png" mode="widthFix"></image>
          </template>
          <text slot="body" class="slot-box slot-text">全部订单</text>
        </uni-list-item>

        <!--钱包-->
        <uni-list-item link>
          <template slot="header">
            <image class="slot-image" src="/static/wallet_icon.png" mode="widthFix"></image>
          </template>
          <text slot="body" class="slot-box slot-text">钱包</text>
        </uni-list-item>

        <!--客服电话-->
        <uni-list-item link>
          <template slot="header">
            <image class="slot-image" src="/static/customerService_icon.png" mode="widthFix"></image>
          </template>
          <text slot="body" class="slot-box slot-text" @click="onPhoneCall('18788409290')">客服电话</text>
        </uni-list-item>
      </uni-list>
    </uni-card>
  </scroll-view>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch,
  Mixins
} from 'vue-property-decorator';
import VueMixins from '../../mixins/VueMixins';
import UniCard from '../../uni_modules/uni-card/components/uni-card/uni-card.vue';

@Component({
  name: 'Mine',
  components: { UniCard }
})
export default class Mine extends Mixins(VueMixins) {
  userInfo = {user_avatarUrl: '', user_nickName: ''}

  onReady() {
    debugger
    this.userInfo.user_avatarUrl = uni.getStorageSync('user_avatarUrl');
    this.userInfo.user_nickName = uni.getStorageSync('user_nickName');
    debugger
  }

  get getAvatarUrl() {
    return {
      backgroundImage: `url(${this.userInfo.user_avatarUrl})`
    }
  }
}
</script>

<style scoped lang="less">
.slot-box {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
}

.slot-image {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  margin-right: 10px;
  width: 20px;
  height: 20px;
  //opacity: 0.3;
}

.slot-text {
  flex: 1;
  font-size: 14px;
  margin-right: 10px;
}
</style>
