import qs from 'qs';

const OrderService = {
    //获取order的列表
    fetchOrderList(params, urlParams) {
        let url = `${uni.getStorageSync('$apiServer')}/api/OrderInfo/GetPageList`;
        if (urlParams) {
            let paramsStr = qs.stringify(urlParams);
            url = `${url}?${paramsStr}`;
        }
        return new Promise(((resolve, reject) => {
            uni.request({
                url, //仅为示例，并非真实接口地址。
                data: params,
                method: 'POST',
                success: (res) => {
                    let {statusCode, data: {result}} = res;
                    if (statusCode === 200) {
                        return resolve(result);
                    } else {
                        return reject();
                    }
                }, error: (error) => {
                    return reject(error)
                }
            });
        }));
    }
}

export default OrderService;
