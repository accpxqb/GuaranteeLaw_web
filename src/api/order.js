import request from '@/utils/request'
/**
 * 客户端获取订单列表
 * @param {*} params 
 * @returns 
 */
export function getOrderListToken(params) {
  return request({
    url: '/order/getOrderList',
    method: 'get',
    params: params,
    
  })
}
/**
 * app支付
 * @param {*} params 
 * @returns 
 */
export function getAppPay(params) {
  return request({
    url: '/order/getAppPay',
    method: 'get',
    params: params,
    
  })
}

/**
 * 客户端获取订单列表
 * @param {*} params 
 * @returns 
 */
export function getOrderList(params) {
  return request({
    url: '/order/getOrderList',
    method: 'get',
    params: params
  })
}

/**
 * 经理端获取订单列表
 * @param {*} params 
 * @returns 
 */
export function getOrderListForManager(params) {
  return request({
    url: '/order/getOrderListForManager',
    method: 'get',
    params: params
  })
}

/**
 * 生成订单
 * @param {*} data 
 * @returns 
 */
export function createOrder(data) {
  console.log(data)
  return request({
    url: '/order/createOrder',
    method: 'post',
    data: data
  })
}

