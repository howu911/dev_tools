<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { Document, Stopwatch, Box, Cpu } from "@element-plus/icons-vue";
import { startFaultAnalysis } from "@/api/rcmFaultAssistantApi";

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

// 添加分析结果状态
const analysisResult = ref("");
const showResult = ref(false);

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

// 添加格式化函数
const formatAnalysisResult = (result: string) => {
  // 替换关键词为高亮
  return result
    .replace(
      /开始分析故障/g,
      '<span class="highlight-info">开始分析故障</span>'
    )
    .replace(/正在执行:/g, '<span class="highlight-process">正在执行:</span>')
    .replace(
      /----- 分析结果 -----/g,
      '<div class="result-separator"><span>分析结果</span></div>'
    )
    .replace(/(\d+\. .*容器.*)/g, '<span class="highlight-container">$1</span>')
    .replace(/(运行时间为.*)/g, '<span class="highlight-time">$1</span>')
    .replace(/(原始日志：.*)/g, '<div class="original-log">$1</div>')
    .replace(/\n/g, "<br>");
};

// 修改开始解析函数
const startAnalysis = async () => {
  // 表单验证 - 验证故障类型和容器名称必填
  if (!form.value.faultType) {
    ElMessage.warning("请选择故障类型");
    return;
  }

  if (!form.value.containerNames) {
    ElMessage.warning("请输入容器名称");
    return;
  }

  // 设置加载状态
  analyzing.value = true;
  analysisResult.value = "";
  showResult.value = true;

  try {
    // 准备请求数据
    const inputs = {
      RAG: "容器启动",
      event_start_time: form.value.startTime || "",
      event_end_time: form.value.endTime || "",
      container_name: form.value.containerNames,
      env_ip: ip.value,
      collect_time: collectionTime.value,
      collect_status: status.value
    };

    console.log("开始解析故障:", inputs);

    // 发送请求获取流式响应
    const response = await startFaultAnalysis(inputs);

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法获取响应流");
    }

    const decoder = new TextDecoder();
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // 解码接收到的数据
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      // 处理SSE数据，格式为: data: {...}
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data:") && line.length > 5) {
          try {
            const data = line.substring(5);

            // 检查是否包含完整的结果JSON
            if (data.includes('"text":') && data.includes('"finish_reason":')) {
              try {
                // 尝试解析最终结果
                const finalResult = JSON.parse(data);
                if (finalResult.text) {
                  // 添加一个分隔线，然后追加最终结果（不再替换之前的内容）
                  analysisResult.value +=
                    "\n\n----- 分析结果 -----\n\n" + finalResult.text;
                  await nextTick();
                  const resultContent =
                    document.querySelector(".result-content");
                  if (resultContent) {
                    resultContent.scrollTop = resultContent.scrollHeight;
                  }
                  continue;
                }
              } catch (parseError) {
                console.error("解析最终结果失败:", parseError);
              }
            }

            // 其他常规处理流程（显示中间步骤）
            const jsonData = JSON.parse(data);

            // 获取有用的内容
            let contentToDisplay = "";

            // 检查事件类型和内容
            if (jsonData.event === "node_finished") {
              // 处理节点完成事件
              if (
                jsonData.data &&
                jsonData.data.node_type === "llm" &&
                jsonData.data.outputs
              ) {
                // 处理LLM节点的输出
                if (jsonData.data.outputs.text) {
                  // 添加一个分隔线，然后追加最终结果（不再替换之前的内容）
                  analysisResult.value +=
                    "\n\n----- 分析结果 -----\n\n" + jsonData.data.outputs.text;
                  break;
                }
              } else if (
                jsonData.data &&
                jsonData.data.node_type === "knowledge-retrieval" &&
                jsonData.data.outputs &&
                jsonData.data.outputs.result
              ) {
                // 保留知识检索节点的处理
                const results = jsonData.data.outputs.result;
                if (Array.isArray(results)) {
                  results.forEach((item, index) => {
                    if (item.content) {
                      contentToDisplay += `${index + 1}. ${item.content}\n`;
                    }
                  });
                }
              }
            } else if (jsonData.event === "workflow_started") {
              contentToDisplay = "开始分析故障...\n";
            } else if (jsonData.event === "node_started") {
              contentToDisplay = `正在执行: ${jsonData.data.title || "处理中"}\n`;
            } else if (
              jsonData.event === "workflow_finished" &&
              jsonData.data &&
              jsonData.data.status === "succeeded"
            ) {
              // 工作流成功完成，但可能没有LLM节点的输出
              if (jsonData.data.outputs && jsonData.data.outputs.text) {
                // 添加分隔线并追加
                analysisResult.value +=
                  "\n\n----- 分析结果 -----\n\n" + jsonData.data.outputs.text;
              }
            }

            // 只有有内容时才添加
            if (contentToDisplay) {
              analysisResult.value += contentToDisplay;
              // 等待DOM更新以实现滚动到底部
              await nextTick();
              // 滚动结果区域到底部
              const resultContent = document.querySelector(".result-content");
              if (resultContent) {
                resultContent.scrollTop = resultContent.scrollHeight;
              }
            }
          } catch (e) {
            console.error("解析SSE数据失败", e);
          }
        }
      }
    }

    // 如果循环结束后仍未找到结果，尝试从完整响应中提取
    if (!analysisResult.value.includes("容器的运行时间点")) {
      try {
        // 尝试从完整响应中提取结果
        const resultMatch = fullResponse.match(/"text":\s*"([^"]+)"/);
        if (resultMatch && resultMatch[1]) {
          // 处理转义字符
          analysisResult.value = JSON.parse(`"${resultMatch[1]}"`);
        }
      } catch (e) {
        console.error("从完整响应提取结果失败:", e);
      }
    }
  } catch (error) {
    console.error("故障解析请求失败:", error);
    // 输出更详细的错误信息以便调试
    if (error instanceof Error) {
      console.error("错误详情:", error.message);
    } else {
      console.error("未知错误类型:", error);
    }
    ElMessage.error("故障解析请求失败，请稍后重试");
  } finally {
    analyzing.value = false;
  }
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

            <el-form-item label="容器名称" required>
              <el-input
                v-model="form.containerNames"
                placeholder="输入容器名称，如：apmac,nf-oam"
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
        <div v-if="!showResult" class="result-content empty-content">
          <el-empty description="暂无故障解析数据">
            <template #description>
              <p>请配置故障分析参数并点击"开始解析"</p>
            </template>
          </el-empty>
        </div>
        <div v-else-if="analyzing" class="result-content">
          <div
            class="analysis-text-content"
            v-html="formatAnalysisResult(analysisResult)"
          />
          <div class="analysis-loading">
            <el-progress type="circle" :percentage="0" :indeterminate="true" />
            <p>正在解析中，请稍候...</p>
          </div>
        </div>
        <div v-else class="result-content">
          <div
            class="analysis-text-content"
            v-html="formatAnalysisResult(analysisResult)"
          />
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

.analysis-text-content {
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;

  :deep(.highlight-info) {
    font-weight: bold;
    color: #409eff;
  }

  :deep(.highlight-process) {
    font-weight: bold;
    color: #e6a23c;
  }

  :deep(.highlight-container) {
    font-weight: bold;
    color: #67c23a;
  }

  :deep(.highlight-time) {
    color: #409eff;
  }

  :deep(.original-log) {
    padding: 8px;
    margin: 5px 0;
    overflow-x: auto;
    font-family: monospace;
    font-size: 13px;
    color: #606266;
    background-color: #f8f8f8;
    border-left: 3px solid #67c23a;
  }

  :deep(.result-separator) {
    position: relative;
    margin: 20px 0;
    text-align: center;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 1px;
      content: "";
      background-color: #dcdfe6;
    }

    span {
      position: relative;
      padding: 0 15px;
      font-size: 16px;
      font-weight: bold;
      color: #409eff;
      background-color: white;
    }
  }
}

.analysis-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  margin-top: 20px;

  p {
    margin-top: 16px;
    font-size: 14px;
    color: #909399;
  }
}
</style>
