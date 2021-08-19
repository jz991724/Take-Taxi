import {
    Component,
    Vue,
    Watch
} from 'vue-property-decorator';

export enum QQMapsSDKStatusEnum {
    success
}

export enum LoadMoreStatusEnum {
    more = '加载更多',
    loading = '加载中',
    noMore = '没有更多数据',
}

@Component({
    name: 'VueMixins'
})
export default class VueMixins extends Vue {
    StatusBar: any = this.StatusBar;
    CustomBar: any = this.CustomBar;
    ScreenHeight: any = this.ScreenHeight;
    ScreenWidth: any = this.ScreenWidth;
    qqMapsSDKStatusEnum = QQMapsSDKStatusEnum;
    loadMoreStatusEnum = LoadMoreStatusEnum;
    // EventChannel;

    appid = 'wx204f2188a505d169';//你的小程序的APPID
    secret = '559cb80e07cf9063b4ddd82e409dbb7b';//你的小程序的secret
    js_code = '';//wx.login 登录成功后的code

    loadMoreStatus = this.loadMoreStatusEnum.more;
    // loadMoreTimer;

    spinning = false;

    // 授权判断
    getAuthorize(scope: any) {
        if (scope) {
            return new Promise((resolve, reject) => {
                uni.authorize({
                    scope,
                    success: () => {
                        resolve(); // 允许授权
                    },
                    fail: () => {
                        reject(); // 拒绝授权
                    },
                });
            });
        }
    };

    //拨打电话
    onPhoneCall(phoneNumber: number | string) {
        if (phoneNumber) {
            uni.makePhoneCall({
                phoneNumber
            });
        }
    }

    showLoadingToast(title = '加载中...') {
        uni.showLoading({title, mask: true});
    }

    hideLoadingToast() {
        uni.hideLoading();
    }

    //错误信息显示
    showErrorToast(error: ErrorEvent) {
        uni.showToast({
            title: error.message,
            icon: 'error',
            duration: 2000,
        });
    }

    // //更多加载提示
    // showLoadMore(status: LoadMoreStatusEnum) {
    //     this.loadMoreStatus = status;
    //     uni.showNavigationBarLoading();
    // }
    //
    // //停止下拉样式
    // stopLoadMore() {
    //     uni.stopPullDownRefresh();
    // }

    onReady() {
        // this.EventChannel = this.getOpenerEventChannel();
    }

    onLoad() {
        // // 加载定义好的方法
        // let loginRes = this.$checkLogin();
        // // 没有登录成功，返回空
        // if (!loginRes) {
        //     return;
        // }
    }

    @Watch('spinning')
    handleSpinningChange(newVal, oldVal) {
        if (newVal !== oldVal) {
            if (newVal) {
                this.showLoadingToast();
            } else {
                this.hideLoadingToast();
            }
        }
    }
}
