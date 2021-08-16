//搜索页面
<template>
  <view>
    <cu-custom bgColor="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">地址搜索</block>
    </cu-custom>
    <uni-search-bar style="width: 100%;"
                    :radius="100"
                    placeholder="请输入关键字"
                    :value="keyword"
                    class="bg-white nav text-center fixed"
                    :style="[{top:(CustomBar) + 'px'}]"
                    @clear.stop="onClearSearch"
                    @input.stop="onInputChange"></uni-search-bar>

    <view style="margin: 59px 0 10px;">
      <view class="cu-list menu-avatar"
            v-for="item in keywordsCompletionItems">
        <view class="cu-item" :key="item.id" @tap.stop="emitChecked(item)">
          <view class="cu-avatar round sm"
                style="background-image:url('../../static/location_icon.png');"></view>
          <view class="content">
            <view class="text-grey">{{ item.title || '' }}</view>
            <view class="text-gray text-sm flex">
              <view class="text-cut">
                <text class="cuIcon-infofill text-red  margin-right-xs"></text>
                {{ item.address || '' }}
              </view>
            </view>
            <view class="text-cut text-gray text-sm" v-if="item.category">类别：{{ item.category }}</view>
          </view>
          <!--              <view class="action">-->
          <!--                <view class="text-grey text-xs">22:20</view>-->
          <!--                <view class="cu-tag round bg-grey sm">5</view>-->
          <!--              </view>-->
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import VueMixins from '../../../mixins/VueMixins.ts';

@Component({
  name: 'Search',
})
export default class Search extends Mixins(VueMixins) {
  keyword = null;
  //关键字补全
  keywordsCompletionItems = [];

  //触发关键词输入提示事件
  getKeywordsCompletion(keyword = this.keyword) {
    this.keywordsCompletionItems = [];
    if (keyword) {
      uni.showLoading({title: '加载中...'});
      //调用关键词提示接口
      this.$qqmapsdk.getSuggestion({
        //获取输入框值并设置keyword参数
        keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
        region: '昆明', //设置城市名，限制关键词所示的地域范围，非必填参数
        success: (res) => {//搜索成功后的回调
          console.log(res);
          let {data, status} = res;
          if (status === this.qqMapsSDKStatusEnum.success) {
            this.keywordsCompletionItems = data || [];
          }
        },
        fail: (error) => {
          uni.showToast({
            title: error.message,
            icon: 'error',
            duration: 2000,
          });
          console.error(error);
        },
        complete: (res) => {
          uni.hideLoading();
          console.log(res);
        }
      });
    }
  };

  //清空关键字
  onClearSearch() {
    this.keyword = null;
    this.keywordsCompletionItems = [];
  }

  //输入信息变化
  onInputChange(inputVal) {
    this.getKeywordsCompletion(inputVal);
  }

  created() {
    const info = uni.getSystemInfoSync();
    console.log(info);
    this.maxHeight = info.screenHeight - info.windowTop;
  }

  emitChecked(item) {
    uni.$emit('targetInfo_map', item);
    // uni.$emit('keywordsCompletionItems_map', {keywordsCompletionItems: this.keywordsCompletionItems});
    uni.navigateBack();
  }

  onLoad(option) {
    let {keyword} = option;
    this.keyword = keyword || null;
  }
}
</script>

<style>

</style>
