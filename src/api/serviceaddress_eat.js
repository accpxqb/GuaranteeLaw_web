import request from '../utils/request'
//获取服务范围列表
export function getlist(params) {
    return request({
      url: '/ServiceAddressEat/getlist',
      method: 'get',
      params,

    })
}
//新增服务范围
export function add(data) {  
    return request({
      url: '/ServiceAddressEat/add',
      method: 'post',
      data
    })
  }
//新增服务范围
export function del(params) {  
    return request({
      url: '/ServiceAddressEat/del',
      method: 'get',
      params
    })
  }
