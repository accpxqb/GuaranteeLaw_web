import request from '../utils/request'

export function getHotel(params) {
    return request({
      url: '/hotel/getHotel',
      method: 'get',
      params,
      
    })
  }
  export function editHotel(data) {
    return request({       
      url: '/hotel/editHotel',
      method: 'post', 
      data,
      
    })
  }

  export function editHotelRoom(data) {
    return request({       
      url: '/HotelRoom/editHotelRoom',
      method: 'post',
      data,
      
    })
  }
  export function getHotelList(params) {
    return request({
      url: '/hotel/getHotelList',
      method: 'get',
      params,
    })
  }
  export function getHotelListById(params) {
    return request({
      url: '/hotel/getHotelListById',
      method: 'get',
      params,
    })
  }

  //获取标签列表
  export function getFlags(params) {
    return request({
      url: '/HotelRoom/getFlags',
      method: 'get',
      params,
    })
  }
   //获取房间
   export function getHotelRoom(params) {
    return request({
      url: '/HotelRoom/getHotelRoom',
      method: 'get',
      params,
    })
  }

  export function getHotelRoomList(params) {
    return request({
      url: '/hotelRoom/getHotelRoomList',
      method: 'get',
      params,
    })
  }

 
  export function deleteHotel(params) {
    return request({       
      url: '/hotel/deleteHotel',
      method: 'get',
      params,
    })
  }

  export function deleteHotelRoom(params) {
    return request({       
      url: '/hotelRoom/deleteHotelRoom',
      method: 'get',
      params,
    })
  }
  //删除照片
  export function deletePicture(params) {
    return request({
      url: '/hotel/deletepicture',
      method: 'get',
      params,
      
    })
  }
 