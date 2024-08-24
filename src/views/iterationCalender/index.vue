<script setup lang="ts">
import { ref, computed } from "vue";
import { Calendar as TinyCalendar } from "@opentiny/vue";

defineOptions({
  name: "IterationCalendar"
});

const currentDate = new Date();
const startDate = new Date(currentDate);
startDate.setFullYear(currentDate.getFullYear() - 1);
startDate.setDate(startDate.getDate() - startDate.getDay() + 5); // Adjust to the nearest Friday

const endDate = new Date(currentDate);
endDate.setFullYear(currentDate.getFullYear() + 1);

const baseIterationNumber = 198;
const baseDate = new Date(2024, 7, 2); // August 2, 2024 (Friday)

const getIterationLabel = (date: Date) => {
  const weeksDiff = Math.floor(
    (date.getTime() - baseDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  const iteration = Math.floor(weeksDiff / 2) + baseIterationNumber;
  const subIteration = (weeksDiff % 2) + 1;
  return `B${iteration}-${subIteration}`;
};

const eventslist = computed(() => {
  const events = [];
  let date = new Date(startDate);

  while (date <= endDate) {
    const iterationLabel = getIterationLabel(date);
    events.push({
      time: date.getTime(),
      title: iterationLabel,
      content: iterationLabel,
      type: "info"
    });

    date.setDate(date.getDate() + 1);
  }

  return events;
});
</script>

<template>
  <tiny-calendar
    :events="eventslist"
    :year="currentDate.getFullYear()"
    :month="currentDate.getMonth() + 1"
  />
</template>
