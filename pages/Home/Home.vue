//主页面
<template>
  <view class="content">
    <!--    <cu-custom bgColor="bg-gradual-blue" :isBack="false">-->
    <!--                <block slot="backText">返回</block>-->
    <!--                <block slot="content" sty>-->
    <!--      <uni-search-bar :radius="100"-->
    <!--                      slot="content"-->
    <!--                      placeholder="请输入目的地"-->
    <!--                      @tap.stop="gotoSearchPage()">-->
    <!--      </uni-search-bar>-->
    <!--                </block>-->
    <!--    </cu-custom>-->

    <scroll-view scroll-y="true">
      <block>
        <epx-panel @checked="drawRoutePolyline"
                   :minHeight="ScreenHeight*0.1>100?10:ScreenHeight*0.1"
                   :middleHeight="ScreenHeight*0.3">
          <uni-search-bar slot="head"
                          style="width: 100%;"
                          :radius="100"
                          :value="planRoute.title"
                          :placeholder="'查找地点'"
                          cancelButton="none"
                          @tap.stop="gotoSearchPage()"
                          @clear.stop="onClearPlanRoute"></uni-search-bar>

          <view class="bg-gray" style="height: 100%;">
            <uni-card v-if="Object.keys(planRoute).length>0"
                      :is-shadow="false"
                      :isFull="true"
                      mode="title"
                      note="true">
              <template v-slot:header>
                <view>
                  <text class="text-bold margin-right-sm text-cut">{{ planRoute.title || '' }}</text>
                  <view v-if="userInfo.useCardType" class="cu-tag bg-green light sm round">
                    {{ userInfo.useCardType }}
                  </view>
                </view>
              </template>

              <view>
                <view class="flex">
                  <view class="padding-right-sm">距你约{{ planRoute.distance || 0 }}米</view>
                  <block>|</block>
                  <view class="padding-left-sm">用时约{{ planRoute.duration || 0 }}分钟</view>
                </view>
                <text>{{ planRoute.address || '' }}</text>
              </view>

              <template v-slot:footer>
                <view></view>
                <template v-if="planRoute.category">
                  <view v-for="item in (planRoute.category||'').split(':')"
                        :key="item"
                        class="cu-tag bg-green light sm round">
                    {{ item }}
                  </view>
                </template>
              </template>
            </uni-card>


            <view v-if="orderList.length>0">
              <view class="cu-bar bg-white solid-bottom margin-top">
                <view class="action">
                  <text class="cuIcon-titles text-orange"></text>
                  乘客信息
                </view>
              </view>

              <scroll-view scroll-y="true"
                           :refresher-triggered="spinning"
                           @refresherpulling="onRefresh"
                           @scrolltolower="onFetchMoreData"
                           @refresherrestore="onRestore"
                           @refresherabort="onAbort"
                           :show-scrollbar="true"
                           :refresher-enabled="true"
                           :refresher-threshold="120"
                           style="position: relative;top: 0;height: 177px;">
                <uni-card v-for="userInfo in orderList"
                          :key="userInfo.id"
                          :is-shadow="true"
                          mode="title"
                          note="true">
                  <template v-slot:header>
                    <view>
                      <text class="text-bold margin-right-sm">{{ userInfo.passengerName || '' }}</text>
                      <view v-if="userInfo.productType" class="cu-tag bg-green light sm round">
                        {{ userInfo.productType }}
                      </view>
                    </view>
                  </template>

                  <view>
                    <uni-row v-if="userInfo.flightNumber">
                      <uni-col :span="7">
                        <view class="text-bold response text-right">航班号：</view>
                      </uni-col>
                      <uni-col :span="17">
                        <view class="text-cut">
                          {{ userInfo.flightNumber || '' }}
                        </view>
                      </uni-col>
                    </uni-row>

                    <uni-row v-if="userInfo.flightTime">
                      <uni-col :span="7">
                        <view class="text-bold response text-right">航班时间：</view>
                      </uni-col>
                      <uni-col :span="17">
                        <view class="text-cut">
                          {{ userInfo.flightTime || '' }}
                        </view>
                      </uni-col>
                    </uni-row>

                    <uni-row>
                      <uni-col :span="7">
                        <view class="text-bold response text-right">用车时间：</view>
                      </uni-col>
                      <uni-col :span="17">
                        {{ `${userInfo.useCarDate || ''} ${userInfo.useCarTime || ''}` }}
                      </uni-col>
                    </uni-row>

                    <uni-row>
                      <uni-col :span="7">
                        <view class="text-bold response text-right">乘车点：</view>
                      </uni-col>
                      <uni-col :span="17">
                        <view class="text-cut">
                          {{ userInfo.startAddress || '' }}
                        </view>
                      </uni-col>
                    </uni-row>

                    <uni-row>
                      <uni-col :span="7">
                        <view class="text-bold response text-right">目的地：</view>
                      </uni-col>
                      <uni-col :span="17">
                        <view class="text-cut">
                          {{ userInfo.destinationAddress || '' }}
                        </view>
                      </uni-col>
                    </uni-row>

                    <uni-row v-if="userInfo.remark">
                      <uni-col :span="7">
                        <view class="text-bold response text-right">备注：</view>
                      </uni-col>
                      <uni-col :span="17">
                        <view class="text-cut">
                          {{ userInfo.remark || '' }}
                        </view>
                      </uni-col>
                    </uni-row>
                  </view>

                  <template v-slot:footer>
                    <view class="text-center" @tap="onPhoneCall(userInfo.passengerPhone)">
                      <uni-icons type="phone" size="14"></uni-icons>
                      <view>联系电话</view>
                    </view>
                  </template>
                </uni-card>
              </scroll-view>
            </view>
          </view>
        </epx-panel>
      </block>
      <map id="myMap"
           :markers="markers"
           style="width:100vw;height:100vh;"
           :longitude="longitude"
           :latitude="latitude"
           :polyline="routePolyline"
           scale='16' show-location>
      </map>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import VueMixins, {LoadMoreStatusEnum, OrderStatusEnum} from '../../mixins/VueMixins.ts';
import UniIcons from '../../components/uni-icons/uni-icons.vue';
import MapMixins from '../../mixins/MapMixins.ts';
import {OrderService} from '../../services'

@Component({
  name: 'Home',
  components: {UniIcons},
})
export default class Home extends Mixins(VueMixins, MapMixins) {
  //乘客列表OrderList
  orderList = [
    // {
    //   id: '01',
    //   avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg',
    //   name: '花姐夫',
    //   tel: '18788409290',
    //   // startPoint:''
    //   endPoint: '昆明市盘龙区金辰街道办事处',
    //   useCardTime: '2021-07-23 10:00:23',
    //   useCardType: '标准接机',
    //   remark: '安排39座大巴车，9点40准时到达10点出发'
    // }
  ];

  //定位当前位置
  locationCurrentPosition() {
    this.getLocation()
        .then(res => {
          let {
            latitude,
            longitude
          } = res;
          this.latitude = latitude;
          this.longitude = longitude;
        });
  }

  //跳到搜索页
  gotoSearchPage() {
    uni.navigateTo({
      url: `Search/Search?keyword=${this.planRoute.title || ''}`
    });
  }

  // 拒绝授权后，弹框提示是否手动打开位置授权
  openConfirm() {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: '请求授权当前位置',
        content: '我们需要获取地理位置信息',
        success: (res) => {
          if (res.confirm) {
            uni.openSetting()
                .then((res) => {
                  if (res[1].authSetting['scope.userLocation'] === true) {
                    resolve(); // 打开地图权限设置
                  } else {
                    reject();
                  }
                });
          } else if (res.cancel) {
            reject();
          }
        },
      });
    });
  };

  //获取订单list
  pagination = {
    current: 1,
    pageSize: 10,
    // total: 0,
  };

  //获取数据
  fetchOrderList(conditions = {driverPhone: '15808893828', status: OrderStatusEnum.全部}) {
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
          this.orderList = [...items, ...items, ...items, ...items, ...items, ...items] || [];
        });
  }

  //加载更多数据
  fetchMoreOrders(conditions = {driverPhone: '15808893828', status: OrderStatusEnum.全部}) {
    // this.loadMoreStatus = LoadMoreStatusEnum.more;
    if (this.spinning) {
      return;
    }
    debugger
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
          this.orderList = [...this.orderList, ...items];
          // this.loadMoreStatus = LoadMoreStatusEnum.noMore;
        });

  }

  onRefresh() {
    console.log('刷新');
    this.fetchOrderList();
  }

  onFetchMoreData() {
    console.log("更多");
    this.fetchMoreOrders();
  }

  onRestore() {
    console.log("onRestore");
    this.spinning = false;
  }

  onAbort() {
    console.log("onAbort");
    this.spinning = false;
  }

  onLoad(option) {
    this.fetchOrderList();

    this.planRoute = {
      'mode': 'DRIVING',
      'distance': 6431,
      'duration': 19,
      'traffic_light_count': 11,
      'toll': 0,
      'restriction': {'status': 0},
      'tags': ['LEAST_DISTANCE', '距离短'],
      'taxi_fare': {'fare': 0},
      'id': '3067554519178194975',
      'title': '同德昆明广场购物中心',
      'address': '云南省昆明市盘龙区金江路与北京路交叉口西南',
      'category': '购物:综合商场:购物中心',
      'type': 0,
      'location': {
        'lat': 25.068056,
        'lng': 102.723755
      },
      'adcode': 530103,
      'province': '云南省',
      'city': '昆明市',
      'district': '盘龙区'
    };
    debugger
    this.drawRoutePolyline({
      'mode': 'DRIVING',
      'distance': 6431,
      'duration': 19,
      'traffic_light_count': 11,
      'toll': 0,
      'restriction': {'status': 0},
      'tags': ['LEAST_DISTANCE', '距离短'],
      'taxi_fare': {'fare': 0},
      'id': '3067554519178194975',
      'title': '同德昆明广场购物中心',
      'address': '云南省昆明市盘龙区金江路与北京路交叉口西南',
      'category': '购物:综合商场:购物中心',
      'type': 0,
      'location': {
        'lat': 25.068056,
        'lng': 102.723755
      },
      'adcode': 530103,
      'province': '云南省',
      'city': '昆明市',
      'district': '盘龙区'
    });

    uni.$on('targetInfo_map', (targetInfo) => {
      this.planRoute = {...this.planRoute, ...targetInfo};
      console.log(JSON.stringify('规划线路信息：', this.planRoute));
      this.drawRoutePolyline(targetInfo);
    });

    // uni.$on('keywordsCompletionItems_map', ({keywordsCompletionItems}) => {
    //   this.keywordsCompletionItems = keywordsCompletionItems;
    // });
  }

  onReady() {
    // 加载定义好的方法
    let loginRes = this.$checkLogin();
    // 没有登录成功，返回空
    if (loginRes) {
      //   wx请求获取位置权限
      this.getAuthorize('scope.userLocation')
          .then(() => {
            //   同意后获取
            this.locationCurrentPosition();
          })
          .catch(() => {
            //   不同意给出弹框，再次确认
            this.openConfirm()
                .then(() => {
                  //定位到当前位置
                  this.locationCurrentPosition();
                })
                .catch(() => {
                  this.showErrorToast({message: '你拒绝了授权，无法获得周边信息'});
                });
          });
    }
  }
}
</script>

<style lang="less">
/deep/ .cu-custom {
  .cu-bar {
    .content {
      height: 100% !important;
    }
  }
}

</style>
