<template>
    <el-row class="footer-area section-bg" data-background="./src/assets/img/gallery/footer_bg.jpg" style="background-image: url('./src/assets/img/gallery/footer_bg.jpg');">
      <!--? Footer Start-->
      	<el-row class="container">
      		<el-row  class="footer-top footer-padding">
      			<el-row class="row d-flex justify-content-between">
      				<el-col :span="6">
      					<div class="single-footer-caption mb-50">
      						<!-- logo -->
      						<div class="footer-logo">
      							<a href="index.html" style="font-size: 40px;">中国担保法律网</a>
      						</div>
      						<div class="footer-tittle">
      							<div class="footer-pera">
      								<p class="info1">担保制度领域做理论研究和法律实践的研发者、引领者、推动者。
      								</p>
      							</div>
      						</div>
      						<div class="footer-number">
      							<h4><span>+0531 </span>1111 111</h4>
      							<p>aaaaa@163.com</p>
      						</div>
      					</div>
      				</el-col>
      				<el-col class="col-xl-2 col-lg-2 col-md-3 col-sm-5">
      					<div class="single-footer-caption mb-50">
      						<div class="footer-tittle">
      							<h4>我们的服务</h4>
      							<ul>
      								<li><a href="#">法律法规</a></li>
      								<li><a href="#">法学理论</a></li>
      								<li><a href="#">案例分析</a></li>
      								<li><a href="zhuanjiazixun.html">专家咨询</a></li>
      								<li><a href="#">行业动态</a></li>
      							</ul>
      						</div>
      					</div>
      				</el-col>
      				<el-col class="col-xl-2 col-lg-2 col-md-3 col-sm-5">
      					<div class="single-footer-caption mb-50">
      						<div class="footer-tittle">
      							<h4>了解我们</h4>
      							<ul>
      								<li><a href="#">关于我们</a></li>
      							</ul>
      						</div>
      					</div>
      				</el-col>
      				<el-col class="col-xl-4 col-lg-4 col-md-6 col-sm-8">
      					<div class="single-footer-caption mb-50">
      						<div class="footer-tittle">
      							<h4>公司简介</h4>
      							<div class="footer-pera">
      								<p class="info1">简介内容11111111</p>
      							</div>
      						</div>
      						<!-- Form -->
      						<div class="footer-form">
      							<div id="mc_embed_signup">
      								<el-image src="./src/assets/img/ewm.jpg" width="40%"/>
      							</div>
      						</div>
      					</div>
      				</el-col>
      			</el-row>
      		</el-row>
      		<el-row class="footer-bottom">
      			<div class="row d-flex justify-content-between align-items-center">
      				<div class="col-xl-12" style="text-align:center">
      					<div class="footer-copy-right">
      						<p>
      							 © {{ currentYear }} XinRongXin. All rights reserved.
      						</p>
      					</div>
      				</div>
      			</div>
      		</el-row>
      	</el-row>
      <!-- Footer End-->
    </el-row>
	
</template>

<script lang="ts" setup>
import { h, ref } from "vue";
import  ElDivider from "element-plus";
const spacer = h(ElDivider, { direction: "vertical" });
const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer-title-span {
  font-size: medium;
  font-weight: 1000;
}

.justify-center-col {
  display: flex;
  justify-content: center;
}

.customer-divider {
  height: 200px;
}
</style>
