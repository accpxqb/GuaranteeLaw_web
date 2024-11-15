<template>
	<!-- Hero Section Begin -->
	<section class="hero spad set-bg" data-setbg="./src/assets/img/hero/h1_hero.jpg"
		style="background-image: url('./src/assets/img/hero/h1_hero.jpg');">
		<div class="container">
			<div class="row">
				<div class="col-lg-12">
					<div class="hero__text">
						<h2>信融信</h2>
						<p>您的法律渠道专家</p>
						<a href="#" class="primary-btn">关于我们</a>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!-- Hero Section End -->

	<!--? Services Ara Start -->
	<el-row justify="center" align="middle">
		<el-row class="services-area section-padding4">
			<el-row class="container">
				<div class="row align-items-end mb-50">
					<div class="cl-xl-6 col-lg-6 col-md-10">
						<!-- Section Tittle -->
						<div class="section-tittle ">
							<span>信融信&nbsp;&nbsp;</span>
							<h2>专家咨询</h2>
						</div>
					</div>
					<div class="col-xl-6 col-lg-6">
						<div class="properties__button">
							<!--Nav Button  -->
							<nav>
								<div class="nav nav-tabs" id="nav-tab" role="tablist">
									<button class="nav-item nav-link" @click="toggleButton('国内')"
										:class="{ active: selectedButton === '国内' }">国内</button>
									<button class="nav-item nav-link" @click="toggleButton('国外')"
										:class="{ active: selectedButton === '国外' }">国外</button>
								</div>
							</nav>
							<!--End Nav Button  -->
						</div>
					</div>
				</div>
				<!-- Nav Card -->
				<div class="tab-content" id="nav-tabContent">
					<!-- card one -->
					<div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
						<!-- Search Begin -->
						<el-row class="">
							<el-row class="container">
								<el-row class="row">
									<el-col :span="24">
										<form action="#" class="filter__form">
											<div v-if="selectedButton=='国内'" class="filter__item last__item">
												<h5>专家咨询</h5>
												<div class="filter__item__input">
													<el-cascader placeholder="请选择省市" :props="cascaderProps"
														:options="regionData" v-model="formInline.SelectedOptions"
														clearable
														@change="handleChange"
														@clear ="handleClear"
														 />

												</div>
											</div>
											<div class="filter__item">
												<h5>专家名称</h5>
												<div class="filter__item__input">
													<el-input v-model="formInline.Title" placeholder="请输入您要检索的专家名称"
														clearable />
												</div>
											</div>

											<el-button type="primary" @click="doSearch()">立即搜索</el-button>
										</form>
									</el-col>
								</el-row>
							</el-row>
						</el-row>
						<!-- Search End -->
						<!--================Blog Area =================-->
						<section class="blog_area section-padding5">
							<div class="container">
								<div class="row">
									<el-col :span="6">
										<div class="blog_right_sidebar">
											<aside class="single_sidebar_widget post_category_widget">
												<h4 class="widget_title">专家咨询</h4>
												<div class="dbdtwrap">
													<div class="dbdtnav">
														<ul>
															<!-- <li class="dbdtnav-list">
																<h2 class="on">
																	<div></div>
																	案例分析
																	<i></i>
																</h2>
															</li> -->
															<!-- <li  v-for="item in menuList.filter(x => x.MenuChannelid != 0)"
																:key="item.Menuid" @click="menuClick(item.Menuid)" class="dbdtnav-list">
																<h2
																	:class="formInline.Menuid === item.Menuid ? 'on' : ''">
																	{{ item.Menutitle }}
																	<i></i>
																</h2>
															</li> -->


														</ul>
													</div>
												</div>
											</aside>

											<aside class="single_sidebar_widget popular_post_widget">
												<h3 class="widget_title">热门专家咨询</h3>
												<div class="media post_item" v-for="home in homeList" :key="ID">
													<el-image :src="config.CONFIG_IMGURL + home.pic"
														alt="post"></el-image>
													<div class="media-body">
														<a href="detail">
															<h3>{{ home.Title }}</h3>
														</a>
														<h3>{{ home.Author }}</h3>
														<p>{{ home.CreateTime?.split('T')[0] }}</p>
													</div>
												</div>

											</aside>
											<aside class="single_sidebar_widget tag_cloud_widget">
												<h4 class="widget_title">热搜Tag</h4>
												<ul class="list">

													<li v-for="tag in tagList">
														<a @click="tagClick(tag)">{{ tag }}</a>
													</li>

												</ul>
											</aside>
										</div>
									</el-col>

									<el-col :span="17" :gutter="20">
										<div class="blog_left_sidebar">
											<article class="blog_item">
												<div class="blog_top">
													<span>专家咨询</span>
													<div class="wrapper">
														<input id="exp1" class="exp" type="checkbox">
														<div class="text">
															<label class="btn_zs" for="exp1"></label>
															<div class="single_sidebar_widget tag_cloud_widget">
																<ul class="blist888">
																	 
																	<li v-for="tag in tagList">
																		<a @click="tagClick(tag)">{{ tag }}</a>
																	</li>
																</ul>
															</div>
														</div>
													</div>
												</div>

											</article>

											<article class="blog_item" v-for="page in pageList" :key="ID">
												<div class="blog_details">
													<div class="anlicss">
														<div class="btnanli01"><a class="d-inline-block"
																:href="'/newsdetails?id='+page.ID">
																<h2>{{ page.Title }}</h2>
															</a>
														</div>
														<!-- <div class="btnanli02">
															<div class="btn btn-ans"><a href="#">查阅</a></div>
															<div class="btn btn-ans"><a
																	:href="config.CONFIG_API + page.File">下载</a></div>
														</div> -->
													</div>
													<p>{{ page.Description }}
													</p>
													<div class="single_sidebar_widget tag_cloud_widget">
														<ul class="blist">
															<li v-for="tag in page.TAG?.split(',')">
																<a @click="tagClick(tag)">{{ tag }}</a>
															</li>

														</ul>
													</div>
													<ul class="blog-info-link">
														<li><a href="#"><i class="fa fa-comments"></i>{{
																page.Author }}</a>
														</li>
														<li><a href="#"><i class="fa fa-comments"></i>{{
																page.City }}</a>
														</li>
														<li><a href="#"><i class="fa fa-users"></i>{{ page.Clicks
																}}</a></li>
														<li><a href="#"><i class="fa fa-calendar-times"></i>{{
																page.CreateTime?.split('T')[0] }}</a>
														</li>
													</ul>
												</div>
											</article>




											<nav class="blog-pagination justify-content-center d-flex">

												<el-pagination v-model:current-page="pageRequest.CurrentPage"
													v-model:page-size="pageRequest.PageSize"
													:page-sizes="pageRequest.PageSizes" :small="small"
													:disabled="disabled" :background="background"
													layout="total, prev, pager, next, jumper" :total="pageRequest.total"
													@size-change="handleSizeChange"
													@current-change="handleCurrentChange" />
											</nav>
										</div>
									</el-col>

								</div>
							</div>
						</section>
						<!--================Blog Area =================-->
					</div>
				</div>
				<!-- End Nav Card -->
			</el-row>
		</el-row>
	</el-row>
	<!-- Services Ara End -->



</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getListByValue } from "@/api/settingitme";
import { getTagList, getMenuListByTitle, getHomeList, getArticleList, getById } from "@/api/news";
import { ElMessage } from 'element-plus'
import config from '@/utils/config';
import { regionData, CodeToText } from "element-china-area-data";


const handleClear = () => {
    console.log("清空")
    formInline.value.Province = '';
    formInline.value.City = '';
	formInline.value.SelectedOptions="请选择省市"
}
const handleChange = (val) => {
	if(!val)return
    console.log(val)
    if (val[0] != null ) {
        formInline.value.Province = val[0];
     }
	 if (val[1] != null) {
        formInline.value.City = val[1];
     }
}
const cascaderProps = ref({
    checkStrictly: true,      // 允许选择任意一级，不强制子级联动
    value: 'label',      // 使用 label 作为 value
    expandTrigger: 'hover',    // 子菜单通过 hover 展开（可选）

})

const menuClick = (menuid)=>{
	formInline.value.Menuid = menuid
	getPageList()

}
const doSearch = () => {
	formInline.value.Tag = null
	getPageList()

}
const tagClick = (tag) => {
	formInline.value.Tag = tag
	getPageList()


}

const formInline = ref({ Countries: "国内",Menuid:8 })
const selectedButton = ref('国内'); // 默认选中按钮1
const options = ref([])
// 根据选中的按钮过滤 options
const optionsShow = computed(() => {
	return options.value.filter(x => {
		if (selectedButton.value === '国内') {
			return x.Name.includes("中国");
		} else {
			return !x.Name.includes("中国");
		}
	});
});
// 根据选中的按钮切换背景颜色
const backgroundClass = computed(() =>
	selectedButton.value === '国内' ? 'bg-color-1' : 'bg-color-2',

);

// 切换选中的按钮
const toggleButton = (button) => {
	selectedButton.value = button;
	formInline.value = {} // 切换时清空
	formInline.value.Countries = button
	formInline.value.Menuid = 8
	getPageList()
};

const GetOptions = () => {
	getListByValue({ value: '法规发布组织', pinyin: true }).then((res) => {
		if (res.code) {
			console.log(res)
			options.value = res.data
			optionsShow.value = res.data
		} else {
			// ElMessage.error('Oops, this is a error message.')
			console.log(res.msg)

		}
	});
}
//分页列表
const pageRequest = ref({
	PastPage: 0,
	CurrentPage: 1,
	PageSize: 20,
	total: 0,
	PageSizes: [20, 100, 200, 300]
})
const handleSizeChange = (val) => {
	pageRequest.value.PageSize = val
	getPageList()
}
const handleCurrentChange = (val) => {
	pageRequest.value.CurrentPage = val
	getPageList()
}
const pageList = ref([])
const getPageList = () => {
	let data = { ...formInline.value, ...pageRequest.value }
	console.log(data)
	getArticleList(data).then(res => {
		console.log(res)
		if (res.code) {

			pageRequest.value.total = res.data.count
			pageList.value = res.data.data

		}
	})

	getAllTagList(formInline.value.Menuid)
	getFlagList(formInline.value.Menuid)
}
//tag列表
const tagList = ref([])
const getAllTagList = (menuid) => {

	getTagList({menuid:menuid}).then(res => {
		console.log(res)
		if (res.code) {
			tagList.value = res.data
		}
	})
}
//flag文章列表
const homeList = ref([])
const getFlagList = (menuid) => {
	getHomeList({menuid:menuid, flag: "h", num: 5 }).then(res => {
		console.log(res)
		if (res.code) {			
			homeList.value = res.data
		}
	})
}
//栏目列表
const menuList = ref([])
const getMenuList = () => {

	getMenuListByTitle({ title: "行业动态" }).then(res => {
		console.log(res)
		if (res.code) {
			menuList.value = res.data
			menuList.value = res.data.map(x => {
				return {
					Menuid: x.Menuid,
					Menutitle: x.Menutitle,
					MenuChannelid: x.MenuChannelid
				};
			})
			if(menuList.value[0]){
				menuList.value.unshift({ Menuid: null, Menutitle: "不限", MenuChannelid: 0 })
			}
			console.log(menuList.value)
		}
	})
}

onMounted(() => {
	// getMenuList()
	getPageList()
	
});

</script>

<style>
.background-container {
	display: flex;
	flex-direction: column;
	/* 纵向排列 */
	justify-content: center;
	/* 纵向居中 */
	align-items: center;
	/* 横向居中 */
	background-image: url('@/assets/images/背景@2x.png');
	background-size: cover;
	background-position: center;
	max-height: 760px;
	width: 100%;
	height: 760px;
	/* 设置高度为视口高度 */
	gap: 20px;
	/* 设置间隔距离 */

}

.lmbt {
	font-size: larger;
	font-weight: bolder;
}

.lmjj {
	font-size: small;
}

button {
	padding: 10px 20px;
	margin: 0;
	font-size: 16px;
	cursor: pointer;
	border: 0px;
}

/* 按钮选中时的样式 */
button.active {
	background-color: #375498;
	color: white;
}

/* 背景色类 */
.bg-color-1 {
	background-color: #f0f8ff;
}

.bg-color-2 {
	background-color: #ffe4e1;
}

.right-align {
	display: flex;
	justify-content: flex-end;
	/* 右对齐 */
	align-items: center;
}

.sosuo {
	display: flex;
	justify-content: space-between;
	height: 120px;
	margin-top: 10px;
}

.sosuocol {
	display: flex;
	flex-direction: column;
	/* align-items: center; */
	justify-content: center
}

.sosuotitle {
	font-size: larger;
	font-weight: bolder;
	margin-bottom: 10px;
}
</style>