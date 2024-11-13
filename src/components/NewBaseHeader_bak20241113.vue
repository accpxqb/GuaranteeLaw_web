<template>
    <el-row style="height: 60px;" justify="center" align="middle">
        <el-col :span="16">
            <!-- background-color="#545c64"
            text-color="#fff" -->
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
                active-text-color="#375498"
                @select="handleSelect">
                <el-menu-item index="0">
                    <el-link :underline="false" href="/">
                        <el-space>
                            <img style="width: 25px; height: 25px" :src="logo" alt="Element logo" />
                            中国法律担保网
                        </el-space>
                    </el-link>
                </el-menu-item>
                <el-menu-item index="/">首页</el-menu-item>
                <el-menu-item index="/regulations">法律法规</el-menu-item>
                <el-menu-item index="/fxll">法学理论</el-menu-item>
                <el-menu-item index="/alfx">案例分析</el-menu-item>
                <el-menu-item index="/zjzx">专家咨询</el-menu-item>
                <el-sub-menu index="/hydt">
                    <template #title>行业动态</template>
                    <el-menu-item index="/xrx">信融信</el-menu-item>
                    <el-menu-item index="/bl">保理</el-menu-item>
                    <el-menu-item index="/rzzl">融资租赁</el-menu-item>
                    <el-menu-item index="/jypx">教育培训</el-menu-item>
                    <el-menu-item index="/qt">其他</el-menu-item>

                </el-sub-menu>
                <el-menu-item index="/lxwm">联系我们</el-menu-item>

            </el-menu>

        </el-col>
    </el-row>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import logo from "@/assets/images/logo@2x.png";

import { useRouter } from "vue-router";

const router = useRouter();
const jumpPage = (path: string) => {
    router.push(path);
};
// const hoverBgColor = ref('#f5a623')  // 设置默认的 hover 背景色

const activeIndex = ref('/')
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
    jumpPage(key)
}
</script>

<style>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
}
 
</style>