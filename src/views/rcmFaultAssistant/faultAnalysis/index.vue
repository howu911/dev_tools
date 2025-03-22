<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { Document, Stopwatch, Box, Cpu } from "@element-plus/icons-vue";

defineOptions({
  name: "FaultAnalysis"
});

const route = useRoute();
const ip = ref(route.params.ip as string);
const collectionTime = ref("");
const status = ref("");
const logType = ref("");

// 故障类型选项
const faultTypeOptions = [
  { value: "containerStart", label: "容器启动" },
  { value: "containerReset", label: "容器复位" }
];

// 表单数据
const form = ref({
  faultType: "",
  startTime: "",
  endTime: "",
  containerNames: ""
});

// 加载状态
const analyzing = ref(false);

// 获取状态显示文本和样式
const getStatusInfo = (status: string) => {
  const statusMap = {
    success: { text: "采集成功", class: "success" },
    failed: { text: "采集失败", class: "danger" },
    processing: { text: "采集中", class: "warning" },
    notStart: { text: "未开始", class: "info" }
  };
  return statusMap[status] || { text: status, class: "" };
};

// 开始解析函数
const startAnalysis = () => {
  // 表单验证 - 只验证故障类型必填
  if (!form.value.faultType) {
    ElMessage.warning("请选择故障类型");
    return;
  }

  // 设置加载状态
  analyzing.value = true;

  // 模拟解析过程
  setTimeout(() => {
    analyzing.value = false;
    ElMessage.success("故障解析完成");
    // 这里可以添加解析结果的展示逻辑
  }, 2000);

  console.log("开始解析故障:", {
    ip: ip.value,
    collectionTime: collectionTime.value,
    status: status.value,
    logType: logType.value,
    faultType: form.value.faultType,
    startTime: form.value.startTime,
    endTime: form.value.endTime,
    containerNames: form.value.containerNames
  });
};

onMounted(() => {
  // 获取路由参数
  collectionTime.value = route.params.collectionTime as string;
  status.value = (route.query.status as string) || "";
  logType.value = (route.query.logType as string) || "";
});
</script>

<template>
  <div class="fault-analysis-wrapper">
    <el-card class="analysis-card">
      <template #header>
        <div class="card-header">
          <span class="title">故障解析</span>
          <el-tag type="info" effect="plain" class="server-tag">{{
            ip
          }}</el-tag>
        </div>
      </template>

      <div class="page-layout">
        <!-- 左侧信息区 -->
        <div class="info-panel">
          <div class="panel-header">
            <i class="el-icon info-icon"><Document /></i>
            <span>基本信息</span>
          </div>

          <div class="info-content">
            <div class="info-item">
              <span class="info-label">服务器IP</span>
              <span class="info-value highlight">{{ ip }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">采集时间</span>
              <span class="info-value">{{ collectionTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">采集状态</span>
              <span :class="['status-tag', getStatusInfo(status).class]">
                {{ getStatusInfo(status).text }}
              </span>
            </div>
            <div v-if="logType" class="info-item">
              <span class="info-label">日志类型</span>
              <span class="info-value">
                <el-tag
                  v-for="(type, index) in logType.split(',')"
                  :key="index"
                  class="log-type-tag"
                  type="info"
                  effect="light"
                >
                  {{ type }}
                </el-tag>
              </span>
            </div>
          </div>
        </div>

        <!-- 右侧分析表单 -->
        <div class="analysis-panel">
          <div class="panel-header">
            <i class="el-icon info-icon"><Cpu /></i>
            <span>故障解析配置</span>
          </div>

          <el-form :model="form" label-width="120px" class="analysis-form">
            <el-form-item label="故障类型" required>
              <el-select
                v-model="form.faultType"
                placeholder="请选择故障类型"
                class="form-select"
              >
                <el-option
                  v-for="item in faultTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="故障开始时间">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="选择故障开始时间（可选）"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                class="form-date-picker"
                :prefix-icon="Stopwatch"
              />
            </el-form-item>

            <el-form-item label="故障结束时间">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="选择故障结束时间（可选）"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                class="form-date-picker"
                :prefix-icon="Stopwatch"
              />
            </el-form-item>

            <el-form-item label="容器名称">
              <el-input
                v-model="form.containerNames"
                placeholder="输入容器名称，如：apmac;nf-oam（可选）"
                class="form-input"
                :prefix-icon="Box"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :loading="analyzing"
                class="analysis-button"
                @click="startAnalysis"
              >
                {{ analyzing ? "正在解析中..." : "开始解析" }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 分析结果区域 -->
      <div class="result-panel">
        <div v-if="!analyzing" class="result-content empty-content">
          <el-empty description="暂无故障解析数据">
            <template #description>
              <p>请配置故障分析参数并点击"开始解析"</p>
            </template>
          </el-empty>
        </div>
        <div v-else class="result-content">
          <el-skeleton style="width: 100%" :rows="10" animated />
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.fault-analysis-wrapper {
  box-sizing: border-box;
  height: calc(100vh - 40px);
  margin: 20px;
}

.analysis-card {
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);

  :deep(.el-card__body) {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: calc(100% - 60px);
    padding: 0;
    overflow-y: auto;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
  }

  .server-tag {
    font-size: 13px;
  }
}

.page-layout {
  display: flex;
  gap: 20px;
  width: 100%;
  padding: 16px;

  @media (width <= 1200px) {
    flex-direction: column;
  }
}

.info-panel {
  width: 30%;
  overflow: hidden;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 5%);

  @media (width <= 1200px) {
    width: 100%;
  }
}

.analysis-panel {
  flex: 1;
  overflow: hidden;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 5%);
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  background-color: #f0f2f5;
  border-bottom: 1px solid #e4e7ed;

  .info-icon {
    margin-right: 10px;
    font-size: 18px;
    color: #409eff;
  }
}

.info-content {
  padding: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  margin-bottom: 6px;
  font-size: 14px;
  color: #606266;
}

.info-value {
  font-size: 14px;
  color: #303133;

  &.highlight {
    font-weight: bold;
    color: #409eff;
  }
}

.status-tag {
  display: inline-block;
  align-self: flex-start;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 4px;

  &.success {
    color: white;
    background-color: #67c23a;
  }

  &.danger {
    color: white;
    background-color: #f56c6c;
  }

  &.warning {
    color: white;
    background-color: #e6a23c;
  }

  &.info {
    color: white;
    background-color: #909399;
  }
}

.log-type-tag {
  margin-right: 6px;
  margin-bottom: 6px;
}

.analysis-form {
  padding: 20px;
}

.form-select,
.form-date-picker,
.form-input {
  width: 100%;
}

.analysis-button {
  width: 100%;
  padding: 12px 0;
  margin-top: 10px;
  font-size: 16px;
}

.result-panel {
  flex: 1;
  padding: 0 16px 16px;
  overflow: auto;
}

.result-content {
  height: 100%;
  min-height: 200px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;

  &.empty-content {
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(.el-empty__description) {
      margin-top: 16px;

      p {
        font-size: 14px;
        color: #909399;
      }
    }
  }
}

.empty-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
</style>
