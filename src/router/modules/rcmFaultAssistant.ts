export default {
  path: "/rcmFaultAssistant",
  meta: {
    title: "RCM故障助手"
  },
  children: [
    {
      path: "/rcmFaultAssistant/logCollection",
      name: "LogCollection",
      component: () =>
        import("@/views/rcmFaultAssistant/logCollection/index.vue"),
      meta: {
        title: "新建日志采集",
        showParent: true
      }
    },
    {
      path: "/rcmFaultAssistant/logCollectionRecord",
      name: "LogCollectionRecord",
      component: () =>
        import("@/views/rcmFaultAssistant/LogCollectionRecord/index.vue"),
      meta: {
        title: "日志采集记录",
        showParent: true
      }
    }
  ]
};
