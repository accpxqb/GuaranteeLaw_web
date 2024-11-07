<template>
  <!-- <div class="demoTitle">    
        <span>{{$t('addHotelRoomVue.Title')}}</span>
    </div> -->
  <div
    class="demo-form demo-block"
    style="max-width: 1000px; border: 1px solid var(--el-border-color)"
  >
    <div class="source">
      <el-form
        :rules="rules"
        ref="refForm"
        :model="hotelRoom"
        label-width="80px"
      >
        <!-- <el-space wrap size="default"> -->
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('addHotelRoomVue.RoomName')"
              prop="RoomName"
            >
              <el-input
                size="large"
                v-model="hotelRoom.RoomName"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('addHotelRoomVue.RoomType')"
              prop="RoomType"
              required
            >
              <el-select
                size="large"
                class="mselect"
                v-model="hotelRoom.RoomType"
                :placeholder="$t('addHotelRoomVue.PleSelect')"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item
              :label="$t('addHotelRoomVue.RoomSize')"
              prop="RoomSize"
            >
              <el-input
                size="large"
                @input="formatValue(hotelRoom.RoomSize)"
                class="mstyle"
                v-model="hotelRoom.RoomSize"
                maxlength="5"
              >
                <template #append> m² </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              :label="$t('addHotelRoomVue.BedNumber')"
              prop="BedNumber"
              maxlength="3"
            >
              <el-input
                size="large"
                @input="formatValueBedNumber(hotelRoom.BedNumber)"
                class="mstyle"
                v-model="hotelRoom.BedNumber"
              >
                <template #append> 张 </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('addHotelRoomVue.BedSize')" prop="BedSize">
              <!-- <el-input   v-model="hotelRoom.BedSize" ></el-input> -->
              <el-select
                size="large"
                class="mselect"
                v-model="hotelRoom.BedSize"
                :placeholder="$t('addHotelRoomVue.PleSelect')"
                required
              >
                <el-option
                  v-for="item in optionsBedSize"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('addHotelRoomVue.RoomProfile')">
              <el-input
                v-model="hotelRoom.RoomProfile"
                :autosize="{ minRows: 6, maxRows: 9 }"
                type="textarea"
                maxlength="2000"
                :placeholder="$t('addHotelRoomVue.RoomProfileDec')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="$t('addHotelRoomVue.PictureList')"
              prop="PictureList"
            >
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
                :data="{ name: 'HotelRoom' }"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="$t('addHotelRoomVue.TypeBathing')"
              prop="TypeBathing"
            >
              <el-checkbox-group v-model="hotelRoom.TypeBathing">
                <el-checkbox
                  v-for="city in TypeBathings"
                  :key="city"
                  :label="city"
                  >{{ city }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="$t('addHotelRoomVue.TypeNetwork')"
              prop="TypeNetwork"
            >
              <el-checkbox-group v-model="hotelRoom.TypeNetwork">
                <el-checkbox
                  v-for="city in TypeNetworks"
                  :key="city"
                  :label="city"
                  >{{ city }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-col :span="24">
            <el-form-item
              :label="$t('addHotelRoomVue.TypeSanitary')"
              prop="TypeSanitary"
            >
              <el-checkbox-group v-model="hotelRoom.TypeSanitary">
                <el-checkbox
                  v-for="city in TypeSanitarys"
                  :key="city"
                  :label="city"
                  >{{ city }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-col :span="24">
            <el-form-item
              :label="$t('addHotelRoomVue.TypeService')"
              prop="TypeService"
            >
              <el-checkbox-group v-model="hotelRoom.TypeService">
                <el-space wrap>
                  <el-checkbox
                    v-for="city in TypeServices"
                    :key="city"
                    :label="city"
                    border
                    >{{ city }}</el-checkbox
                  >
                  <el-popover :width="200" trigger="click">
                    <template #reference>
                      <el-button icon="Plus">{{
                        $t("addHotelRoomVue.AddTag")
                      }}</el-button>
                    </template>
                    <el-space
                      direction="vertical"
                      alignment="flex-start"
                      :fill="true"
                    >
                      <el-row :gutter="20" justify="space-between">
                        <!-- <el-col :span="12"><label style="margin-top: 10px;">输入自定义标签: </label></el-col> -->
                        <el-col :span="24">
                          <el-input
                            size="large"
                            class="fullinput"
                            :placeholder="
                              $t('addHotelRoomVue.请输入自定义标签')
                            "
                            v-model="selfFlag"
                            maxlength="15"
                          ></el-input>
                        </el-col>
                      </el-row>
                      <el-row justify="center">
                        <el-col :span="8"
                          ><el-button
                            class="centerButten"
                            @click="addFlag"
                            type="success"
                            >{{ $t("button.BeSure") }}</el-button
                          ></el-col
                        >
                      </el-row>
                    </el-space>
                  </el-popover>
                </el-space>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="submitModify">{{
                $t("managerProfileVue.Save")
              }}</el-button>
              <el-button @click="this.$router.back()">{{
                $t("managerProfileVue.Cancel")
              }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- </el-space> -->
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
</template>
<script>
import { ref } from "vue";
import {
  editHotelRoom,
  getFlags,
  getHotelRoom,
  deletePicture,
} from "../../api/hotel";
import config from "../../utils/config";
import { uploadUrl } from "@/utils/uploadHelper";

export default {
  watch: {
    "hotelRoom.TypeService"(newVal, oldVal) {
      // 监听 hotelRoom.TypeService 属性的数据变化
      // 作用 : 只要 num 的值发生变化,这个方法就会被调用
      console.log("oldVal:", oldVal);
      console.log("newVal:", newVal);
    },
  },
  data() {
    var checkPictureList = (rule, value, callback) => {
      if (
        this.hotelRoom.PicList == undefined ||
        this.hotelRoom.PicList.length <= 0
      ) {
        callback(new Error());
      }
      callback();
    };
    return {
      maxFileSize: config.CONFIG_FileSize,
      selfFlag: "",
      TypeBathings: [],
      TypeNetworks: [],
      TypeSanitarys: [],
      TypeServices: [],
      //uploadUrl: config.CONFIG_API + "HotelRoom/uploadPic",
      uploadUrl: uploadUrl,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      // 可上传的文件类型
      accept: ".jpg,.png,.gif,.jpeg",
      hotelRoom: {
        PicList: [],
      },
      options: config.CONFIG_RoomType,
      optionsBedSize: config.CONFIG_BedSize,
      rules: {
        RoomName: [
          {
            required: true,
            message: this.$t("addHotelRoomVue.请输入房型名称"),
            trigger: "blur",
          },
          // { min: 5, max: 14, message: '长度在 5 到 14 个字符', trigger: 'blur' }
        ],
        RoomType: [
          {
            required: true,
            message: this.$t("addHotelRoomVue.请选择房间类型"),
            trigger: "blur",
          },
        ],
        RoomSize: [
          {
            required: true,
            message: this.$t("addHotelRoomVue.请输入房间大小"),
            trigger: "blur",
          },
        ],
        BedNumber: [
          {
            required: true,
            message: this.$t("addHotelRoomVue.请输入床数量"),
            trigger: "blur",
          },
        ],
        BedSize: [
          {
            required: true,
            message: this.$t("addHotelRoomVue.请选择床大小"),
            trigger: "blur",
          },
        ],
        PictureList: [
          {
            validator: checkPictureList,
            message: this.$t("addHotelRoomVue.请上传房型照片"),
            trigger: "blur",
          },
        ],
      },
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    addFlag() {
      if (this.selfFlag == "") return;
      if (this.TypeServices.indexOf(this.selfFlag) != -1) return;

      this.TypeServices.push(this.selfFlag);
      this.hotelRoom.TypeService.push(this.selfFlag);
    },
    formatValue(val) {
      console.log(val);
      val = val.replace(/(^\s*)|(\s*$)/g, "");
      if (!val) return (this.hotelRoom.RoomSize = "");
      val = val.replace(/[^\d.]/g, "");
      val = val.replace(/^\./g, "");
      val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
      this.hotelRoom.RoomSize = val;
    },
    formatValueBedNumber(val) {
      console.log(val);
      val = val.replace(/(^\s*)|(\s*$)/g, "");
      if (!val) return (this.hotelRoom.RoomSize = "");
      val = val.replace(/[^\d.]/g, "");
      val = val.replace(/^\./g, "");
      val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
      this.hotelRoom.BedNumber = val;
    },
    submitModify() {
      this.$refs.refForm.validate((valid) => {
        if (valid) {
          editHotelRoom(this.hotelRoom).then((res) => {
            if (res.code) {
              this.$message.success(this.$t("addHotelRoomVue.保存成功"));
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

    handleRemove(uploadFile, uploadFiles) {
      const url = uploadFile.response
        ? uploadFile.response.data
        : uploadFile.name;
      const index = this.hotelRoom.PicList.findIndex((v) => v.Url == url);
      if (index != -1) {
        deletePicture({ fileName: url, type: 2 }).then(function (res) {
          // console.log(res)
        });

        this.hotelRoom.PicList.splice(index, 1);
      }
    },
    handlePictureCardPreview(uploadFile) {
      console.log(uploadFile.url);
      this.dialogImageUrl = uploadFile.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      if (res.code) {
        this.hotelRoom.PicList.push({ Url: res.data });
        this.$message.success(this.$t("addHotelRoomVue.上传成功"));
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
        // 校检文件大小
        if (this.maxFileSize) {
          const isLt = file.size / 1024 / 1024 < this.maxFileSize;
          if (!isLt) {
            this.$message.error(`上传文件大小不能超过 ${this.maxFileSize} MB!`);
            return false;
          }
        }

        return true;
      }
    },
  },
  mounted() {
    getFlags().then((res) => {
      if (res.code) {
        var arr = res.data;
        arr.forEach((i) => {
          if (i.Type == 0) this.TypeBathings.push(i.Name);
          if (i.Type == 1) this.TypeNetworks.push(i.Name);
          if (i.Type == 2) this.TypeSanitarys.push(i.Name);
          if (i.Type == 3) this.TypeServices.push(i.Name);
        });
      } else {
        this.$message.error(res.msg);
      }
    });
    let roomId = this.$route.query.roomId;
    let hotelId = this.$route.query.hotelId;
    console.log(this.$route);

    if (roomId != 0 && roomId) {
      getHotelRoom({ id: roomId }).then((res) => {
        if (res.code) {
          this.hotelRoom = res.data;
          res.data.PicList.forEach((element) => {
            this.fileList.push({
              url: config.CONFIG_IMGURL + element.Url,
              name: element.Url,
            });
          });

          console.log(this.TypeServices);
          this.hotelRoom.TypeService.forEach((element) => {
            console.log(element);

            if (this.TypeServices.indexOf(element) == -1) {
              console.log(element);
              this.TypeServices.push(element);
            }
          });

          console.log(this.fileList);
        } else {
          this.$message.error(res.msg);
        }
      });
    }

    if (hotelId != 0 && hotelId) {
      this.hotelRoom.HotelID = hotelId;
    }
  },
};
</script>
<style scoped>
/* :deep(.el-input){
    width: 59%;
  } */
:deep(.el-cascader) {
  width: 100%;
}
:deep(.mstyle) {
  width: 100%;
}
:deep(.mselect) {
  width: 100%;
}
:deep(.servers-checkbok) {
  margin-bottom: 10px;
}
:deep(.fullinput) {
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
