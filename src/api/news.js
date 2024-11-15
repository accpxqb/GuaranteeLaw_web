import request from "../utils/request";

// 列表
 
//flag列表 查询列表左侧展示文章
export function getHomeList(params) {
    return request({
      url: "/Menu/getHomeList",
      method: "Get",
      params,
    });
  }
//tag列表
export function getTagList(params) {
    return request({
      url: "/Menu/getTagList",
      method: "Get",
      params,
    });
  }
//子栏目列表
export function getMenuListByTitle(params) {
    return request({
      url: "/Menu/getMenuListByTitle",
      method: "Get",
      params,
    });
  }
  //文章列表
export function getArticleList(params) {
    return request({
      url: "/Menu/getArticleList",
      method: "Get",
      params,
    });
  }
  //获取文章
 
    export function getById(params) {
      return request({
        url: "/Menu/getArticleById",
        method: "Get",
        params,
      });
    }