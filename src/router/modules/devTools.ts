export default {
  path: "/devTools",
  meta: {
    title: "开发工具"
  },
  children: [
    {
      path: "/devTools/iterationCalendar",
      name: "IterationCalendar",
      component: () => import("@/views/dev_tools/iterationCalender/index.vue"),
      meta: {
        title: "迭代日历"
      }
    },
    {
      path: "/devTools/HpaKpi",
      name: "HpaKpi",
      component: () => import("@/views/dev_tools/hpaKpi/index.vue"),
      meta: {
        title: "HPA Kpi"
      }
    }
  ]
};
