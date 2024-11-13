<template>

  <div class="background-container">
    <!-- 其他内容 -->
    <div class="lmbt">法律法规</div>
    <div class="lmjj">法律法规简介</div>
  </div>
  <div>
    <el-row justify="center" align="middle">
      <el-col :span="16">
        <el-row style="margin-top: 10px;">
          <el-col :span="12" justify="start">法律法规</el-col>
          <el-col :span="12" justify="end" class="right-align">
            <div>
              <button @click="toggleButton('国内')" :class="{ active: selectedButton === '国内' }">国内</button>
              <button @click="toggleButton('国外')" :class="{ active: selectedButton === '国外' }">国外</button>
            </div>

          </el-col>
        </el-row>
        <el-row class="sosuo" style="">
          <el-col class="sosuocol" :span="6" style="">
            <div class="sosuotitle">发布者组织体</div>
            <el-select v-model="formInline.PublishOrganization" clearable placeholder="请选择" style="width: 240px">
              <el-option v-for="item in options" :key="item.Id" :label="item.Value" :value="item.Value" />
            </el-select>
          </el-col>
          <el-col class="sosuocol" :span="6">
            <div class="sosuotitle">法律名称</div>

            <el-input v-model="formInline.LegalName" style="width: 240px" placeholder="请输入您要检索的法律名称" clearable />
          </el-col>
          <el-col class="sosuocol" :span="6">
            <div class="sosuotitle">文献内容</div>

            <el-input v-model="formInline.Content" style="width: 240px" placeholder="请输入您要检索的文献内容" clearable />

          </el-col>
          <el-col :span="6">
            <el-button style="width: 100%;height: 100%;" type="primary">立即搜索</el-button>

          </el-col>

        </el-row>

        <el-row class="lmcontent" :gutter="20">
          <el-col class="contentLeft" :span="7">
            <div class="demo-collapse">
              法律法规
            </div>
          </el-col>
          <el-col class="contentLeft" :span="17">

          </el-col>
        </el-row>



      </el-col>
    </el-row>
  </div>

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