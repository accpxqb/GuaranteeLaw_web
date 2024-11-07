<template>
    <el-card
      v-for="(item, index) in responseList"
      :key="index"
      class="property_card"
      shadow="never"
      style="margin-top: 1em"
    >
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="display: flex; align-items: center">
            <el-avatar
              :size="40"
              :src="config.CONFIG_IMGURL + item.User.PhotoPath"
            >
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
            <span style="margin-left: 1em">
              {{ `服务经理：${item.User.FullName}` }}
            </span>
            <el-tooltip placement="top">
              <template #content>
                <div>手机号码：{{ item.User.Mobile }}</div>
                <div>邮箱地址：{{ item.User.Email }}</div>
              </template>
              <el-button link>
                <el-icon color="#27ae60" size="20">
                  <InfoFilled />
                </el-icon>
              </el-button>
            </el-tooltip>
          </div>
          <div>
            <el-button @click="btnRouter(item.User.Id)">
              查看详情<el-icon><DArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </template>
      <template v-for="(eat, index) in item.PropertyList" :key="eat.Id">       
        <el-divider v-if="index > 0" style="width: 110%; margin-left: -20px">
        </el-divider>
        <template v-for="proPackage in eat.PropertyPackage">
          <EatInfo :eat="proPackage"></EatInfo>
          <EatDetails :details="proPackage.PackageDetails"></EatDetails>
        </template>
        
       
        <el-divider style="width: 110%; margin-left: -20px"> </el-divider>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span
            :style="{
              fontSize: 'small',
              color: timeColor([eat.BeginTime, eat.EndTime]),
            }"
          >
            {{
              `开始时间：
               ${formatDate(eat.BeginTime)}`
            }}
          </span>
          <div>
            <span>共支付：</span>
            <span style="color: #ff5800; margin-right: 1em">
              {{ eat.OrderTotal }}元
            </span>
            <el-button
              @click="handleShowEditDialog(eat)"
              v-if="eat.IsModification == 0"
            >
              我要改单
            </el-button>
            <el-button v-if="eat.IsModification == 1" plain disabled>
              回复中…
            </el-button>
            <el-button
              @click="handleShowEditDialog(eat)"
              v-if="eat.IsModification == 2"
            >
              继续改单
            </el-button>
            <el-button color="#ff5800" @click="btnDeal(eat)"> 下单 </el-button>
          </div>
        </div>
      </template>
    </el-card>
    <el-dialog v-model="notesDialogVisible" title="我要改单" width="30%">
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入想要修改内容，如：服务时间、服务价格等"
        v-model="notes"
        maxlength="200"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="notesDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="saveNotes"
            @disabled="notes.length < 1"
          >
            发送经理
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="payVisible"
      :show-close="true"
      destroy-on-close
      width="550"
    >
      <template #header="{ close }">
        <div class="my-header">
          <h4 style="margin: 0px; text-align: center">请选择支付方式</h4>
        </div>
      </template>
      <Pay @dopay="btndopay" :orderId="orderId"></Pay>
    </el-dialog>
    <el-dialog v-model="ispay" :show-close="true" destroy-on-close width="550">
      <WeiXinPay :url="url" :total="total"></WeiXinPay>
    </el-dialog>
  </template>
  <script lang="ts" setup>
  import { ref, computed, onMounted, watch } from "vue";
  import { getSourcingPropertyList } from "@/api/sourcing_eat.js";
  import EatInfo from "@/views/components/eat/EatInfo.vue";
  import EatDetails from "@/views/components/eat/EatDetails.vue";
  import config from "@/utils/config";
  import { modifyProperty } from "@/api/sourcing_eat.js";
  import { ElMessage, ElMessageBox } from "element-plus";
  import { createPlayOrder } from "@/api/ordereat.js";
  import { useUserDataStore } from "@/stores/counter";
  import { useRouter } from "vue-router";
  import Pay from "../pay/Pay.vue";
  import WeiXinPay from "../pay/WeiXinPay.vue";
  import { ManagerType } from "@/utils/enums";
  
  const btnRouter = (managerId:any) => {
    console.log(managerId);
    if (isNaN(managerId)) {
      return;
    }
    //router.push({ path: '/homepageManager', query: { managerId: managerId } })
    var path = router.resolve({
      path: "/homepageManager",
      query: { managerId: managerId ,managerType:ManagerType.乐食},
    });
    window.open(path.href, "_blank");
  };
  
  const responseList = ref<any[]>([]);
  
  const props = defineProps({
    sourcingId: {
      type: String,
      required: true,
    },
    sourcingTime: {
      type: Array as () => any[],
    },
  });
  
  onMounted(() => {
    console.log(props.sourcingTime);
    getSourcingPropertyList({ sourcingId: props.sourcingId }).then((res: any) => {
      if (res.code == 1) {
        responseList.value = res.data;
        console.log(res.data)
        responseList.value.forEach((item: any) => {
          item.PropertyList.forEach((element: any) => {            
            element.PropertyPackage.forEach((p: any) => {             
              p.PackageAmenitys = p.PackageAmenitys.split(",");
              p.PackageDetails =JSON.parse(p.PackageDetails);
              p.PackagePicList =JSON.parse(p.PackagePicList);            
              p.Banquet =element.Banquet;
            });
          });
        });
      }
    });
  });
  /**
   * 改单
   */
  const notesDialogVisible = ref(false);
  const curPropertyId = ref(0);
  const handleShowEditDialog = (play: any) => {
    curPropertyId.value = play.Id;
    notesDialogVisible.value = true;
  };
  
  const notes = ref("");
  const saveNotes = () => {
    if (curPropertyId.value == 0) return;
    modifyProperty({
      propertyId: curPropertyId.value,
      notes: notes.value,
    }).then((res: any) => {
      if (res.code == 1) {
        ElMessage.success("您的提议已提交，请耐心等待服务经理回复");
        console.log(curPropertyId.value);
        responseList.value.forEach((item: any) => {
          item.PropertyList.forEach((element: any) => {
            if(element.Id == curPropertyId.value){
               element.IsModification = 1;
            }
          });
        });
      } else {
        ElMessage.error("提交失败，请联系客服");
      }
      closeDialog();
    });
  };
  const closeDialog = () => {
    curPropertyId.value = 0;
    notes.value = "";
    notesDialogVisible.value = false;
  };
  /**下单 */
  const router = useRouter();
  const userStore = useUserDataStore();
  const loading = ref(false);
  const total = ref(0);
  const orderId = ref(0);
  const payVisible = ref(false);
  const url = ref("");
  const ispay = ref(false);
  const btndopay = (u: any) => {
    url.value = u;
    payVisible.value = false;
    ispay.value = true;
  };
  const btnDeal = (play: any) => {
    if (!userStore.mobile) {
      ElMessage.error("请先填写联系电话");
      router.push({ path: "/client/SecuritySetting" });
      return;
    }
    //生成待支付订单
    loading.value = true;
  
    createPlayOrder({
      SourcingPropertyId: play.Id,
      SourcingId: play.SourcingId,
    })
      .then((res: any) => {
        //成功
        if (res.code == 1) {
          console.log(res);
          console.log(play);
          total.value = play.OrderTotal;
          payVisible.value = true;
          //待支付订单传给支付平台
          orderId.value = res.data;
        } else {
          ElMessageBox.alert("下单失败");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };
  
  //js格式化时间 yyyy-MM-dd hh:mm
  const formatDate = (date: string) => {
    const arr = date.split("T");
    const timeArr = arr[1].split(":");
    return arr[0] + " " + timeArr[0] + ":" + timeArr[1];
  };
  
  //时间颜色
  const timeColor = (val: any) => {
    console.log("val", val);
    if (!props.sourcingTime) return "black";
    else if (val[0] != props.sourcingTime[0] || val[1] != props.sourcingTime[1])
      return "#ff5800";
    else return "black";
  };
  </script>
  <style scoped>
  :deep(.el-card__header) {
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    background-color: #f5f5f5 !important;
  }
  </style>
  