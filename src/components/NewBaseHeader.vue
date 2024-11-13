<template>
	<el-row class="header-area">
		<div class="main-header  header-sticky sticky-bar">
			<div class="container-fluid">
				<div class="row align-items-center">
					<!-- Logo -->
					<el-col :span="4">
						<div class="logo">
							<!--<a href="index.html"><img src="assets/img/logo/logo.png" alt=""></a>-->
							<span style="font-size: 30px; line-height: 103px;">中国担保法律网</span>
						</div>
					</el-col>
					<el-col :span="20">
						<div class="menu-main d-flex align-items-center justify-content-end">
							<!-- Main-menu -->
							<div class="main-menu f-right d-none d-lg-block">
								<nav>
									<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
									    active-text-color="#375498"
									    @select="handleSelect"  id="navigation">
										<el-menu-item><a href="/">首页</a></el-menu-item>
										<el-menu-item><a href="/regulations">法律法规</a></el-menu-item>
										<el-menu-item><a href="/fxll">法学理论</a></el-menu-item>
										<el-menu-item><a href="/alfx">案例分析</a></el-menu-item>
										<el-menu-item><a href="/zjzx">专家咨询</a></el-menu-item>
										<el-menu-item><a href="/hydt">行业动态</a></el-menu-item>
										<!--<el-sub-menu index="/hydt">
										    <template #title>行业动态</template>
										    <el-menu-item index="/xrx">信融信</el-menu-item>
										    <el-menu-item index="/bl">保理</el-menu-item>
										    <el-menu-item index="/rzzl">融资租赁</el-menu-item>
										    <el-menu-item index="/jypx">教育培训</el-menu-item>
										    <el-menu-item index="/qt">其他</el-menu-item>
										</el-sub-menu>-->
										<el-menu-item><a href="/gywm">关于我们</a></el-menu-item>
									</el-menu>
								</nav>
							</div>
							<div class="header-right-btn f-right d-none d-lg-block ml-30">
								<a href="#" class="header-btn">电话号码</a>
							</div>
						</div>
					</el-col>
					<!-- Mobile Menu -->
					<div class="col-12">
						<div class="mobile_menu d-block d-lg-none"></div>
					</div>
				</div>
			</div>
		</div>
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
