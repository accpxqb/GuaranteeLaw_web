import request from '@/utils/request'
 
 

/**
 * 客户端获取订单列表
 * @param {*} params 
 * @returns 
 */
export function getOrderList(params) {
  return request({
    url: '/orderbase/getOrderList',
    method: 'get',
    params: params
  })
}
/**
 * 支付
 * @param {*} data 
 * @returns 
 */
export function payOrder(data) { 
    return request({
      url: '/orderbase/payOrder',
      method: 'post',
      data: data
    })
  }
 
 

/**
 * 重新下单
 * @param {*} params 
 * @returns 
 */
export function reorder(params) {
  return request({
    url: '/orderbase/reorder',
    method: 'get',
    params: params
  })
}

/**
 * 入住
 * @param {*} params 
 * @returns 
 */
export function checkIn(params) {
  return request({
    url: '/orderbase/checkIn',
    method: 'get',
    params: params
  })
}

/**
 * 完成退款
 * @param {*} params 
 * @returns 
 */
export function completed(params) {
  return request({
    url: '/orderbase/completed',
    method: 'get',
    params: params
  })
}

export function deleteOrder(params) {
  return request({
    url: '/orderbase/deleteOrder',
    method: 'get',
    params: params
  })
}