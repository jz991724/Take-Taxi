import {requestHelper} from "./requestHelper";
import {MethodEnum} from "../mixins/VueMixins";

const OrderService = {
    //获取order的列表
    fetchOrderList(params = undefined, vueContext = undefined, urlParams = undefined) {
        return requestHelper.request('/api/OrderInfo/GetPageList', MethodEnum.POST, params, vueContext, urlParams);
    }
}

export default OrderService;
