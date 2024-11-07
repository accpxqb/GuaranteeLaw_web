<template>
  <div class="bg-div" :style="{ minHeight: `${height - 310}px` }">
    <el-row justify="center" :style="{ height: `${height - 310}px` }">
      <el-col :span="16" class="flex-col">
        <div>
          <span class="title">消费者服务热线</span>
          <div style="display: flex; justify-content: space-between">
            <div class="card">
              <div style="text-align: center">
                <img
                  src="../../assets/images/contact-us/phone.png"
                  style="width: 4em"
                />
              </div>
              <div class="subject">联系电话</div>
              <div class="description">+86 166 5316 3336</div>
            </div>
            <div class="card" style="margin-left: 2em; margin-right: 2em">
              <div style="text-align: center">
                <img
                  src="../../assets/images/contact-us/location.png"
                  style="width: 4em"
                />
              </div>
              <div class="subject">公司地址</div>
              <div class="description">山东省济南市高新区中铁财智中心22层</div>
            </div>
            <div class="card">
              <div style="text-align: center">
                <img
                  src="../../assets/images/contact-us/email.png"
                  style="width: 4em"
                />
              </div>
              <div class="subject">邮箱账号</div>
              <div class="description">info@yangrongsoft.com</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();
</script>
<style scoped>
.card {
  padding-top: 3em;
  padding-bottom: 3em;
  /* padding-left: 6em;
  padding-right: 6em; */
  border-radius: 4px;
  background-color: #f5f5f5;
  margin-top: 1em;
  width: 20em;
}
.subject {
  font-size: large;
  font-weight: bold;
  text-align: center;
  margin-top: 1em;
}
.description {
  color: #666666;
  margin-top: 0.5em;
  text-align: center;
}
.title {
  font-size: large;
  font-weight: bold;
}
.flex-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
