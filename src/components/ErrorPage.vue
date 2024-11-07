<template>
    <el-result title="404">
        <template #sub-title>
            <p>Sorry, request error</p>
        </template>
        <template #extra>
            <el-button @click="router.push('/')">返回首页</el-button>
        </template>
    </el-result>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>