import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/rcmlog/collect",
    method: "post",
    response: () => {
      return {
        code: 200
      };
    }
  },
  {
    url: "/rcmlog/collectRecord",
    method: "get",
    response: () => {
      return {
        code: 200,
        data: {
          records: [
            {
              ip: "192.168.1.1",
              collectionTime: "2024-01-01 10:00:00",
              status: "success",
              logType: ["docker_log", "oss_log"],
              remark: "采集成功"
            },
            {
              ip: "192.168.1.2",
              collectionTime: "2024-01-01 10:30:00",
              status: "failed",
              logType: ["rcm_log"],
              remark: "采集失败"
            },
            {
              ip: "192.168.1.3",
              collectionTime: "2024-01-01 11:00:00",
              status: "processing",
              logType: ["docker_log", "oss_log"],
              remark: "采集中"
            },
            {
              ip: "192.168.1.4",
              collectionTime: "2024-01-01 11:30:00",
              status: "success",
              logType: ["rcm_log", "docker_log"],
              remark: "采集成功"
            },
            {
              ip: "192.168.1.5",
              collectionTime: "2024-01-01 12:00:00",
              status: "failed",
              logType: ["oss_log"],
              remark: "网络连接超时"
            },
            {
              ip: "192.168.1.6",
              collectionTime: "2024-01-01 12:30:00",
              status: "success",
              logType: ["rcm_log", "oss_log"],
              remark: "采集成功"
            },
            {
              ip: "192.168.1.7",
              collectionTime: "2024-01-01 13:00:00",
              status: "processing",
              logType: ["docker_log"],
              remark: "采集中"
            },
            {
              ip: "192.168.1.8",
              collectionTime: "2024-01-01 13:30:00",
              status: "success",
              logType: ["rcm_log", "docker_log", "oss_log"],
              remark: "采集成功"
            },
            {
              ip: "192.168.1.9",
              collectionTime: "2024-01-01 14:00:00",
              status: "failed",
              logType: ["rcm_log"],
              remark: "服务器无响应"
            },
            {
              ip: "192.168.1.10",
              collectionTime: "2024-01-01 14:30:00",
              status: "success",
              logType: ["docker_log", "oss_log"],
              remark: "采集成功"
            },
            {
              ip: "192.168.1.11",
              collectionTime: "2024-01-01 15:00:00",
              status: "processing",
              logType: ["rcm_log", "oss_log"],
              remark: "采集中"
            },
            {
              ip: "192.168.1.12",
              collectionTime: "2024-01-01 15:30:00",
              status: "success",
              logType: ["docker_log"],
              remark: "采集成功"
            },
            {
              ip: "192.168.1.13",
              collectionTime: "2024-01-01 16:00:00",
              status: "failed",
              logType: ["rcm_log", "docker_log"],
              remark: "权限不足"
            },
            {
              ip: "192.168.1.14",
              collectionTime: "2024-01-01 16:30:00",
              status: "success",
              logType: ["oss_log"],
              remark: "采集成功"
            },
            {
              ip: "192.168.1.15",
              collectionTime: "2024-01-01 17:00:00",
              status: "processing",
              logType: ["rcm_log", "docker_log"],
              remark: "采集中"
            },
            {
              ip: "192.168.1.16",
              collectionTime: "2024-01-01 17:30:00",
              status: "success",
              logType: ["docker_log", "oss_log"],
              remark: "采集成功"
            },
            {
              ip: "192.168.1.17",
              collectionTime: "2024-01-01 18:00:00",
              status: "failed",
              logType: ["rcm_log"],
              remark: "磁盘空间不足"
            },
            {
              ip: "192.168.1.18",
              collectionTime: "2024-01-01 18:30:00",
              status: "success",
              logType: ["docker_log", "oss_log"],
              remark: "采集成功"
            },
            {
              ip: "192.168.1.19",
              collectionTime: "2024-01-01 19:00:00",
              status: "processing",
              logType: ["rcm_log", "oss_log"],
              remark: "采集中"
            },
            {
              ip: "192.168.1.20",
              collectionTime: "2024-01-01 19:30:00",
              status: "success",
              logType: ["docker_log"],
              remark: "采集成功"
            }
          ],
          total: 20
        },
        message: "ok"
      };
    }
  }
]);
