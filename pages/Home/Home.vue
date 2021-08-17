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


            <view v-if="userInfoList.length>0">
              <view class="cu-bar bg-white solid-bottom margin-top">
                <view class="action">
                  <text class="cuIcon-titles text-orange"></text>
                  乘客信息
                </view>
              </view>

              <uni-card v-for="userInfo in userInfoList"
                        :key="userInfo.id"
                        :is-shadow="true"
                        mode="title"
                        note="true">
                <template v-slot:header>
                  <view>
                    <text class="text-bold margin-right-sm">{{ userInfo.name || '' }}</text>
                    <view v-if="userInfo.useCardType" class="cu-tag bg-green light sm round">
                      {{ userInfo.useCardType }}
                    </view>
                  </view>

                  <text class="text-right">用车时间：{{ userInfo.useCardTime || '' }}</text>
                </template>

                <text>{{ userInfo.remark || '' }}</text>

                <template v-slot:footer>
                  <view class="text-center" @tap="onPhoneCall(userInfo.tel)">
                    <uni-icons type="phone" size="14"></uni-icons>
                    <view>联系电话</view>
                  </view>
                </template>
              </uni-card>
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
import VueMixins from '../../mixins/VueMixins.ts';
import UniIcons from '../../components/uni-icons/uni-icons.vue';

@Component({
  name: 'Home',
  components: {UniIcons},
})
export default class Home extends Mixins(VueMixins) {
  distance = 0; //"距离"
  latitude = 24; // 默认定在昆明
  longitude = 102;
  markers = [];
  markerHeight = 40;
  //规划路线
  planRoute: any = {};

  //路线
  routePolyline = [];

  //乘客列表
  userInfoList = [{
    id: '01',
    avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg',
    name: '花姐夫',
    tel: '18788409290',
    // startPoint:''
    endPoint: '昆明市盘龙区金辰街道办事处',
    useCardTime: '2021-07-23 10:00:23',
    useCardType: '标准接机',
    remark: '安排39座大巴车，9点40准时到达10点出发'
  }];

  onClearPlanRoute() {
    this.planRoute = {};
    this.markers = [];
    this.routePolyline = [];
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

  // 彻底拒绝位置获取
  rejectGetLocation() {
    uni.showToast({
      title: '你拒绝了授权，无法获得周边信息',
      icon: 'none',
      duration: 2000,
    });
  };

  //获取当前位置
  getLocation() {
    this.showLoadingToast();
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          return resolve(res);
        },
        fail: (error) => {
          return reject(error);
        },
        complete: () => {
          this.hideLoadingToast();
        }
      });
    });
  }

  //通过地址返回坐标位置信息
  getPositionInfoByAddress(address) {
    this.showLoadingToast();
    return new Promise((resolve, reject) => {
      //调用地址解析接口
      this.$qqmapsdk.geocoder({
        //获取表单传入地址
        address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
        success: (res) => {//成功后的回调
          let {
            result: {
              location: {
                lat,
                lng
              }
            },
            status
          } = res;
          if (status === this.qqMapsSDKStatusEnum.success) {
            return resolve({
              latitude: lat,
              longitude: lng
            });
          } else {
            return reject(false);
          }
        },
        fail: (error) => {
          console.error(error);
          this.showErrorToast(error);
          return reject(error);
        },
        complete: (res) => {
          this.hideLoadingToast();
          console.log(res);
        }
      });
    });
  }

  //路线规划
  routePolylinePlan({
                      from,
                      to,
                      targetInfo
                    }, mode = 'driving') {
    this.markers = [];
    this.routePolyline = [];
    this.showLoadingToast();
    return new Promise((resolve, reject) => {
      //调用距离计算接口
      this.$qqmapsdk.direction({
        mode,//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
        //from参数不填默认当前地址
        from,
        to,
        success: (res) => {
          let {
            result: {routes},
            status
          } = res;
          if (status === this.qqMapsSDKStatusEnum.success) {
            let [route] = routes;
            //距离和预计用时
            let {
              distance,
              duration
            } = route;
            let coors = route.polyline;
            let pl = [];
            //坐标解压（返回的点串坐标，通过前向差分进行压缩）
            let kr = 1000000;
            for (let i = 2; i < coors.length; i++) {
              coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
            }
            //将解压后的坐标放入点串数组pl中
            for (let i = 0; i < coors.length; i += 2) {
              pl.push({
                latitude: coors[i],
                longitude: coors[i + 1]
              });
            }
            console.log(pl);
            let [startPoint] = pl;
            let endPoint = pl[pl.length - 1];
            this.latitude = startPoint.latitude;
            this.longitude = startPoint.longitude;

            this.markers = [{
              id: 'startPoint',
              latitude: startPoint.latitude,
              longitude: startPoint.longitude,
              iconPath: '../../static/startPoint_icon.png',
              width: this.markerHeight, //宽
              height: this.markerHeight, //高
            }, {
              id: 'endPoint',
              latitude: endPoint.latitude,
              longitude: endPoint.longitude,
              iconPath: '../../static/targetPoint_icon.png',
              width: this.markerHeight, //宽
              height: this.markerHeight, //高
              anchor: {
                x: 0.5,
                y: 1
              },
              callout: {
                content: `${targetInfo.title || ''}\n 距离：${distance || 0}米 | 约需要${duration || 0}分钟到\n地址：${targetInfo.address || ''}\n`,
                color: '#FFFFFF',
                fontSize: 12,
                borderRadius: 4,
                borderWidth: 1,
                // borderColor: '#333300',
                bgColor: '#5e5c5c',
                padding: '5',
                display: 'ALWAYS'
              }
            }];

            //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
            this.routePolyline = [{
              points: pl,
              // color: 'rgba(255,0,0,0.87)',
              arrowLine: true,
              colorList: ['#FFFFFF', '#2CA756'],
              width: 6
            }];

            return resolve(route);
          } else {
            return reject(false);
          }
        },
        fail: (error) => {
          console.error(error);
          this.showErrorToast(error);
          return reject(error);
        },
        complete: (res) => {
          this.hideLoadingToast();
          console.log(res);
        }
      });
    });
  }

  // 确认授权后，获取用户位置
  // getLocationInfo(address = this.targetAddress) {
  //   this.markers = [];
  //   this.routePolyline = [];
  //   if (address) {
  //     let locationInfoPromise = this.getLocation();
  //     let getTargetByAddressPromise = this.getPositionInfoByAddress(address);
  //
  //     Promise.all([locationInfoPromise, getTargetByAddressPromise])
  //         .then(res => {
  //           let [from, to] = res;
  //           this.routePolylinePlan({
  //             from,
  //             to,
  //             targetInfo: {address}
  //           });
  //         }, error => {
  //           console.log(error);
  //         });
  //   }
  // };

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

  drawRoutePolyline(targetInfo) {
    let {location} = targetInfo;
    if (location) {
      let {
        lat,
        lng
      } = location;
      this.getLocation()
          .then(from => {
            this.routePolylinePlan({
              from,
              to: {
                latitude: lat,
                longitude: lng
              },
              targetInfo
            })
                .then(planRoute => {
                  this.planRoute = {...this.planRoute, ...planRoute};
                });
          });
    }
  }

  onLoad(option) {
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
                  this.locationCurrentPosition();
                })
                .catch(() => {
                  this.rejectGetLocation();
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
