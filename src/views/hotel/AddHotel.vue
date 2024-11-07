<template>
  <div class="demoTitle">
    <span v-if="hotel">{{ $t("addHotelVue.Title") }}</span>
    <span v-else>{{ $t("addHotelVue.TitleEdit") }}</span>
  </div>
  <div class="demo-form demo-block">
    <div class="source">
      <el-form :rules="rules" ref="refForm" :model="hotel" label-width="80px">
        <el-form-item :label="$t('addHotelVue.Name')" prop="Name">
          <el-input v-model="hotel.Name" maxlength="50"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('addHotelVue.ProCityArea')" prop="ProCityArea" >
                        
                            <el-cascader 
                            :placeholder="$t('addHotelVue.请选择省市区')"
                            :options="options" 
                            v-model="selectedOptions" 
                            @change="handleChange"/>
                        
                    </el-form-item> -->
        <el-form-item :label="$t('addHotelVue.Address')">
          <el-row style="width: 100%">
            <el-col :span="20">
              <el-select
                v-model="AllAddress"
                filterable
                remote
                reserve-keyword
                :placeholder="$t('addHotelVue.请输入酒店详细地址')"
                :remote-method="searchDistrict"
                :loading="loading"
                @blur="handleBlur"
                @change="handleSearchChange"
                class="iptWidth"
                style="width: 100%"
              >
                <el-option
                  v-for="item in districtList"
                  :key="item.id"
                  :label="item.district + ',' + item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="4" style="text-align: right">
              <el-button type="primary" @click="btnShowMap">修改定位</el-button>
            </el-col>
          </el-row>

          <!-- <el-input @click="btnShowMap" v-model="hotel.Address"></el-input> -->
        </el-form-item>
        <el-form-item
          :label="$t('addHotelVue.HotelProfile')"
          prop="HotelProfile"
        >
          <el-input
            v-model="hotel.HotelProfile"
            :autosize="{ minRows: 6, maxRows: 9 }"
            maxlength="2000"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('addHotelVue.HotelLevel')" prop="HotelLevel">
          <el-select
            v-model="hotel.HotelLevel"
            class="m-2"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('addHotelVue.PictureList')" prop="PictureList">
          <el-upload
            class="uploadimglist"
            v-model:file-list="fileList"
            :action="uploadUrl"
            :headers="headers"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :accept="accept"
            :data="{ name: 'Hotel' }"
            maxlength="50"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitModify">{{
            $t("managerProfileVue.Save")
          }}</el-button>
          <el-button @click="submitChanle">{{
            $t("managerProfileVue.Cancel")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    :title="$t('dialog.预览')"
    width="800"
    append-to-body
  >
    <img
      :src="dialogImageUrl"
      style="display: block; max-width: 100%; margin: 0 auto"
    />
  </el-dialog>

  <el-dialog
    v-model="dialogMapVisible"
    :title="dialogMapTitle"
    width="70%"
    top="0"
    destroy-on-close
    center
    append-to-body
  >
    <Map
      :fcenter="hotel.LongitudeLatitude"
      @change="selectLocation($event)"
    ></Map>
  </el-dialog>
</template>
<script>
import Map from "../map/AddHotelMap.vue";
import { regionData, CodeToText } from "element-china-area-data";
import { ref } from "vue";
import { editHotel, getHotel, deletePicture } from "../../api/hotel";
import config from "../../utils/config";
import { inputtips } from "../../api/amap";
import { uploadUrl } from "@/utils/uploadHelper";

export default {
  components: {
    Map,
  },
  props: ["id"],
  data() {
    var checkProCityArea = (rule, value, callback) => {
      if (this.selectedOptions == "") {
        callback(new Error());
      }
      callback();
    };
    var checkPictureList = (rule, value, callback) => {
      if (this.hotel.PicList == undefined || this.hotel.PicList.length <= 0) {
        callback(new Error());
      }
      callback();
    };
    return {
      maxFileSize: config.CONFIG_FileSize,
      AllAddress: "",
      dialogMapVisible: false,
      dialogMapTitle: "",
      //uploadUrl: config.CONFIG_API + "Hotel/uploadPic",
      uploadUrl: uploadUrl,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      // 可上传的文件类型
      accept: ".jpg,.png,.gif,.jpeg",
      hotel: {
        HotelLevel: 5,
        PicList: [],
      },
      options: ref(regionData),
      selectedOptions: "",
      FullName: "",
      rules: {
        Name: [
          {
            required: true,
            message: this.$t("addHotelVue.请输入酒店名称"),
            trigger: "blur",
          },
          // { min: 5, max: 14, message: '长度在 5 到 14 个字符', trigger: 'blur' }
        ],
        // ProCityArea: [{validator: checkProCityArea, message: this.$t('addHotelVue.请选择省市区'), trigger: "blur" },],
        Address: [
          {
            required: true,
            message: this.$t("addHotelVue.请输入酒店详细地址"),
            trigger: "blur",
          },
        ],
        HotelProfile: [
          {
            required: true,
            message: this.$t("addHotelVue.请输入酒店简介"),
            trigger: "blur",
          },
        ],
        HotelLevel: [
          {
            required: true,
            message: this.$t("addHotelVue.请选择酒店级别"),
            trigger: "blur",
          },
        ],
        PictureList: [
          {
            validator: checkPictureList,
            message: this.$t("addHotelVue.请上传酒店照片"),
            trigger: "blur",
          },
        ],
      },
      levelOptions: [
        {
          value: 0,
          label: "无",
        },
        {
          value: 2,
          label: "二星",
        },
        {
          value: 3,
          label: "三星",
        },
        {
          value: 4,
          label: "四星",
        },
        {
          value: 5,
          label: "五星",
        },
      ],
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      districtList: [],
      searchparams: {
        key: "790547f5b60a65b2b5f1be9475b2b2ce",
        keywords: "",
        //type: "060000|070000|100000|110000|150000|170000",
        datatype: "all",
      },
    };
  },
  methods: {
    handleSearchChange(val) {
      if (!val) {
        return;
      }
      let tip = this.districtList.find((it) => it.id == val);
      console.log(tip);
      if (tip) {
        if (tip.location == "") {
          this.$message.error("地址无效");
          this.hotel.Address = "";
          return;
        }
        this.hotel.LongitudeLatitude = tip.location;
        this.hotel.Address = tip.name;
        this.hotel.Districts = tip.district;
        this.hotel.Province = tip.adcode.substring(0, 2) + "0000";
        this.hotel.City = tip.adcode.substring(0, 4) + "00";
        this.hotel.Area = tip.adcode;
      }
    },
    handleBlur() {},
    searchDistrict(query) {
      if (query) {
        this.searchparams.keywords = query;
        inputtips(this.searchparams).then((res) => {
          console.log(res);
          if (res.data.tips) {
            this.districtList = res.data.tips.filter((tip) => {
              if (tip.location && tip.location != "") {
                return tip;
              }
            });
          }
        });
      }
    },
    selectLocation(e) {
      console.log(e);
      this.dialogMapVisible = false;
      this.hotel.LongitudeLatitude = e.lnglat.lng + "," + e.lnglat.lat;
    },
    btnShowMap() {
      this.dialogMapVisible = true;

      this.dialogMapTitle = "";
    },
    submitChanle() {
      this.$router.back();
    },
    submitModify() {
      this.$refs.refForm.validate((valid) => {
        if (valid) {
          editHotel(this.hotel).then((res) => {
            if (res.code) {
              this.$message.success(this.$t("addHotelVue.保存成功"));
              this.$router.push({ name: "HotelList" });
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleChange(val) {
      if (val[0] != null && val[1] != null && val[2] != null) {
        this.hotel.Province = val[0];
        this.hotel.City = val[1];
        this.hotel.Area = val[2];
      }
    },

    handleRemove(uploadFile, uploadFiles) {
      const url = uploadFile.response
        ? uploadFile.response.data
        : uploadFile.name;
      console.log(this.hotel.PicList);

      const index = this.hotel.PicList.findIndex((v) => v.Url == url);
      if (index != -1) {
        deletePicture({ fileName: url, type: 1 }).then(function (res) {
          // console.log(res)
        });

        this.hotel.PicList.splice(index, 1);
      }
    },
    handlePictureCardPreview(uploadFile) {
      console.log(uploadFile);
      console.log(uploadFile.url);
      this.dialogImageUrl = uploadFile.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      if (res.code) {
        this.hotel.PicList.push({ Url: res.data });
        this.$message.success(this.$t("addHotelVue.上传成功"));
      } else {
        this.$message.error(res.msg);
        const index = this.fileList.findIndex((v) => v.name == file.name);
        if (index != -1) this.fileList.splice(index, 1);
      }
    },
    beforeAvatarUpload(file) {
      if (this.accept) {
        let fileType = this.accept.split(",");
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf("."));
        }
        const isTypeOk = fileType.some((type) => {
          if (file.type.indexOf(type.slice(type.lastIndexOf(".") + 1)) > -1)
            return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$message.error(
            `文件格式不正确, 请上传${fileType.join("/")}格式文件!`
          );
          return false;
        }
        if (this.maxFileSize) {
          // 校检文件大小
          if (file.size / 1024 / 1024 > this.maxFileSize) {
            this.$message.error(`上传文件大小不能超过 ${this.maxFileSize} MB!`);
            return false;
          }
        }

        return true;
      }
    },
  },
  mounted() {
    let hotelId = this.$route.query.hotelId;
    console.log(this.$route);
    console.log(hotelId);
    if (hotelId != 0 && hotelId) {
      getHotel({ id: hotelId }).then((res) => {
        if (res.code) {
          this.hotel = res.data;
          this.AllAddress = this.hotel.Districts + this.hotel.Address;
          // this.fileList = res.data.PicList
          res.data.PicList.forEach((element) => {
            this.fileList.push({
              url: config.CONFIG_IMGURL + element.Url,
              name: element.Url,
            });
          });
          console.log(this.fileList);
          this.selectedOptions = [
            res.data.Province,
            res.data.City,
            res.data.Area,
          ];
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
};
</script>
<style scoped>
:deep(.el-input) {
  width: 100%;
}
:deep(.el-cascader) {
  width: 100%;
}
.uploadimglist :deep(.el-upload-list__item) {
  width: 100px;
  height: 100px;
}
.uploadimglist :deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
}
</style>
