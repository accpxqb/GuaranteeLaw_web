<template>
  <!-- Hero Section Begin -->
  <section class="hero spad set-bg" data-setbg="./src/assets/img/hero/h1_hero.jpg" style="background-image: url('./src/assets/img/hero/h1_hero.jpg');">
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
  					<h2>法律法规</h2>
  				</div>
  			</div>
  			<div class="col-xl-6 col-lg-6">
  				<div class="properties__button">
  					<!--Nav Button  -->
  					<nav>
  						<div class="nav nav-tabs" id="nav-tab" role="tablist">
								<button class="nav-item nav-link" @click="toggleButton('国内')" :class="{ active: selectedButton === '国内' }">国内</button>
								<button class="nav-item nav-link" @click="toggleButton('国外')" :class="{ active: selectedButton === '国外' }">国外</button>
  						</div>
  					</nav>
  					<!--End Nav Button  -->
  				</div>
  			</div>
  		</div>
  		<!-- Nav Card -->
  		<div class="tab-content" id="nav-tabContent">
  			<!-- card one -->
  			<div class="tab-pane fade show active" id="nav-home" role="tabpanel"
  				aria-labelledby="nav-home-tab">
  				<!-- Search Begin -->
  				<el-row class="">
  				    <el-row class="container">
  				        <el-row class="row">
  				            <el-col  :span="24">
  				                <form action="#" class="filter__form">
  									<div class="filter__item last__item">
  									    <h5>发布者组织体</h5>
										<div class="filter__item__input">
  									    <el-select class="nice-select" v-model="formInline.PublishOrganization" clearable placeholder="请选择">
  									      <el-option v-for="item in options" :key="item.Id" :label="item.Value" :value="item.Value" />
  									    </el-select>
										</div>
  									</div>
  				                    <div class="filter__item">
  				                        <h5>法律名称</h5>
  				                        <div class="filter__item__input">
  				                            <el-input v-model="formInline.LegalName" placeholder="请输入您要检索的法律名称" clearable />
  				                        </div>
  				                    </div>
  				                    <div class="filter__item">
  				                        <h5>文献内容</h5>
										<div class="filter__item__input">
										    <el-input v-model="formInline.Content" placeholder="请输入您要检索的文献内容" clearable />
										</div>
  				                    </div>
									<el-button type="submit">立即搜索</el-button>
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
  							<el-col  :span="6">
  								<div class="blog_right_sidebar">
  									<aside class="single_sidebar_widget post_category_widget">
  										<h4 class="widget_title">法律法规</h4>
  										<div class="dbdtwrap">
  											<div class="dbdtnav">
  												<ul>
  													<li class="dbdtnav-list">
  														<h2 class="on">
  															<div></div>
  															法律法规
  															<i></i>
  														</h2>
  													</li>
  													<li class="dbdtnav-list">
  														<h2>融资租赁
  															<i></i>
  														</h2>
  													</li>
  													<li class="dbdtnav-list">
  														<h2>保理
  															<i></i>
  														</h2>
  													</li>
  													<li class="dbdtnav-list">
  														<h2>其他
  															<i></i>
  														</h2>
  													</li>
  												</ul>
  											</div>
  										</div>
  									</aside>
  				
  									<aside class="single_sidebar_widget popular_post_widget">
  										<h3 class="widget_title">热门法律法规</h3>
  										<div class="media post_item">
  											<el-image src="../../src/assets/img/post/post_1.png" alt="post"></el-image>
  											<div class="media-body">
  												<a href="tongyong_details.html">
  													<h3>文章1文章1文章1文章1...</h3>
  												</a>
  												<p>2024-11-05</p>
  											</div>
  										</div>
  										<div class="media post_item">
  											<el-image src="../../src/assets/img/post/post_1.png" alt="post"></el-image>
  											<div class="media-body">
  												<a href="#">
  													<h3>文章1文章1文章1文章1...</h3>
  												</a>
  												<p>2024-11-05</p>
  											</div>
  										</div>
  										<div class="media post_item">
  											<el-image src="../../src/assets/img/post/post_1.png" alt="post"></el-image>
  											<div class="media-body">
  												<a href="#">
  													<h3>文章1文章1文章1文章1...</h3>
  												</a>
  												<p>2024-11-05</p>
  											</div>
  										</div>
  										<div class="media post_item">
  											<el-image src="../../src/assets/img/post/post_1.png" alt="post"></el-image>
  											<div class="media-body">
  												<a href="#">
  													<h3>文章1文章1文章1文章1...</h3>
  												</a>
  												<p>2024-11-05</p>
  											</div>
  										</div>
  									</aside>
  									<aside class="single_sidebar_widget tag_cloud_widget">
  										<h4 class="widget_title">热搜Tag</h4>
  										<ul class="list">
  											<li>
  												<a href="#">财政</a>
  											</li>
  											<li>
  												<a href="#">专项资金</a>
  											</li>
  											<li>
  												<a href="#">人才</a>
  											</li>
  											<li>
  												<a href="#">富民创业</a>
  											</li>
  											<li>
  												<a href="#">数字人民币</a>
  											</li>
  											<li>
  												<a href="#">民营企业</a>
  											</li>
  											<li>
  												<a href="#">高质量发展</a>
  											</li>
  											<li>
  												<a href="#">环境保护</a>
  											</li>
  										</ul>
  									</aside>
  								</div>
  							</el-col>
  				
  							<el-col  :span="17"  :gutter="20">
  								<div class="blog_left_sidebar">
  									<article class="blog_item">
  										<div class="blog_top">
  											<span>法律法规</span>
  											<div class="wrapper">
  												<input id="exp1" class="exp" type="checkbox">
  												<div class="text">
  													<label class="btn_zs" for="exp1"></label>
  													<div class="single_sidebar_widget tag_cloud_widget">
  														<ul class="blist888">
  															<li>
  																<a href="#">财政</a>
  															</li>
  															<li>
  																<a href="#">专项资金</a>
  															</li>
  															<li>
  																<a href="#">人才</a>
  															</li>
  															<li>
  																<a href="#">富民创业</a>
  															</li>
  															<li>
  																<a href="#">数字人民币</a>
  															</li>
  															<li>
  																<a href="#">财政</a>
  															</li>
  															<li>
  																<a href="#">专项资金</a>
  															</li>
  															<li>
  																<a href="#">人才</a>
  															</li>
  															<li>
  																<a href="#">富民创业</a>
  															</li>
  															<li>
  																<a href="#">数字人民币</a>
  															</li>
  															<li>
  																<a href="#">财政</a>
  															</li>
  															<li>
  																<a href="#">专项资金</a>
  															</li>
  															<li>
  																<a href="#">人才</a>
  															</li>
  															<li>
  																<a href="#">富民创业</a>
  															</li>
  															<li>
  																<a href="#">财政</a>
  															</li>
  															<li>
  																<a href="#">专项资金</a>
  															</li>
  															<li>
  																<a href="#">人才</a>
  															</li>
  															<li>
  																<a href="#">富民创业</a>
  															</li>
  															<li>
  																<a href="#">数字人民币</a>
  															</li>
  															<li>
  																<a href="#">财政</a>
  															</li>
  															<li>
  																<a href="#">专项资金</a>
  															</li>
  															<li>
  																<a href="#">人才</a>
  															</li>
  															<li>
  																<a href="#">富民创业</a>
  															</li>
  														</ul>
  													</div>
  												</div>
  											</div>
  										</div>
  										<div class="blog_details">
  											<div class="anlicss">
  											<div class="btnanli01"><a class="d-inline-block" href="tongyong_details.html">
  												<h2>法律名称</h2>
  											</a>
  											</div>
  											<div class="btnanli02">
  												<div class="btn btn-ans"><a href="#">查阅</a></div>
  												<div class="btn btn-ans"><a href="#">下载</a></div>
  											</div>
  											</div>
  											<p>文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情。
  											</p>
  											<div class="single_sidebar_widget tag_cloud_widget">
  												<ul class="blist">
  													<li>
  														<a href="#">发布</a>
  													</li>
  													<li>
  														<a href="#">翻译者</a>
  													</li>
  													<li>
  														<a href="#">人才</a>
  													</li>
  													<li>
  														<a href="#">富民创业</a>
  													</li>
  													<li>
  														<a href="#">数字人民币</a>
  													</li>
  												</ul>
  											</div>
  											<ul class="blog-info-link">
  												<li><a href="#"><i class="fa fa-comments"></i>发布组织体</a></li>
  												<li><a href="#"><i class="fa fa-users"></i>翻译者</a></li>
  												<li><a href="#"><i class="fa fa-calendar-times"></i>2024-11-01</a></li>
  											</ul>
  										</div>
  									</article>
  				
  									<article class="blog_item">
  										<div class="blog_details">
  											<div class="anlicss">
  											<div class="btnanli01"><a class="d-inline-block" href="tongyong_details.html">
  												<h2>法律名称</h2>
  											</a>
  											</div>
  											<div class="btnanli02">
  												<div class="btn btn-ans"><a href="#">查阅</a></div>
  												<div class="btn btn-ans"><a href="#">下载</a></div>
  											</div>
  											</div>
  											<p>文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情。
  											</p>
  											<div class="single_sidebar_widget tag_cloud_widget">
  												<ul class="blist">
  													<li>
  														<a href="#">财政</a>
  													</li>
  													<li>
  														<a href="#">专项资金</a>
  													</li>
  													<li>
  														<a href="#">人才</a>
  													</li>
  													<li>
  														<a href="#">富民创业</a>
  													</li>
  													<li>
  														<a href="#">数字人民币</a>
  													</li>
  												</ul>
  											</div>
  											<ul class="blog-info-link">
  												<li><a href="#"><i class="fa fa-comments"></i>发布组织体</a></li>
  												<li><a href="#"><i class="fa fa-users"></i>翻译者</a></li>
  												<li><a href="#"><i class="fa fa-calendar-times"></i>2024-11-01</a></li>
  											</ul>
  										</div>
  									</article>
  				
  									<article class="blog_item">
  										<div class="blog_details">
  											<div class="anlicss">
  											<div class="btnanli01"><a class="d-inline-block" href="tongyong_details.html">
  												<h2>法律名称</h2>
  											</a>
  											</div>
  											<div class="btnanli02">
  												<div class="btn btn-ans"><a href="#">查阅</a></div>
  												<div class="btn btn-ans"><a href="#">下载</a></div>
  											</div>
  											</div>
  											<p>文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情。
  											</p>
  											<div class="single_sidebar_widget tag_cloud_widget">
  												<ul class="blist">
  													<li>
  														<a href="#">财政</a>
  													</li>
  													<li>
  														<a href="#">专项资金</a>
  													</li>
  													<li>
  														<a href="#">人才</a>
  													</li>
  													<li>
  														<a href="#">富民创业</a>
  													</li>
  													<li>
  														<a href="#">数字人民币</a>
  													</li>
  												</ul>
  											</div>
  											<ul class="blog-info-link">
  												<li><a href="#"><i class="fa fa-comments"></i>发布组织体</a></li>
  												<li><a href="#"><i class="fa fa-users"></i>翻译者</a></li>
  												<li><a href="#"><i class="fa fa-calendar-times"></i>2024-11-01</a></li>
  											</ul>
  										</div>
  									</article>
  				
  									<article class="blog_item">
  										<div class="blog_details">
  											<div class="anlicss">
  											<div class="btnanli01"><a class="d-inline-block" href="tongyong_details.html">
  												<h2>法律名称</h2>
  											</a>
  											</div>
  											<div class="btnanli02">
  												<div class="btn btn-ans"><a href="#">查阅</a></div>
  												<div class="btn btn-ans"><a href="#">下载</a></div>
  											</div>
  											</div>
  											<p>文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情。
  											</p>
  											<div class="single_sidebar_widget tag_cloud_widget">
  												<ul class="blist">
  													<li>
  														<a href="#">财政</a>
  													</li>
  													<li>
  														<a href="#">专项资金</a>
  													</li>
  													<li>
  														<a href="#">人才</a>
  													</li>
  													<li>
  														<a href="#">富民创业</a>
  													</li>
  													<li>
  														<a href="#">数字人民币</a>
  													</li>
  												</ul>
  											</div>
  											<ul class="blog-info-link">
  												<li><a href="#"><i class="fa fa-comments"></i>发布组织体</a></li>
  												<li><a href="#"><i class="fa fa-users"></i>翻译者</a></li>
  												<li><a href="#"><i class="fa fa-calendar-times"></i>2024-11-01</a></li>
  											</ul>
  										</div>
  									</article>
  				
  									<article class="blog_item">
  										<div class="blog_details">
  											<div class="anlicss">
  											<div class="btnanli01"><a class="d-inline-block" href="tongyong_details.html">
  												<h2>法律名称</h2>
  											</a>
  											</div>
  											<div class="btnanli02">
  												<div class="btn btn-ans"><a href="#">查阅</a></div>
  												<div class="btn btn-ans"><a href="#">下载</a></div>
  											</div>
  											</div>
  											<p>文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情。
  											</p>
  											<div class="single_sidebar_widget tag_cloud_widget">
  												<ul class="blist">
  													<li>
  														<a href="#">财政</a>
  													</li>
  													<li>
  														<a href="#">专项资金</a>
  													</li>
  													<li>
  														<a href="#">人才</a>
  													</li>
  													<li>
  														<a href="#">富民创业</a>
  													</li>
  													<li>
  														<a href="#">数字人民币</a>
  													</li>
  												</ul>
  											</div>
  											<ul class="blog-info-link">
  												<li><a href="#"><i class="fa fa-comments"></i>发布组织体</a></li>
  												<li><a href="#"><i class="fa fa-users"></i>翻译者</a></li>
  												<li><a href="#"><i class="fa fa-calendar-times"></i>2024-11-01</a></li>
  											</ul>
  										</div>
  									</article>
  				
  									<nav class="blog-pagination justify-content-center d-flex">
  										<ul class="pagination">
  											<li class="page-item">
  												<a href="#" class="page-link" aria-label="Previous">
  													<i class="ti-angle-left"></i>
  												</a>
  											</li>
  											<li class="page-item">
  												<a href="#" class="page-link">1</a>
  											</li>
  											<li class="page-item active">
  												<a href="#" class="page-link">2</a>
  											</li>
  											<li class="page-item">
  												<a href="#" class="page-link" aria-label="Next">
  													<i class="ti-angle-right"></i>
  												</a>
  											</li>
  										</ul>
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
import { getTagList,getList,getHomeList } from "@/api/guarantee";
import { ElMessage } from 'element-plus'

const formInline = ref({})
const selectedButton = ref('国内'); // 默认选中按钮1

// 根据选中的按钮切换背景颜色
const backgroundClass = computed(() =>
  selectedButton.value === '国内' ? 'bg-color-1' : 'bg-color-2'
);

// 切换选中的按钮
const toggleButton = (button) => {
  selectedButton.value = button;
};
const options = ref([])
const GetOptions = () => {
  getListByValue({ value: '法规发布组织', pinyin: true }).then((res) => {
    if (res.code) {
      console.log(res)
      options.value = res.data
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
    total:0,
    PageSizes:[20, 100, 200, 300]
})
const request = ref({
     
})
const getPageList = ()=>{
    let data = { ...request.value, ...pageRequest.value }
    console.log(data)
    getList(data).then(res=>{
        console.log(res)
        if(res.code){
             
            pageRequest.value.total=res.data.count
             
            
        }
    })
}
//tag列表
const getAllTagList = ()=>{
 
    getTagList().then(res=>{
        console.log(res)
        if(res.code){
             
            
        }
    })
}
//flag文章列表
const getFlagList = ()=>{
    
    getHomeList({flag:"h",num:5}).then(res=>{
        console.log(res)
        if(res.code){
             
            
        }
    })
}

onMounted(() => {
  GetOptions()
  getPageList()
  getAllTagList()
  getFlagList()
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

.sosuo{
  display: flex; justify-content: space-between;height: 120px;margin-top: 10px;
}
.sosuocol {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center
}
 
.sosuotitle{
  font-size: larger;
  font-weight: bolder;
  margin-bottom: 10px;
}
</style>