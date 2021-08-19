import qs from 'qs';

export const requestHelper = {
    /**
     * axios请求
     * @param url 请求地址
     * @param method {METHOD} http method
     * @param params 请求参数
     * @param vueContext 当前vue对象
     * @param spinName 等待参数
     * @param config
     * @returns {Promise<AxiosResponse<T>>}
     */
    request(url = '', method = MethodEnum, params = {}, vueContext = undefined, urlParams = undefined, spinName = 'spinning', config = {}) {
        if (vueContext && spinName && vueContext[spinName] !== undefined) {
            vueContext[spinName] = true;
        }

        url = `${uni.getStorageSync('$apiServer')}${url}`
        if (urlParams) {
            let paramsStr = qs.stringify(urlParams);
            url = `${url}?${paramsStr}`;
        }

        return new Promise((resolve, reject) => {
            uni.request({
                url, //仅为示例，并非真实接口地址。
                data: params,
                ...config,
                method: method,
                success: (res) => {
                    let {statusCode, data: {result}} = res;
                    if (statusCode === 200) {
                        return resolve(result);
                    } else {
                        return reject();
                    }
                },
                fail: (error) => {
                    return reject(error)
                },
                complete: () => {
                    if (vueContext && spinName && vueContext[spinName] !== undefined) {
                        vueContext[spinName] = false;
                    }
                }
            });
        });
    }
}
