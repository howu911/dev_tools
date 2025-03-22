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
    },
    {
      path: "/rcmFaultAssistant/logView/:ip/:collectionTime",
      name: "LogView",
      component: () => import("@/views/rcmFaultAssistant/logView/index.vue"),
      meta: {
        title: "日志查看",
        showParent: true,
        showLink: false
      }
    },
    {
      path: "/rcmFaultAssistant/faultAnalysis/:ip/:collectionTime",
      name: "FaultAnalysis",
      component: () =>
        import("@/views/rcmFaultAssistant/faultAnalysis/index.vue"),
      meta: {
        title: "故障解析",
        showParent: true,
        showLink: false
      }
    }
  ]
};
