<template>
    <el-form ref="formEl" :rules="rules" :model="formModel" label-position="right" label-width="120px" style="width:500px;margin:auto;">
        <el-row :gutter="20" class="white-row">
            <el-col :span="20">
                <el-form-item class="col-form-item" prop="LoginPwd">
                <template #label>
                  <span> {{$t('SecuritySettingLocale.LoginPwd')}} </span>
                </template>
                <el-input type="password" show-password v-model="formModel.LoginPwd" :placeholder="t('SecuritySettingLocale.LoginPwd')" class="input-bolded input_120px" autocomplete="new-password"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
            <el-col :span="21">
                <el-form-item class="col-form-item" prop="LoginPwdConfirm">
                <template #label>
                  <span> {{$t('SecuritySettingLocale.LoginPwdConfirm')}} </span>
                </template>
                <el-input type="password" show-password v-model="formModel.LoginPwdConfirm" :placeholder="t('SecuritySettingLocale.LoginPwdConfirm')" class="input-bolded input_120px"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
            <el-col :span="24">
            <el-form-item class="col-form-item">
                <el-button type="success" @click="Save(formEl)" :loading="formModel.IsSaving">{{$t("button.Save")}}</el-button>
            </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script lang="ts" setup>
  import { ref, reactive } from "vue";
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { useI18n } from "vue-i18n";
  import { SaveLoginPwdForForgetPwd } from "@/api/user.js";
  
  const { t } = useI18n();
  const formEl = ref<FormInstance>();
  const emit = defineEmits(['changeStep']);
  const props = defineProps({
    smsId: {
            type: String,
            default:""
        }
  });

  interface LoginPwdModel {
    LoginPwd: string,
    LoginPwdConfirm: string,
    IsSaving: boolean
  }

  const formModel = reactive<LoginPwdModel>({LoginPwd: "", LoginPwdConfirm: "",IsSaving:false });

  const Save = (form: any) => {
    form.clearValidate();
    form.validate((valid: any) => {
      if (valid) {
        formModel.IsSaving=true;
        debugger
        SaveLoginPwdForForgetPwd(props.smsId, formModel.LoginPwd).then((x:any)=>{
        formModel.IsSaving=false;
        if(x.code){
            ElMessage({ message: t('SecuritySettingLocale.SaveOK'),type: 'success'});
            emit('changeStep', 3);
        }
        else{
            ElMessage.error(x.msg);
        }
        });
       
      }
    })
  };

  const checkRule = (rule: any, value: string, callback: any) => {
    let reg: any, msg: string = '';
    if(rule.field=='LoginPwd' || rule.field=='LoginPwdConfirm'){
      reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      msg = t('SecuritySettingLocale.ValidatePasswordError');
    }
    if (reg.test(value) == false) {
      callback(new Error(msg));
    }
    else{
      if(rule.field=='LoginPwd' || rule.field=='LoginPwdConfirm'){
        if (formModel.LoginPwd && formModel.LoginPwdConfirm &&
        formModel.LoginPwd!=formModel.LoginPwdConfirm){
        callback(new Error(t('SecuritySettingLocale.ValidateLoginPwdNotEqual')));
      }
      }
    }
    callback();
  };
  
  const rules = reactive<FormRules>({
    LoginPwd: [
      { required: true, message: t('SecuritySettingLocale.ValidateLoginPwdReqruied'), trigger: 'blur' },
      { validator: checkRule, trigger: "blur" }
    ],
    LoginPwdConfirm: [
      { required: true, message: t('SecuritySettingLocale.ValidateLoginPwdConfirmeqruied'), trigger: 'blur' },
      { validator: checkRule, trigger: "blur" }
    ]
  });
  
  </script>