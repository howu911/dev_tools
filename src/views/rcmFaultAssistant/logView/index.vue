<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

defineOptions({
  name: "LogView"
});

const route = useRoute();
const ip = ref(route.params.ip as string);
const collectionTime = ref(route.params.collectionTime as string);

onMounted(() => {
  console.log("服务器IP:", ip.value);
  console.log("采集时间:", collectionTime.value);
  // 后续实现文件树加载等功能
});
</script>

<template>
  <div class="log-view-container">
    <el-card class="log-card">
      <template #header>
        <div class="card-header">
          <span class="title">日志查看</span>
        </div>
      </template>
      <!-- 后续实现文件树和内容展示 -->
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.log-view-container {
  box-sizing: border-box;
  height: calc(100vh - 40px);
  margin: 20px;
}

.log-card {
  height: 100%;
}
</style>
