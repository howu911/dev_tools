<script setup lang="ts">
import { ref, computed } from "vue";
import { Calendar as TinyCalendar } from "@opentiny/vue";

defineOptions({
  name: "IterationCalendar"
});

const currentDate = new Date(2024, 6, 5);
const startDate = new Date(2024, 6, 5);

const endDate = new Date();
endDate.setDate(endDate.getDate() + 365);

const baseIterationNumber = 187;
const baseDate = new Date(2024, 6, 5);

const getIterationLabel = (date: Date) => {
  let weeksDiff = Math.floor(
    (date.getTime() - baseDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  // console.log(date);
  const iteration = Math.floor(weeksDiff / 2) + baseIterationNumber;
  // console.log(weeksDiff);
  if (weeksDiff < 0) {
    weeksDiff = -weeksDiff;
  }
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
