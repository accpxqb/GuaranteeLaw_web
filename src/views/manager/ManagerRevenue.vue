<template>
  <div class="demoTitle" style="height: 100px; margin-top: 20px">
    <el-row :gutter="20" class="white-row" style="margin: 0">
      <el-col :span="4">
        <el-image :src="logo" />
      </el-col>
      <el-col :span="20">
        <el-row :gutter="20" class="white-row" style="margin-top: 20px">
          <el-col :span="4" style="font-size: larger">
            {{ t("ManagerRevenueLocale.MyWallet") }}
          </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row" style="margin-top: 10px">
          <el-col :span="8" style="font-size: small">
            {{ t("ManagerRevenueLocale.UserName") }}{{ formModel.UserName }}
          </el-col>
          <el-col :span="11" v-if="!formModel.IsPayPassword">
            <el-space
              size="large"
              style="height: 30px; padding-left: 15px"
              class="unbindcol"
            >
              {{ "未设置提现密码" }}
              <el-button
                type="warning"
                @click="router.push({ name: 'SecuritySetting' })"
                link
                >{{ "去设置" }}</el-button
              >
            </el-space>
          </el-col>
          <el-col
            :span="11"
            v-else-if="!(formModel.AliPayId || formModel.WeChatId)"
          >
            <el-space
              size="large"
              style="height: 30px; padding-left: 15px"
              class="unbindcol"
            >
              {{ t("ManagerRevenueLocale.Unbind") }}
              <el-button type="warning" @click="goBind" link>{{
                t("ManagerRevenueLocale.GoBind")
              }}</el-button>
            </el-space>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
  <div class="demo-form demo-block">
    <div class="source">
      <el-row :gutter="20" class="white-row my-row" style="height: 200px">
        <el-col :span="8" class="my-col">
          <el-space alignment="flex-end" size="large">
            <el-space direction="vertical" alignment="flex-start">
              <el-text class="mx-1" size="large">{{
                t("ManagerRevenueLocale.SettledAmount")
              }}</el-text>
              <el-text
                class="mx-1"
                tag="b"
                style="font-size: larger; margin-top: 10px"
                >{{ number_format(formModel.SettledAmount) }}元</el-text
              >
            </el-space>
            <el-button type="success" plain @click="btnGoCashOut">{{
              t("ManagerRevenueLocale.GoCashOut")
            }}</el-button>
          </el-space>
        </el-col>
        <el-col
          class="my-col"
          :span="8"
          style="
            border-left: 1px solid #ebebeb;
            border-right: 1px solid #ebebeb;
          "
        >
          <el-space direction="vertical" alignment="flex-start">
            <el-row>
              <el-text class="mx-1" size="large">累计收入</el-text>
              <el-button
                @click="IncomeLogVisible = !IncomeLogVisible"
                class="btnshow"
                link
                type="primary"
                >收入记录</el-button
              >
            </el-row>

            <el-text
              class="mx-1"
              tag="b"
              style="font-size: larger; margin-top: 10px"
              >{{ number_format(formModel.AccumulatedIncome) }}元</el-text
            >
          </el-space>
        </el-col>
        <el-col class="my-col" :span="8">
          <el-space direction="vertical" alignment="flex-start">
            <el-row>
              <el-text class="mx-1" size="large">{{
                t("ManagerRevenueLocale.AccumulatedAmount")
              }}</el-text>
              <el-button
                @click="logListVisible = !logListVisible"
                class="btnshow"
                link
                type="primary"
                >{{ t("ManagerRevenueLocale.showLog") }}</el-button
              >
            </el-row>

            <el-text
              class="mx-1"
              tag="b"
              style="font-size: larger; margin-top: 10px"
            >
              {{ number_format(formModel.AccumulatedAmount) }}元</el-text
            >
          </el-space>
        </el-col>
      </el-row>
    </div>
  </div>
  <el-dialog
    v-model="cashoutDialogVisible"
    :title="t('ManagerRevenueLocale.Select')"
    width="350px"
  >
    <el-form
      ref="formEl"
      :rules="rules"
      :model="formModel"
      label-width="280px"
      label-position="left"
    >
      <el-form-item
        v-if="formModel.AliPayId"
        class="col-form-item formrow"
        @click="selectAccount('1')"
      >
        <template #label>
          <el-space style="margin-top: 4px; margin-left: 10px">
            <el-image
              :src="alipaylogo"
              style="width: 20px; height: 20px; margin: 1px"
            />
            {{ t("ManagerRevenueLocale.GoAlipay") }}
          </el-space>
        </template>
        <el-radio
          v-model="formModel.TargetAccount"
          label="1"
          size="large"
          :disabled="!formModel.AliPayId"
        >
          {{ "" }}
        </el-radio>
      </el-form-item>
      <el-form-item
        v-if="formModel.WeChatId"
        class="col-form-item formrow"
        @click="selectAccount('2')"
      >
        <template #label>
          <el-space style="margin-top: 4px; margin-left: 10px">
            <el-image
              :src="wechatlogo"
              style="width: 20px; height: 20px; margin: 1px"
            />
            {{ t("ManagerRevenueLocale.GoWechat") }}
          </el-space>
        </template>
        <el-radio
          v-model="formModel.TargetAccount"
          label="2"
          size="large"
          :disabled="!formModel.WeChatId"
        >
          {{ "" }}
        </el-radio>
      </el-form-item>
      <el-form-item class="col-form-item" prop="CashoutPwd" label-width="0px">
        <el-input
          show-password
          v-model="formModel.CashoutPwd"
          :placeholder="t('ManagerRevenueLocale.CashoutPwd')"
          class="input-bolded"
          maxlength="6"
        />
      </el-form-item>
      <el-form-item class="col-form-item" prop="Amount" label-width="0px">
        <el-input
          v-model="formModel.Amount"
          :placeholder="t('ManagerRevenueLocale.Amount')"
          class="input-bolded"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cashoutDialogVisible = false">{{
          t("button.Cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="GoCashOut(formEl)"
          :disabled="!formModel.AliPayId && !formModel.WeChatId"
        >
          {{ t("button.BeSure") }}
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="logListVisible"
    :title="t('ManagerRevenueLocale.revenuelog')"
    width="70%"
    destroy-on-close
  >
    <logList :TradeType="3"></logList>
  </el-dialog>
  <el-dialog
    v-model="IncomeLogVisible"
    title="收入记录"
    width="70%"
    destroy-on-close
  >
    <IncomeLog> </IncomeLog>
  </el-dialog>
</template>
<script lang="ts" setup>
import logo from "@/assets/images/ManagerRevenueLogo.png";
import wechatlogo from "@/assets/images/wechat@2x.png";
import alipaylogo from "@/assets/images/alipay@2x.png";
import { ref, reactive, onBeforeMount } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { number_format } from "@/utils/formatter";
import { useI18n } from "vue-i18n";
import { getManager, GetManagerRevenue } from "@/api/user.js";
import router from "@/router";
import { ElMessageBox, ElMessage } from "element-plus";
import { withdrawal } from "@/api/manager";
import logList from "@/views/manager/comment/ManagerrevenuelogList.vue";
import IncomeLog from "@/views/manager/comment/IncomeLog.vue";

const { t } = useI18n();

const btnGoCashOut = () => {
  if (!formModel.IsPayPassword) {
    ElMessage.error("请先设置提现密码");
    //setTimeout(() => {
    router.push({ path: "/manager/SecuritySetting" });
    //}, 100);
    return;
  }
  if (formModel.AliPayId == null && formModel.WeChatId == null) {
    ElMessage.error("请先绑定提现账户");
    // setTimeout(() => {
    //   router.push({ path: '/manager/CashoutSetting' })
    // }, 100);
    router.push({ path: "/manager/CashoutSetting" });
    return;
  }

  cashoutDialogVisible.value = true;
};
const cashoutDialogVisible = ref(false);
const formEl = ref<FormInstance>();
const logListVisible = ref(false);
const IncomeLogVisible = ref(false);

interface ManagerRevenue {
  UserId?: number;
  UserName?: string;
  UnSettledAmount?: number;
  SettledAmount?: number;
  CashoutPwd: string;
  WeChatId?: string;
  AliPayId?: string;
  TargetAccount: string;
  Amount: number; //提现金额
  AccumulatedAmount?: number; //累计提现
  AccumulatedIncome?: number; //累计提现
  IsPayPassword: boolean; //是否设置提现密码
}

const formModel = reactive<ManagerRevenue>({
  TargetAccount: "1",
  CashoutPwd: "",
  Amount: 200,
  IsPayPassword: false,
});

onBeforeMount(() => {
  getManagerss();
});

const getManagerss = () => {
  GetManagerRevenue().then((x: any) => {
    formModel.UserId = x.data.UserId;
    formModel.UserName = x.data.UserName;
    formModel.UnSettledAmount = x.data.UnSettledAmount;
    formModel.SettledAmount = x.data.SettledAmount;
    formModel.WeChatId = x.data.WeChatId;
    formModel.AliPayId = x.data.AliPayId;
    formModel.AccumulatedAmount = x.data.AccumulatedAmount;
    formModel.IsPayPassword = x.data.IsPayPassword;
    formModel.AccumulatedIncome = x.data.AccumulatedIncome;
  });
};

const GoCashOut = (form: any) => {
  cashoutDialogVisible.value = false;
  form.validateField(["CashoutPwd"], (valid: any) => {
    if (valid) {
      if (formModel.TargetAccount == "") {
        ElMessage.error(t("ManagerRevenueLocale.selectAccount"));
        return;
      }
      if (formModel.Amount > (formModel.SettledAmount ?? 0)) {
        ElMessage.error(t("ManagerRevenueLocale.InsufficientAmount"));
        return;
      }
      let data = {
        money: formModel.Amount,
        paypwd: formModel.CashoutPwd,
        paymentMethod: formModel.TargetAccount,
      };
      withdrawal(data).then((res: any) => {
        if (res.code) {
          ElMessage.success(t("ManagerRevenueLocale.submit"));
          getManagerss();
        } else {
          ElMessage.error(res.msg);
        }
      });
    } else {
      ElMessage.error(t("ManagerRevenueLocale.CashoutPwd"));
    }
  });
};

const goBind = () => {
  router.push({ name: "CashoutSetting" });
};
const selectAccount = (selected: string) => {
  if (selected == "1" && formModel.AliPayId) {
    formModel.TargetAccount = "1";
  } else if (selected == "2" && formModel.WeChatId) {
    formModel.TargetAccount = "2";
  }
};
const rules = reactive<FormRules>({
  CashoutPwd: [
    {
      required: true,
      message: t("ManagerRevenueLocale.CashoutPwd"),
      trigger: "blur",
    },
  ],
  Amount: [
    {
      required: true,
      message: t("ManagerRevenueLocale.Amount"),
      trigger: "blur",
    },
  ],
});
</script>
<style scoped>
.el-image {
  margin-top: -44px;
}

.unbindcol {
  background-color: rgba(0, 0, 0, 0.4);
  font-size: small;
  height: 30px;
  border-radius: 10px;
}

.formrow {
  border-radius: 4px;
  border: 1px solid #ebebeb;
}
.source {
  padding: 24px 10px 24px 10px !important;
}
.my-col {
  padding-left: 30px !important;
}
.btnshow {
  margin-top: 3px;
  margin-left: 20px;
}
</style>
