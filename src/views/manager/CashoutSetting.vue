<template>
  <div class="demoTitle">
    <span>{{t('CashoutConfig.Title')}}</span>
  </div>
  <div class="demo-form demo-block">
    <div class="source">
      <el-form ref="formEl" :rules="rules" :model="formModel" label-position="right" label-width="120px">
        <!-- <el-row :gutter="20" class="white-row">
          <el-col :span="7">
            <el-form-item class="col-form-item" prop="Mobile">
              <template #label>
                <span> {{t('CashoutConfig.Mobile')}} </span>
              </template>
              <el-text class="mx-1">{{mobile_format(formModel.Mobile)}}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="formModel.MobilePassed">
            <el-button size="small" type="success" style="height: 30px" v-if="formModel.SendVisible"
              @click="SendCode(formEl)" :disabled="formModel.IsSaving">{{t('CashoutConfig.SendCode')}}</el-button>
            <el-button plain style="height: 30px" v-if="!formModel.SendVisible">重新发送({{ formModel.TimeCount
            }}s)</el-button>
          </el-col>
          <el-col :span="3" v-if="!formModel.MobilePassed">
            <el-button size="small" type="success" style="height: 30px"
              @click="router.push({ path: '/manager/SecuritySetting' })">{{t('CashoutConfig.BindMobile')}}</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
          <el-col :span="8">
            <el-form-item class="col-form-item" prop="Code">
              <template #label>
                <span> {{t('CashoutConfig.MobileCode')}} </span>
              </template>
              <el-input v-model="formModel.Code" :placeholder="t('CashoutConfig.MobileCode')" class="input-bolded" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
          <el-col :span="formModel.PayPwdPassed?16:6" style="padding-right: 0;">
            <el-form-item class="col-form-item" prop="PayPassword">
              <template #label>
                <span> {{t('CashoutConfig.PayPwd')}} </span>
              </template>
              <el-input type="password" show-password v-model="formModel.PayPassword" :placeholder="t('CashoutConfig.PayPwd')" class="input-bolded input_120px" autocomplete="new-password"/>
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="!formModel.PayPwdPassed">
            <el-button size="small" type="success" style="height: 30px"
              @click="router.push({ path: '/manager/SecuritySetting' })">{{t('CashoutConfig.SetPayPwd')}}</el-button>
          </el-col>
        </el-row> -->
        <div>
          <el-row :gutter="20" class="white-row">
          <el-col :span="8">
            <el-form-item class="col-form-item">
              <template #label>
                <span> {{t('CashoutConfig.AliPayId')}} </span>
              </template>
              <div v-if="formModel.AliPayId">
                <el-avatar 
                :src="formModel.AliPayAvatar"
                :alt = formModel.AliPayNickName
                :title = formModel.AliPayNickName
                />
              
              </div>              
              <el-text v-else class="mx-1" type="primary">{{formModel.AliPayId?formModel.AliPayId:t('CashoutConfig.NotSet')}}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="padding-top:7px">
            <el-link :href="config.CONFIG_publicAppAuthorize" target="_blank" type="success">{{formModel.AliPayId?t('CashoutConfig.Edit'):t('CashoutConfig.Bind')}}</el-link>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
          <el-col :span="8">
            <el-form-item class="col-form-item">
              <template #label>
                <span> {{t('CashoutConfig.WechatId')}} </span>
              </template>
              <el-text class="mx-1" type="primary">{{formModel.WeChatId?formModel.WeChatId:t('CashoutConfig.NotSet')}}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="padding-top:7px">
            <el-link type="success">{{formModel.WeChatId?t('CashoutConfig.Edit'):t('CashoutConfig.Bind')}}</el-link>
          </el-col>
        </el-row>
        </div>
       
        <el-row :gutter="20" class="white-row">
          <el-col :span="12">
            <el-form-item class="col-form-item">
              <el-button type="success" @click="Save(formEl)" :loading="formModel.IsSaving" v-if="formModel.MobilePassed&&formModel.PayPwdPassed">{{t("button.Save")}}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, onBeforeMount, watch } from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useI18n } from "vue-i18n";
import router from "@/router";
import { useRoute, useRouter } from 'vue-router';
import { GetSecuritySetting, GetCashoutSetting,SaveCashoutSetting } from "@/api/user.js";
import { Send, ReSend, Check } from "@/api/sms.js";
import { mobile_format } from "@/utils/formatter.js";
import config from '@/utils/config.js'
import {bindAlipay} from '@/api/manager'
const { t } = useI18n();
const formEl = ref<FormInstance>();
const route = useRoute()
interface CashOutSetting {
  UserId: number,
  MobilePassed: boolean,
  PayPwdPassed: boolean,
  Mobile: string,
  Code?: string
  PayPassword?: string,
  WeChatId?: string,
  AliPayId?: string,
  SendVisible: boolean,
  TimeCount: number,
  IsResend: boolean,
  SmsId?: string,
  IsSaving: boolean,
  AliPayNickName?: string,
  AliPayAvatar?: string,
}

onMounted(() => {
  GetSecuritySetting().then((x: any) => {
      formModel.Mobile = x.data.Mobile;
      formModel.MobilePassed = x.data.MobilePassed;
      formModel.PayPwdPassed = x.data.PayPwdPassed;
    });

  GetCashoutSetting().then((x: any) => {
    formModel.UserId = x.data.UserId;
    formModel.WeChatId=x.data.WeChatId;
    formModel.AliPayId=x.data.AliPayId;
    formModel.AliPayAvatar=x.data.AliPayAvatar
    formModel.AliPayNickName=x.data.AliPayNickName
  });
})


const showTimer = () => {
  const TimeCount = 60;
  let timer: any;
  if (!timer) {
    formModel.TimeCount = TimeCount;
    formModel.SendVisible = false;
    formModel.IsResend = true;
    timer = setInterval(() => {
      if (formModel.TimeCount > 0 && formModel.TimeCount <= TimeCount) {
        formModel.TimeCount--;
      }
      else {
        formModel.IsResend = true;
        formModel.SendVisible = true;
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  }
};
const formModel = reactive<CashOutSetting>({ MobilePassed: false,PayPwdPassed: false,UserId: 0, Mobile: "", SendVisible: true, TimeCount: 0, IsResend: false, IsSaving: false });
const SendCode = (form: any) => {
  form.clearValidate();
  form.validateField(["Mobile"], (valid: any) => {
    if (valid) {
      if (!formModel.IsResend) {
        Send(formModel.Mobile).then((x: any) => {
          if (x.code) {
            ElMessage({
              message: t('CashoutConfig.SendCodeOk'),
              type: 'success',
            });
            formModel.SmsId = x.data.SmsId;
            showTimer();
          }
          else {
            ElMessage.error(t('CashoutConfig.SendCodeError'))
          }
        });
      }
      else {
        ReSend(formModel.SmsId, formModel.Mobile).then((x: any) => {
          if (x.code) {
            ElMessage({
              message: t('CashoutConfig.SendCodeOk'),
              type: 'success',
            });
            formModel.SmsId = x.data.SmsId;
            showTimer();
          }
          else {
            ElMessage.error(t('CashoutConfig.SendCodeError'));
          }
        });
      }
    }
  })
};
const Save = (form: any) => {
  form.clearValidate();
  form.validateField(['Mobile','Code','PayPassword'], (valid: any) => {
    if (valid) {
      formModel.IsSaving=true;
      Check(formModel.SmsId, formModel.Mobile, formModel.Code).then((x: any) => {
        if (x.code) {
          if(x.data.Success){
            SaveCashoutSetting(formModel).then((x:any)=>{
              formModel.IsSaving=false;
              if(x.code){
                ElMessage({ message: t('CashoutConfig.SaveOK'),type: 'success'});
              }
              else{
                ElMessage.error(x.msg);
              }
            });
          }
          else{
            formModel.IsSaving=false;
            ElMessage.error(x.data.Message);
          }
          }
          else {
            formModel.IsSaving=false;
            ElMessage.error(t('CashoutConfig.SendCodeError'));
          }
      });
     
    }
  })
};
// watch(()=>formModel.IsEditPwd, (newVal,oldVal) => {
//             console.log(newVal,oldVal);
//         });
onBeforeMount(() => {
  let code = route.query.auth_code
    if(typeof code!="undefined"&&code!=""){
      bindAlipay({authCode:code}).then((res:any)=>{
        if(res.code){
          GetCashoutSetting().then((x: any) => {
          formModel.UserId = x.data.UserId;
          formModel.WeChatId=x.data.WeChatId;
          formModel.AliPayId=x.data.AliPayId;
          formModel.AliPayAvatar=x.data.AliPayAvatar
          formModel.AliPayNickName=x.data.AliPayNickName
        });
          
        }
      });
    }
  
});

const checkRule = (rule: any, value: string, callback: any) => {
  let reg: any, msg: string = '';
  if (rule.field == 'Mobile') {
    reg = /^1[3|4|5|6|7|8][0-9]{9}$/;
    msg = t('CashoutConfig.ValidateMobileFormatError');
  }
  else if(rule.field=='Code'){
    reg = /^[0-9]{6}$/;
    msg = t('CashoutConfig.ValidateCodeError');
  }
  else if(rule.field=='PayPassword'){
    reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    msg = t('CashoutConfig.ValidatePaypwdError');
  }
  if (reg.test(value) == false) {
    callback(new Error(msg));
  }
  callback();
};

const rules = reactive<FormRules>({
  Mobile:[
    { required: true, message: t('CashoutConfig.ValidateMobileReqruied'), trigger: 'blur' },
    { validator: checkRule, trigger: "blur" }
  ],
  Code: [
    { required: true, message: t('CashoutConfig.ValidateCodeReqruied'), trigger: 'blur' },
    { validator: checkRule, trigger: "blur" }
  ],
  PayPassword: [
    { required: true, message: t('CashoutConfig.ValidatePaypwdReqruied'), trigger: 'blur' },
    { validator: checkRule, trigger: "blur" }
  ]
});

</script>
<style scoped>
.input_120px{
width: 120px;
}
</style>