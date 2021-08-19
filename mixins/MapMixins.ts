import {Vue, Component, Mixins} from 'vue-property-decorator';
import VueMixins from "../mixins/VueMixins";

@Component({name: 'MapMixins'})
export default class MapMixins extends Mixins(VueMixins, Vue) {
    distance = 0; //"距离"
    latitude = 24; // 默认定在昆明
    longitude = 102;
    markers = [];
    markerHeight = 40;
    //规划路线
    planRoute: any = {};

    //路线
    routePolyline = [];

    onClearPlanRoute() {
        this.planRoute = {};
        this.markers = [];
        this.routePolyline = [];
    }

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

    //绘制规划路线
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
            debugger
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
};
