<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import {
  LogCollectionData,
  submitLogCollection
} from "@/api/rcmFaultAssistantApi";

defineOptions({
  name: "LogCollection"
});

// 表单数据
const form = ref({
  ip: "",
  logType: [],
  remark: ""
});

// 日志类型
const logTypes = ref([
  { label: "RCM日志", value: "rcm_log" },
  { label: "Dockerd日志", value: "docker_log" },
  { label: "OSS日志", value: "oss_log" }
]);

// 表单校验规则
const rules = ref<FormRules>({
  ip: [
    { required: true, message: "请输入服务器IP", trigger: "blur" },
    {
      pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
      message: "请输入正确的IP地址格式",
      trigger: "blur"
    }
  ],
  logType: [{ required: true, message: "请选择日志类型", trigger: "change" }]
});

const formRef = ref<FormInstance>();
const loading = ref(false);

// 提交表单
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(async valid => {
    if (valid) {
      loading.value = true;

      const data: LogCollectionData = {
        ip: form.value.ip,
        logType: form.value.logType,
        remark: form.value.remark
      };
      try {
        console.log("开始采集日志:", form.value);
        const res = await submitLogCollection(data);
        if (res.code === 200) {
          ElMessage.success(
            "日志采集任务已提交, 请稍后在日志采集记录页面查看结果"
          );
        } else {
          ElMessage.error(res.message || "提交失败");
        }
      } catch (error) {
        ElMessage.error("系统错误，请稍后重试");
        console.error("日志采集失败:", error);
      } finally {
        loading.value = false;
      }
    }
  });
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  form.value.remark = "";
};
</script>

<template>
  <div class="log-collection">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">日志采集</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="collection-form"
      >
        <el-form-item label="服务器IP" prop="ip">
          <el-input
            v-model="form.ip"
            placeholder="请输入服务器IP，如: 192.168.1.100"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="日志类型" prop="logType">
          <el-checkbox-group v-model="form.logType">
            <el-checkbox
              v-for="type in logTypes"
              :key="type.value"
              :label="type.value"
            >
              {{ type.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSubmit(formRef)"
          >
            开始采集
          </el-button>
          <el-button @click="resetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.log-collection {
  padding: 20px;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .collection-form {
    max-width: 800px;
    margin-top: 20px;
  }

  :deep(.el-date-editor) {
    width: 100%;
  }
}
</style>
