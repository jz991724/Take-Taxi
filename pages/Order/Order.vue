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
                 :refresher-triggered="loading"
                 @refresherpulling="onRefresh"
                 @scrolltolower="onFetchMoreData"
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
                {{ item.startPoint }}
              </view>
            </view>
            <view class="text-gray text-sm flex">
              <text class="margin-right-xs text-black" style="word-break: keep-all;">下车点：</text>
              <view class="text-cut">
                {{ item.endPoint }}
              </view>
            </view>
            <view class="text-gray text-sm flex margin-top-xs">
              <text class="margin-right-xs" style="word-break: keep-all;">评价：</text>
              <!-- 只读状态 -->
              <uni-rate :readonly="true" :value="item.score" :size="14"/>
            </view>
          </view>

          <view class="itemAction">
            <view class="text-xs">{{ item.useCardTime }}</view>
            <view v-if="item.useCardType" class="cu-tag bg-green light sm round">
              {{ item.useCardType }}
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
import VueMixins, {LoadMoreStatusEnum} from '../../mixins/VueMixins';
import {OrderService} from '../../services'

// order状态enum
export enum OrderStatusEnum {
  待派单,
  待接单,
  进行中,
  已结束,
  全部 = null
}

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

  loading = false;

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
    // this.spinning = false;
  }

  onAbort() {
    console.log("onAbort");
    this.spinning = false;
  }

  //当前显示的订单
  allOrders = [];
  // allOrders_temp = [{
  //   id: '01',
  //   status: OrderStatusEnum.进行中,
  //   startPoint: '昆明市盘龙区人民政府昆明市盘龙区人民政府',
  //   endPoint: '昆明市盘龙区金辰街道办事处',
  //   useCardTime: '2021-07-23 10:00:23',
  //   useCardType: '标准接机',
  //   remark: '安排39座大巴车，9点40准时到达10点出发',
  //   score: 4
  // }];

  pagination = {
    current: 1,
    pageSize: 10,
    // total: 0,
  };

  //获取数据
  fetchData(conditions = {driverPhone: '15808893828', status: this.activeTabKey}) {
    if (this.loading) {
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
    this.loading = true;


    OrderService.fetchOrderList(params, this, conditions)
        .then(({items}) => {
          this.loading = false;
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
