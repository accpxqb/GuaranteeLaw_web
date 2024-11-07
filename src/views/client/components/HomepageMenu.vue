<template>
    <el-card :body-style="{ padding: '0px' }" shadow="never" class="homepage-card">
        <el-menu  default-active="1" background-color="#F5F5F5" style="border-right: 0;">
            <el-menu-item @click="$emit('welearthtype', 1)" index="1" class="homepage-menu-item ">
                <img class="menu_img" width="18" src="@/assets/images/homepage-menu-icon/乐住@2x.png">
                <span>乐住</span>
                <el-icon class="menu_icon">
                    <ArrowRightBold />
                </el-icon>

            </el-menu-item>
            <el-menu-item @click="$emit('welearthtype', 2)"  index="2" class="homepage-menu-item">
                <img class="menu_img" width="18" src="@/assets/images/homepage-menu-icon/乐玩@2x.png">
                <span>乐玩</span>
                <el-icon class="menu_icon">
                    <ArrowRightBold />
                </el-icon>
            </el-menu-item>
            <el-menu-item index="3" class="homepage-menu-item">
                <img class="menu_img" width="18" src="@/assets/images/homepage-menu-icon/乐教@2x.png">
                <span>乐学</span>
                <el-icon class="menu_icon">
                    <ArrowRightBold />
                </el-icon>
            </el-menu-item>           
            <el-menu-item index="4" class="homepage-menu-item">
                <img class="menu_img" width="18" src="@/assets/images/homepage-menu-icon/乐食@2x.png">
                <span>乐食</span>
                <el-icon class="menu_icon">
                    <ArrowRightBold />
                </el-icon>
            </el-menu-item>
            <el-menu-item index="5" class="homepage-menu-item">
                <img class="menu_img" width="18" src="@/assets/images/homepage-menu-icon/乐美@2x.png">
                <span>乐美</span>
                <el-icon class="menu_icon">
                    <ArrowRightBold />
                </el-icon>
            </el-menu-item>
            <el-menu-item index="6" class="homepage-menu-item">
                <img class="menu_img" width="18" src="@/assets/images/homepage-menu-icon/乐宝@2x.png">
                <span>乐宝</span>
                <el-icon class="menu_icon">
                    <ArrowRightBold />
                </el-icon>
            </el-menu-item>
            <el-menu-item index="7" class="homepage-menu-item">
                <img class="menu_img" width="18" src="@/assets/images/homepage-menu-icon/乐家@2x.png">
                <span>乐家</span>
                <el-icon class="menu_icon">
                    <ArrowRightBold />
                </el-icon>
            </el-menu-item>
            <el-menu-item index="8" class="homepage-menu-item">
                <img class="menu_img" width="18" src="@/assets/images/homepage-menu-icon/乐业@2x.png">

                <span>乐业</span>
                <el-icon class="menu_icon">
                    <ArrowRightBold />
                </el-icon>
            </el-menu-item>
            <el-menu-item index="9" class="homepage-menu-item">
                <img class="menu_img" width="18" src="@/assets/images/homepage-menu-icon/乐超@2x.png">
                <span>乐超</span>
                <el-icon class="menu_icon">
                    <ArrowRightBold />
                </el-icon>
            </el-menu-item>
            <el-menu-item index="9" class="homepage-menu-item">
                <img class="menu_img" width="18" src="@/assets/images/homepage-menu-icon/auto@2x.png">
                <span>乐车</span>
                <el-icon class="menu_icon">
                    <ArrowRightBold />
                </el-icon>
            </el-menu-item>
        </el-menu>
    </el-card>
</template>

<style scoped>
@import "@/styles/client/homepage.css";

.homepage-menu-item {
    width: auto;
    height: 46.8px;
}

.menu_img {
    margin-right: 10px;
}

.menu_icon {
    margin-left: 50px;
}
</style>