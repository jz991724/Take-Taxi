//订单页
<template>
  <view>
    <cu-custom bgColor="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">订单</block>
    </cu-custom>

    <scroll-view scroll-x class="bg-white nav text-center solid-bottom fixed" :style="{top:`${CustomBar}px`}">
      <view class="cu-item"
            :class="item.key==activeTabKey?'text-blue cur':''"
            v-for="item in tabList"
            :key="item.key"
            @click="()=>{activeTabKey=item.key}">
        {{ item.label }}
      </view>
    </scroll-view>

    <scroll-view scroll-y="true"
                 :refresher-triggered="spinning"
                 @refresherpulling="onRefresh"
                 @scrolltolower="onFetchMoreData"
                 @refresherrestore="onRestore"
                 @refresherabort="onAbort"
                 :show-scrollbar="true"
                 :refresher-enabled="true"
                 :refresher-threshold="100"
                 :style="{height:`calc(100vh - ${CustomBar+42}px)`}"
                 style="position: relative;top: 42px;">
      <view class="cu-list menu-avatar">
        <view class="cu-item flex" v-for="item in allOrders" :key="item.id">
          <view class="itemAvatar">
            <icon :type="item.status===1?'success':'waiting'" size="26"/>
          </view>

          <view class="itemContent">
            <view class="text-gray text-sm flex">
              <text class="margin-right-xs text-black" style="word-break: keep-all;">上车点：</text>
              <view class="text-cut">
                {{ item.startAddress }}
              </view>
            </view>
            <view class="text-gray text-sm flex">
              <text class="margin-right-xs text-black" style="word-break: keep-all;">下车点：</text>
              <view class="text-cut">
                {{ item.destinationAddress }}
              </view>
            </view>
            <view class="text-gray text-sm flex margin-top-xs">
              <text class="margin-right-xs" style="word-break: keep-all;">评价：</text>
              <!-- 只读状态 -->
              <uni-rate :readonly="true" :disabled="!item.score" :value="item.score" :size="14"/>
            </view>
          </view>

          <view class="itemAction">
            <view class="text-xs">{{ item.useCarTime }}</view>
            <view v-if="item.productType" class="cu-tag bg-green light sm round">
              {{ item.productType }}
            </view>
          </view>
        </view>
      </view>
      <view class="text-center response margin-tb" v-show="spinning">{{ loadMoreStatus }}</view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Watch
} from 'vue-property-decorator';
import VueMixins, {LoadMoreStatusEnum, OrderStatusEnum} from '../../mixins/VueMixins';
import {OrderService} from '../../services'

@Component({
  name: 'Order'
})
export default class Order extends Mixins(VueMixins) {
  //当前激活的tab
  activeTabKey = null;

  tabList = [{
    label: '全部',
    key: null
  }, {
    label: '进行中',
    key: OrderStatusEnum.进行中
  }, {
    label: '已结束',
    key: OrderStatusEnum.已结束
  }, {
    label: '待派单',
    key: OrderStatusEnum.待派单
  }, {
    label: '待接单',
    key: OrderStatusEnum.待接单
  }];

  onRefresh() {
    console.log('刷新');
    this.fetchData();
  }

  onFetchMoreData() {
    console.log("更多");
    this.fetchMoreData();
  }

  onRestore() {
    console.log("onRestore");
    this.spinning = false;
  }

  onAbort() {
    console.log("onAbort");
    this.spinning = false;
  }

  //当前显示的订单
  allOrders = [];

  pagination = {
    current: 1,
    pageSize: 10,
    // total: 0,
  };

  //获取数据
  fetchData(conditions = {driverPhone: '15808893828', status: this.activeTabKey}) {
    if (this.spinning) {
      return;
    }
    this.pagination.current = 1;
    const {
      pagination: {
        current,
        pageSize,
      },
    } = this;

    const params = {
      index: current || 1,
      size: pageSize || 10,
      isAsc: true,
      orderField: undefined,
    };

    OrderService.fetchOrderList(params, this, conditions)
        .then(({items}) => {
          this.allOrders = items || [];
          debugger
        });
  }

  //加载更多数据
  fetchMoreData(conditions = {driverPhone: '15808893828', status: this.activeTabKey}) {
    this.loadMoreStatus = LoadMoreStatusEnum.more;

    this.pagination.current += 1;
    const {
      pagination: {
        current,
        pageSize,
      },
    } = this;

    const params = {
      index: current || 1,
      size: pageSize || 10,
      isAsc: true,
      orderField: undefined,
    };

    OrderService.fetchOrderList(params, this, conditions)
        .then(({items}) => {
          this.allOrders = [...this.allOrders, ...items];
          this.loadMoreStatus = LoadMoreStatusEnum.noMore;
        });

  }

  @Watch('activeTabKey', {immediate: true})
  handleActiveTabKeyChange(newVal, oldVal) {
    if (newVal !== oldVal) {
      console.log('切换');
      this.fetchData();
    }
  }

}
</script>

<style scoped lang="less">
.cu-item {
  .itemAvatar {
    width: 45px;
    padding: 0 10px;
  }

  .itemContent {
    width: calc(100vw - 65px - 60px);
  }

  .itemAction {
    width: 60px;
    margin: 0 10px;
  }
}
</style>
