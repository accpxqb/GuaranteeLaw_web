<template>
	<el-row>
		<el-col :span="24">
			<!--? Hero Start -->
			<div class="slider-area2">
				<div class="slider-height2 hero-overly2 d-flex align-items-center">
					<div class="container">
						<div class="row">
							<div class="col-xl-12">
								<div class="hero-cap hero-cap2 text-center">
									<h2>{{detail.Description??"详情"}}</h2>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Hero End -->
		</el-col>
		<el-col :span="24">
			<!--================Blog Area =================-->
			<section class="blog_area single-post-area section-padding1">
				<div class="container">
					<div class="row">
						<div class="col-lg-12 posts-list">
							<div class="single-post">

								<div class="blog_details">
									<h2>{{detail.Name}}
									</h2>
									<ul class="blog-info-link mt-3 mb-4">
										<li><i class="fa fa-users"></i>{{detail.DocumentType}}</li>
										<li><i class="fa fa-comments"></i>{{detail.Area}}</li>
										<li><a href="#"><i class="fa fa-users"></i>{{ detail.CourtHierarchy}}</a></li>
													 
										<li><i class="fa fa-calendar-times"></i>{{detail.PublishTime?.split('T')[0]}}</li>
									</ul>
									<div class="quote-wrapper">
										<div class="quotes">
											<p>{{detail.Description}}
											</p>
										</div>
									</div>
									<div class="feature-img">
										<img class="img-fluid" src="@/assets/img/blog/single_blog_1.png" alt=""
											width="100%">
									</div>
									<p>
										<div v-html="detail.Content"></div>
									</p>
								</div>
							</div>
							<div class="navigation-top">
								<div class="navigation-area">
									<div class="row">
										<div
											class="col-lg-6 col-md-6 col-12 nav-left flex-row d-flex justify-content-start align-items-center">
											<div class="thumb">
												<a href="#">
													<img class="img-fluid" src="@/assets/img/post/preview.png" alt="">
												</a>
											</div>
											<div class="arrow">
												<a href="#">
													<span class="lnr text-white ti-arrow-left"></span>
												</a>
											</div>
											<div  v-if="up" class="detials">
												<p>上一篇</p>
												<a :href="'/casedetails?id='+up.ID">
													<h4>{{up.Name}}</h4>
												</a>
											</div>
										</div>
										<div
											class="col-lg-6 col-md-6 col-12 nav-right flex-row d-flex justify-content-end align-items-center">
											<div v-if="next" class="detials">
												<p>下一篇</p>
												<a :href="'/casedetails?id='+next.ID">
													<h4>{{next.Name}}</h4>
												</a>
											</div>
											<div class="arrow">
												<a href="#">
													<span class="lnr text-white ti-arrow-right"></span>
												</a>
											</div>
											<div class="thumb">
												<a href="#">
													<img class="img-fluid" src="@/assets/img/post/next.png" alt="">
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!--================ Blog Area end =================-->
		</el-col>
	</el-row>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getListByValue } from "@/api/settingitme";
import { getTagList, getList, getHomeList,getById } from "@/api/case";
import { ElMessage } from 'element-plus'
import config from '@/utils/config';
import { useRoute } from 'vue-router';

const route = useRoute();

 const detail = ref({})
 const up = ref({})
 const next = ref({})
 const getDetail=(id)=>{	 
	if(id){
		getById({id:id}).then(res => {
		console.log(res)
		if (res.code) {			 
			detail.value = res.data.info
			up.value = res.data.up
			next.value = res.data.next
		}
	})
	}
	
 }

onMounted(() => {
	getDetail(route.query.id)
});

</script>

<style>
 
</style>