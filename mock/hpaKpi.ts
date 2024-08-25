import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/api/containers",
    method: "get",
    response: () => {
      return {
        success: true,
        data: containers
      };
    }
  },
  {
    url: "/api/stop-kpi",
    method: "post",
    response: () => {
      return {
        success: true,
        data: {}
      };
    }
  },
  {
    url: "/api/send-kpi",
    method: "post",
    response: () => {
      return {
        success: true,
        data: {}
      };
    }
  }
]);

// 模拟容器数据
const containers = [
  {
    service_name: "svc4",
    pod_name: "container3",
    kpi: 0,
    isSending: true
  },
  {
    service_name: "svc2",
    pod_name: "container4",
    kpi: 20,
    isSending: true
  },
  {
    service_name: "svc2",
    pod_name: "container5",
    kpi: 10,
    isSending: false
  }
];
