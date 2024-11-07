<template>
    <el-form ref="formEl" :rules="rules" :model="formModel" label-position="right" label-width="120px" style="width:500px;margin:auto;">
        <el-row :gutter="20" class="white-row">
            <el-col :span="21">
            <el-form-item class="col-form-item" prop="UserName">
                <template #label>
                <span> {{$t('SecuritySettingLocale.UserName')}} </span>
                </template>
                <el-input v-model="formModel.UserName" :placeholder="t('SecuritySettingLocale.EmailOrMoble')" class="input-bolded" />
            </el-form-item>
            </el-col>
            <el-col :span="3">
            <el-button size="small" type="success" style="height: 30px" v-if="formModel.SendVisible"
                @click="SendCode(formEl)" :disabled="formModel.IsSaving">{{$t('SecuritySettingLocale.SendCode')}}</el-button>
            <el-button plain style="height: 30px" v-if="!formModel.SendVisible">重新发送({{ formModel.TimeCount
            }}s)</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
            <el-col :span="21">
            <el-form-item class="col-form-item" prop="Code">
                <template #label>
                <span> {{$t('SecuritySettingLocale.Code')}} </span>
                </template>
                <el-input v-model="formModel.Code" class="input-bolded" />
            </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
            <el-col :span="24">
            <el-form-item class="col-form-item">
                <el-button type="success" @click="Next(formEl)" :loading="formModel.IsSaving">{{$t("button.Next")}}</el-button>
            </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useI18n } from "vue-i18n";
import { CheckUserName } from "@/api/user.js";
import { Send as SendSMS, ReSend as ReSendSMS, Check as CheckSMS } from "@/api/sms.js";
import { Send as SendEmail, ReSend as ReSendEmail, Check as CheckEmail } from "@/api/email.js";

  const { t } = useI18n();
  const formEl = ref<FormInstance>();
  const emit = defineEmits(['changeStep']);
  
  interface SecurityUser {
    Step: number,
    UserName: string,
    Code?: string
    SendVisible: boolean,
    TimeCount: number,
    IsResend: boolean,
    SmsId?: string,
    SmsType: string,
    IsSaving: boolean,
    Check?: any
  }
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
  const formModel = reactive<SecurityUser>({ Step:1, UserName: "", SendVisible: true, TimeCount: 0, IsResend: false, IsSaving: false, SmsType:"" });
  const SendCode = (form: any) => {
    form.clearValidate();
    form.validateField(["UserName"],(valid: any) => {
      if (valid) {
        let send:any, resend:any;
        if(/^([0-9a-zA-Z_\.-])+\@([0-9a-zA-Z_\.-])+\.([a-zA-Z]+)$/.test(formModel.UserName)){
            formModel.Check=CheckEmail;
            formModel.SmsType="Email";
            send = SendEmail;
            resend = ReSendEmail;
        }
        else if(/^1[3|4|5|7|8][0-9]{9}$/.test(formModel.UserName)){
            formModel.Check=CheckSMS;
            formModel.SmsType="SMS";
            send = SendSMS;
            resend = ReSendSMS;
        }
        else{
            ElMessage.error(t('SecuritySettingLocale.ValidateUserNameFormatError'));
            return;
        }
        if (!formModel.IsResend) {
            send(formModel.UserName).then((x: any) => {
            if (x.code) {
              ElMessage({
                message: t('SecuritySettingLocale.SendCodeOk'),
                type: 'success',
              });
              formModel.SmsId = x.data.SmsId;
              showTimer();
            }
            else {
              ElMessage.error(t('SecuritySettingLocale.SendCodeError'))
            }
          });
        }
        else {
            resend(formModel.SmsId, formModel.UserName).then((x: any) => {
            if (x.code) {
              ElMessage({
                message: t('SecuritySettingLocale.SendCodeOk'),
                type: 'success',
              });
              formModel.SmsId = x.data.SmsId;
              showTimer();
            }
            else {
              ElMessage.error(t('SecuritySettingLocale.SendCodeError'));
            }
          });
        }
      }
    })
  };
  const Next = (form: any) => {
    form.clearValidate();
    form.validate((valid: any) => {
      if (valid) {
        formModel.IsSaving=true;
        formModel.Check(formModel.SmsId, formModel.UserName, formModel.Code).then((x: any) => {
          if (x.code) {
            if(x.data.Success){
                CheckUserName(formModel.SmsId+":"+formModel.SmsType).then((x:any)=>{
                formModel.IsSaving=false;
                if(x.code){
                  emit('changeStep', 2, formModel.SmsId+":"+formModel.SmsType);
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
              ElMessage.error(t('SecuritySettingLocale.SendCodeError'));
            }
        });
       
      }
    })
  };

  const checkRule = (rule: any, value: string, callback: any) => {
    let reg: any, msg: string = '';
    if(rule.field=='Code'){
      reg = /^[0-9]{6}$/;
      msg = t('SecuritySettingLocale.ValidateCodeError');
    }
    if (reg.test(value) == false) {
      callback(new Error(msg));
    }
    callback();
  };
  
  const rules = reactive<FormRules>({
    UserName:[
      { required: true, message: t('SecuritySettingLocale.ValidateUserNameReqruied'), trigger: 'blur' }
    ],
    Code: [
      { required: true, message: t('SecuritySettingLocale.ValidateCodeReqruied'), trigger: 'blur' },
      { validator: checkRule, trigger: "blur" }
    ]
  });
</script>