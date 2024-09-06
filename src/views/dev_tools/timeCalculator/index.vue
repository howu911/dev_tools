<template>
  <div class="time-calculator">
    <el-card class="calculator-card">
      <template #header>
        <h2 class="card-title">时间计算器</h2>
      </template>
      <div class="time-inputs">
        <div class="date-picker">
          <el-date-picker
            v-model="selectedDateTime"
            type="datetime"
            placeholder="选择日期和时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="full-width"
          />
        </div>

        <el-divider content-position="center">增加时间</el-divider>
        <div class="input-grid">
          <div class="time-input">
            <span class="unit-label">年</span>
            <el-input-number v-model="addYears" :min="0" />
          </div>
          <div class="time-input">
            <span class="unit-label">月</span>
            <el-input-number v-model="addMonths" :min="0" />
          </div>
          <div class="time-input">
            <span class="unit-label">日</span>
            <el-input-number v-model="addDays" :min="0" />
          </div>
          <div class="time-input">
            <span class="unit-label">时</span>
            <el-input-number v-model="addHours" :min="0" />
          </div>
          <div class="time-input">
            <span class="unit-label">分</span>
            <el-input-number v-model="addMinutes" :min="0" />
          </div>
          <div class="time-input">
            <span class="unit-label">秒</span>
            <el-input-number v-model="addSeconds" :min="0" />
          </div>
        </div>

        <el-divider content-position="center">减少时间</el-divider>
        <div class="input-grid">
          <div class="time-input">
            <span class="unit-label">年</span>
            <el-input-number v-model="subtractYears" :min="0" />
          </div>
          <div class="time-input">
            <span class="unit-label">月</span>
            <el-input-number v-model="subtractMonths" :min="0" />
          </div>
          <div class="time-input">
            <span class="unit-label">日</span>
            <el-input-number v-model="subtractDays" :min="0" />
          </div>
          <div class="time-input">
            <span class="unit-label">时</span>
            <el-input-number v-model="subtractHours" :min="0" />
          </div>
          <div class="time-input">
            <span class="unit-label">分</span>
            <el-input-number v-model="subtractMinutes" :min="0" />
          </div>
          <div class="time-input">
            <span class="unit-label">秒</span>
            <el-input-number v-model="subtractSeconds" :min="0" />
          </div>
        </div>
      </div>

      <div class="result">
        <h3>计算结果：</h3>
        <el-alert
          :title="calculatedDateTime"
          type="success"
          :closable="false"
          class="result-alert"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs from "dayjs";

const selectedDateTime = ref("");

const addYears = ref(0);
const addMonths = ref(0);
const addDays = ref(0);
const addHours = ref(0);
const addMinutes = ref(0);
const addSeconds = ref(0);

const subtractYears = ref(0);
const subtractMonths = ref(0);
const subtractDays = ref(0);
const subtractHours = ref(0);
const subtractMinutes = ref(0);
const subtractSeconds = ref(0);

const calculatedDateTime = computed(() => {
  if (!selectedDateTime.value) return "请选择日期和时间";

  let result = dayjs(selectedDateTime.value);

  result = result
    .add(addYears.value, "year")
    .add(addMonths.value, "month")
    .add(addDays.value, "day")
    .add(addHours.value, "hour")
    .add(addMinutes.value, "minute")
    .add(addSeconds.value, "second")
    .subtract(subtractYears.value, "year")
    .subtract(subtractMonths.value, "month")
    .subtract(subtractDays.value, "day")
    .subtract(subtractHours.value, "hour")
    .subtract(subtractMinutes.value, "minute")
    .subtract(subtractSeconds.value, "second");

  return result.format("YYYY年MM月DD日HH时mm分ss秒");
});
</script>

<style scoped>
.time-calculator {
  max-width: 600px;
  padding: 20px;
  margin: 0 auto;
}

.calculator-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
}

.card-title {
  margin: 0;
  font-size: 1.5rem;
  color: #409eff;
}

.time-inputs {
  margin-bottom: 20px;
}

.date-picker {
  margin-bottom: 20px;
}

.full-width {
  width: 100%;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.time-input {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.unit-label {
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #606266;
}

.result {
  margin-top: 20px;
}

.result-alert {
  margin-top: 10px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-divider__text) {
  font-size: 0.9rem;
  color: #909399;
}
</style>
