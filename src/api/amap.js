import axios from 'axios'
//输入提示
export function inputtips(params) {
    return axios.get('https://restapi.amap.com/v3/assistant/inputtips',
    {
      params      
    })
  }