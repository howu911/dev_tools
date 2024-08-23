export default {
  path: "/devTools",
  meta: {
    title: "开发工具"
  },
  children: [
    {
      path: "/devTools/iterationCalendar",
      name: "IterationCalendar",
      component: () => import("@/views/iterationCalender/index.vue"),
      meta: {
        title: "迭代日历",
        showParent: true
      }
    }
  ]
};
