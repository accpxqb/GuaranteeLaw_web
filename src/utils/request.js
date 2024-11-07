import axios from "axios";
import { ElMessage } from "element-plus";
import { useNetwork } from "@vueuse/core";
import router from "@/router";
import config from "./config";
// import { getToken } from '@/utils/auth'
import i18n from "../i18n";
const t = i18n.global.t;

// create an axios instance
const service = axios.create({
    // 外网更新
    // baseURL: 'http://xxxxx',
    baseURL: config.CONFIG_API,
    timeout: 50000, // request timeout
    //withCredentials: true, // 异步请求携带cookie
    headers: {
        // 设置后端需要的传参类型
        "Content-Type": "application/json",
        // 'Authorization': 'bearer '+localStorage.getItem("token"),
        // 'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6IntcIklkXCI6MCxcIlVzZXJJRFwiOlwic3RyaW5nXCIsXCJVc2VyTmFtZVwiOlwic3RyaW5nXCIsXCJGaXJzdE5hbWVcIjpcInN0cmluZ1wiLFwiTGFzdE5hbWVcIjpcInN0cmluZ1wiLFwiTWlkZGxlTmFtZVwiOlwic3RyaW5nXCIsXCJQd2RcIjpcInN0cmluZ1wiLFwiUGhvbmVOdW1iZXJcIjpcInN0cmluZ1wiLFwiTW9iaWxlXCI6XCJzdHJpbmdcIixcIkVtYWlsXCI6XCJzdHJpbmdcIixcIkhlYWRlckZpbGVOYW1lXCI6XCJzdHJpbmdcIixcIlNleFwiOnRydWUsXCJRUVwiOlwic3RyaW5nXCIsXCJXZWlYaW5JRFwiOlwic3RyaW5nXCIsXCJaaGlGdUJhb0lEXCI6XCJzdHJpbmdcIixcIkFjdGl2ZVwiOnRydWUsXCJEYXRlQ3JlYXRlZFwiOlwiMjAyMy0wMi0yOFQwMTo1NjozMy41MlpcIixcIkRhdGVEZWFjdGl2YXRlZFwiOlwiMjAyMy0wMi0yOFQwMTo1NjozMy41MlpcIixcIkxhc3RVcGRhdGVUaW1lXCI6XCIyMDIzLTAyLTI4VDAxOjU2OjMzLjUyWlwiLFwiVXNlclR5cGVcIjowfSIsIm5iZiI6MTY3NzU0OTM5OCwiZXhwIjoxNjc3NTkyNTk4LCJpc3MiOiJzZXJ2ZXIiLCJhdWQiOiJ1c2VyIn0.V6SgGdu4krrEhGrOe-qSMO6MaU8HuXN3Bc4a0X3T2ZU',
        "X-Requested-With": "XMLHttpRequest",
        // 'WE-Language': localStorage.getItem("lang")
    },
});

// 添加请求拦截器
service.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        const {
            isOnline,
            offlineAt,
            downlink,
            downlinkMax,
            effectiveType,
            saveData,
            type,
        } = useNetwork();
        if (!isOnline.value) ElMessage.error("网络连接失败，请检查网络连接");
        if (localStorage.getItem("token")) {
            config.headers["Authorization"] =
                "bearer " + localStorage.getItem("token");
        }
        if (localStorage.getItem("lang")) {
            config.headers["WE-Language"] = localStorage.getItem("lang");
        }
        return config;
    },
    function (error) {
        // 对请求错误做些什么
        console.log(error);
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    function (response) {
        console.log(response);
        //  console.log(response.headers.token)
        if (response.headers.token) {
            localStorage.setItem("token", response.headers.token);
        }

        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data;
        // 这个状态码是和后端约定的
        const code = dataAxios.reset;
        return dataAxios;
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        console.log(error);
        console.log(error.response.status);
        if (error.response.status === 401) {
            ElMessage.error(t("Js.NoLogin"));
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            router.push("/login");
        } else if (error.response.status === 403) {
            ElMessage.error(t("Js.NoAuthorization"));

            router.push("/");
        } else {
            ElMessage.error(t("Js.Error"));
        }
        return Promise.reject(error);
    }
);

export default service;
