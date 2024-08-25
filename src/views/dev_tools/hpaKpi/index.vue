<template>
  <div>
    <el-input
      v-model="searchQuery"
      placeholder="输入搜索服务名称"
      @keyup.enter="searchContainers"
    />

    <el-collapse v-model="activeName">
      <el-collapse-item
        v-for="(result, index) in searchResults"
        :key="result.title"
        :name="index.toString()"
      >
        <template #title>
          <div class="collapse-title">
            <span>{{ result.title }}</span>
            <el-button
              class="close-button"
              link
              @click.stop="closeCollapse(index)"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </template>
        <el-table :data="result.containers">
          <el-table-column prop="service_name" label="service" />
          <el-table-column prop="pod_name" label="pod" />
          <el-table-column label="KPI">
            <template #default="scope">
              <el-input-number v-model="scope.row.kpi" :min="0" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                :type="scope.row.isSending ? 'danger' : 'primary'"
                @click="toggleSendStatus(scope.row)"
              >
                {{ scope.row.isSending ? "停止" : "发送" }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  getServicePods,
  sendKpi,
  stopKpi,
  ServicePodResult
} from "@/api/hpaKpi";
import { ElMessage } from "element-plus";
import { Close } from "@element-plus/icons-vue";

const searchQuery = ref("");
const searchResults = ref<
  Array<{ title: string; containers: ServicePodResult[] }>
>([]);
const activeName = ref("");

const searchContainers = async () => {
  try {
    const response = await getServicePods({ service_name: searchQuery.value });
    if (response.data.length > 0) {
      const newResult = {
        title: `${searchQuery.value} (${response.data.length} pods)`,
        containers: response.data
      };

      const existingIndex = searchResults.value.findIndex(result =>
        result.title.startsWith(searchQuery.value)
      );

      if (existingIndex !== -1) {
        searchResults.value.splice(existingIndex, 1, newResult);
        activeName.value = existingIndex.toString();
      } else {
        searchResults.value.unshift(newResult);
        activeName.value = "0";
      }
    } else {
      ElMessage.warning(`${searchQuery.value} 无pod信息`);
    }
    searchQuery.value = "";
  } catch (error) {
    console.error("Error fetching containers:", error);
    ElMessage.error("获取容器列表失败");
  }
};

const toggleSendStatus = async (container: ServicePodResult) => {
  try {
    if (container.isSending) {
      await stopKpi({ name: container.pod_name });
      ElMessage.success("停止发送KPI成功");
    } else {
      await sendKpi({ name: container.pod_name, kpi: container.kpi });
      ElMessage.success("开始发送KPI成功");
    }
    container.isSending = !container.isSending;
    await searchContainers();
  } catch (error) {
    console.error("Error toggling KPI status:", error);
    ElMessage.error(
      container.isSending ? "停止发送KPI失败" : "开始发送KPI失败"
    );
  }
};

const closeCollapse = (index: number) => {
  searchResults.value.splice(index, 1);
  if (searchResults.value.length > 0) {
    activeName.value = "0";
  } else {
    activeName.value = "";
  }
};
</script>

<style scoped>
.collapse-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.close-button {
  margin-left: 10px;
}
</style>
