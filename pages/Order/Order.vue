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

export enum StatusEnum {
  全部,
  完成,
  未完成
}

@Component({
  name: 'Order'
})
export default class Order extends Mixins(VueMixins) {
  //当前激活的tab
  activeTabKey = StatusEnum.全部;

  tabList = [{
    label: '全部',
    key: StatusEnum.全部
  }, {
    label: '已完成',
    key: StatusEnum.完成
  }, {
    label: '未完成',
    key: StatusEnum.未完成
  }];

  onRefresh() {
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
  allOrders_temp = [{
    id: '01',
    status: StatusEnum.完成,
    startPoint: '昆明市盘龙区人民政府昆明市盘龙区人民政府',
    endPoint: '昆明市盘龙区金辰街道办事处',
    useCardTime: '2021-07-23 10:00:23',
    useCardType: '标准接机',
    remark: '安排39座大巴车，9点40准时到达10点出发',
    score: 4
  }, {
    id: '02',
    status: StatusEnum.未完成,
    startPoint: '昆明市盘龙区人民政府',
    endPoint: '昆明市盘龙区金辰街道办事处',
    useCardTime: '2021-07-23 10:00:23',
    useCardType: '标准接机',
    remark: '安排39座大巴车，9点40准时到达10点出发',
    score: 3
  }, {
    id: '01',
    status: StatusEnum.完成,
    startPoint: '昆明市盘龙区人民政府昆明市盘龙区人民政府',
    endPoint: '昆明市盘龙区金辰街道办事处',
    useCardTime: '2021-07-23 10:00:23',
    useCardType: '标准接机',
    remark: '安排39座大巴车，9点40准时到达10点出发',
    score: 4
  }, {
    id: '02',
    status: StatusEnum.未完成,
    startPoint: '昆明市盘龙区人民政府',
    endPoint: '昆明市盘龙区金辰街道办事处',
    useCardTime: '2021-07-23 10:00:23',
    useCardType: '标准接机',
    remark: '安排39座大巴车，9点40准时到达10点出发',
    score: 3
  }, {
    id: '01',
    status: StatusEnum.完成,
    startPoint: '昆明市盘龙区人民政府昆明市盘龙区人民政府',
    endPoint: '昆明市盘龙区金辰街道办事处',
    useCardTime: '2021-07-23 10:00:23',
    useCardType: '标准接机',
    remark: '安排39座大巴车，9点40准时到达10点出发',
    score: 4
  }, {
    id: '02',
    status: StatusEnum.未完成,
    startPoint: '昆明市盘龙区人民政府',
    endPoint: '昆明市盘龙区金辰街道办事处',
    useCardTime: '2021-07-23 10:00:23',
    useCardType: '标准接机',
    remark: '安排39座大巴车，9点40准时到达10点出发',
    score: 3
  }, {
    id: '01',
    status: StatusEnum.完成,
    startPoint: '昆明市盘龙区人民政府昆明市盘龙区人民政府',
    endPoint: '昆明市盘龙区金辰街道办事处',
    useCardTime: '2021-07-23 10:00:23',
    useCardType: '标准接机',
    remark: '安排39座大巴车，9点40准时到达10点出发',
    score: 4
  }, {
    id: '02',
    status: StatusEnum.未完成,
    startPoint: '昆明市盘龙区人民政府',
    endPoint: '昆明市盘龙区金辰街道办事处',
    useCardTime: '2021-07-23 10:00:23',
    useCardType: '标准接机',
    remark: '安排39座大巴车，9点40准时到达10点出发',
    score: 3
  }, {
    id: '01',
    status: StatusEnum.完成,
    startPoint: '昆明市盘龙区人民政府昆明市盘龙区人民政府',
    endPoint: '昆明市盘龙区金辰街道办事处',
    useCardTime: '2021-07-23 10:00:23',
    useCardType: '标准接机',
    remark: '安排39座大巴车，9点40准时到达10点出发',
    score: 4
  }, {
    id: '02',
    status: StatusEnum.未完成,
    startPoint: '昆明市盘龙区人民政府',
    endPoint: '昆明市盘龙区金辰街道办事处',
    useCardTime: '2021-07-23 10:00:23',
    useCardType: '标准接机',
    remark: '安排39座大巴车，9点40准时到达10点出发',
    score: 3
  }];

  pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showLessItems: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
    onChange: (page, pageSize) => {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      // this.getGoodList();
      this.fetchData();
    },
    onShowSizeChange: (current, size) => {
      this.pagination.current = 1;
      this.pagination.pageSize = size;
      // this.getGoodList();
      this.fetchData();
    },
  };

  //获取数据
  fetchData(conditions = {driverPhone: '15808893828'}) {
    if (!this.spinning) {
      this.spinning = true;

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

      OrderService.fetchOrderList(params, conditions).then((res) => {
        debugger
      });

      setTimeout(() => {
        let temp = this.activeTabKey === StatusEnum.全部 ? this.allOrders_temp : this.allOrders_temp.filter(({status}) => status === this.activeTabKey);
        this.allOrders = temp || [];
        this.spinning = false;
      }, 500);
    }
  }

  //加载更多数据
  fetchMoreData() {
    if (!this.spinning) {
      this.spinning = true;
      this.loadMoreStatus = LoadMoreStatusEnum.more;
      setTimeout(() => {
        let temp = this.activeTabKey === StatusEnum.全部 ? this.allOrders_temp : this.allOrders_temp.filter(({status}) => status === this.activeTabKey);
        this.allOrders = [...this.allOrders, ...temp];
        this.spinning = false;
        this.loadMoreStatus = LoadMoreStatusEnum.noMore;
      }, 500);
    }
  }

  @Watch('activeTabKey', {immediate: true})
  handleActiveTabKeyChange(newVal, oldVal) {
    if (newVal !== oldVal) {
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
