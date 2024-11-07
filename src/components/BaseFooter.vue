<template>
  <div style="height: 260px">
    <el-row
      justify="center"
      style="background-color: #eaeaea; padding-top: 20px; padding-bottom: 20px"
    >
      <el-col :span="4" class="justify-center-col">
        <el-space direction="vertical" alignment="flex-start">
          <span class="footer-title-span">用户帮助</span>
          <!-- <el-link
          href="https://element-plus.org"
          target="_blank"
          style="font-size: small"
          >申请退款</el-link
        > -->
          <el-link
            href="https://helpcenter.welearth.com/userAgreement"
            target="_blank"
            style="font-size: small"
          >
            用户协议
          </el-link>
          <!-- <el-link
          href="https://element-plus.org"
          target="_blank"
          style="font-size: small"
          >反诈骗公告</el-link
        >
        <el-link
          href="https://element-plus.org"
          target="_blank"
          style="font-size: small"
          >消费者权益保障</el-link
        > -->
          <span class="footer-title-span" style="margin-top: 1em">
            公司规则
          </span>
          <el-link
            href="https://helpcenter.welearth.com/Corp/privacy"
            target="_blank"
            style="font-size: small"
          >
            隐私政策
          </el-link>
        </el-space>
      </el-col>
      <el-divider direction="vertical" class="customer-divider" />
      <!-- <el-col :span="4" class="justify-center-col"> -->
      <!-- <el-space direction="vertical" alignment="flex-start"> -->
      <!-- <span class="footer-title-span">加盟合作</span> -->
      <!-- <el-link
          href="https://element-plus.org"
          target="_blank"
          style="font-size: small"
        >
          代理合作
        </el-link> -->
      <!-- <el-link
          href="https://element-plus.org"
          target="_blank"
          style="font-size: small"
        >
          商家入驻
        </el-link> -->
      <!-- <span class="footer-title-span">公司规则</span> -->
      <!-- <el-link
            href="https://helpcenter.welearth.com/Corp/privacy"
            target="_blank"
            style="font-size: small"
          >
            隐私政策 -->
      <!-- </el-link> -->
      <!-- <el-link href="https://element-plus.org" target="_blank" style="font-size:small;">规则中心</el-link>
                <el-link href="https://element-plus.org" target="_blank" style="font-size:small;">规则目录</el-link>
                <el-link href="https://element-plus.org" target="_blank" style="font-size:small;">规则评议院</el-link> -->
      <!-- </el-space> -->
      <!-- </el-col> -->
      <!-- <el-divider direction="vertical" class="customer-divider" /> -->
      <el-col :span="4" class="justify-center-col">
        <el-space direction="vertical" alignment="flex-start">
          <span class="footer-title-span">公司信息</span>
          <el-link
            href="https://helpcenter.welearth.com/Corp/aboutUs"
            target="_blank"
            style="font-size: small"
          >
            关于我们
          </el-link>
          <!-- <el-link href="https://helpcenter.welearth.com/Corp/privacy" target="_blank" style="font-size:small;">隐私政策</el-link> -->
          <el-link
            href="https://helpcenter.welearth.com/Corp/law"
            target="_blank"
            style="font-size: small"
          >
            法律声明
          </el-link>
          <!-- <el-link
          href="https://element-plus.org"
          target="_blank"
          style="font-size: small"
        >
          知识产权
        </el-link>
        <el-link
          href="https://element-plus.org"
          target="_blank"
          style="font-size: small"
        >
          用户协议
        </el-link>
        <el-link
          href="https://element-plus.org"
          target="_blank"
          style="font-size: small"
        >
          营业执照
        </el-link>
        <el-link
          href="https://element-plus.org"
          target="_blank"
          style="font-size: small"
        >
          商业诚信公约及管理办法
        </el-link> -->
        </el-space>
      </el-col>
      <el-divider direction="vertical" class="customer-divider" />
      <el-col :span="4" class="justify-center-col">
        <el-space direction="vertical" alignment="flex-start">
          <span class="footer-title-span">联系我们</span>
          <span style="color: #606266; font-size: small">
            境内：+86 166 5316 3336
          </span>
          <span style="color: #606266; font-size: small">
            境外：+86 166 5316 3336
          </span>
          <span style="color: #606266; font-size: small">
            邮箱账号：info@yangrongsoft.com
          </span>
        </el-space>
      </el-col>
      <el-col :span="4">
        <div style="display: flex; justify-content: space-between">
          <div style="text-align: center">
            <!-- <div
              style="width: 120px; height: 120px; background-color: white"
            ></div> -->
            <img style="width: 120px" src="../assets/images/mini_qccode.png" />
            <div style="color: #00ae18; margin-top: 5px">扫码进入小程序</div>
          </div>
          <!-- <div style="text-align: center">
            <div
              style="width: 120px; height: 120px; background-color: white"
            ></div>
            <div style="color: #00ae18; margin-top: 5px">扫码下载APP</div>
          </div> -->
        </div>
      </el-col>
    </el-row>
    <el-row justify="center" style="background-color: #eaeaea; height: 20px">
      <el-col :span="12" class="justify-center-col">
        <el-space :spacer="spacer">
          <span style="color: #606266; font-size: 14px">
            <el-link
              href="https://www.beian.gov.cn/portal/registerSystemInfo"
              target="_blank"
            >
              鲁公网安备 37010102000549号
            </el-link>
          </span>
          <span style="color: #606266; font-size: 14px">
            <el-link href="https://beian.miit.gov.cn/" target="_blank">
              鲁ICP备18010504号-3
            </el-link>
          </span>
          <span style="color: #606266; font-size: 14px">
            © {{ currentYear }} YangRongSoft. All rights reserved.
          </span>
        </el-space>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from "vue";
import { ElDivider } from "element-plus";
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
