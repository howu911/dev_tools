<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

defineOptions({
  name: "FaultAnalysis"
});

const route = useRoute();
const ip = ref(route.params.ip as string);
const collectionTime = ref("");

onMounted(() => {
  // 直接使用原始的采集时间，不进行格式转换
  collectionTime.value = route.params.collectionTime as string;
});
</script>

<template>
  <div class="fault-analysis-wrapper">
    <el-card class="analysis-card">
      <template #header>
        <div class="card-header">
          <span class="title">故障解析</span>
        </div>
      </template>

      <div class="analysis-info">
        <el-descriptions title="基本信息" :column="1" border>
          <el-descriptions-item label="服务器IP">{{ ip }}</el-descriptions-item>
          <el-descriptions-item label="采集时间">{{
            collectionTime
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="analysis-content">
        <el-empty description="暂无故障解析数据" />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.fault-analysis-wrapper {
  box-sizing: border-box;
  height: calc(100vh - 40px); // 减去上下margin
  margin: 20px;
}

.analysis-card {
  height: 100%;

  :deep(.el-card__body) {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: calc(100% - 60px); // 减去header高度
    padding: 20px;
  }
}

.analysis-info {
  margin-bottom: 20px;
}

.analysis-content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
