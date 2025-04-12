import { http } from "@/utils/http";
import { rcmBaseUrlApi } from "./utils";

export type LogCollectionData = {
  ip: string;
  logType: string[];
  remark?: string;
};

export interface LogRecord {
  id: number;
  ip: string;
  collectionTime: string;
  status: "success" | "failed" | "processing";
  logType: string[];
  remark?: string;
}

export type LogCollectionResponse = {
  code: number;
  message: string;
};

export type DeleteLogCollectionResponse = {
  code: number;
  message: string;
};

export type LogCollectionRecord = {
  code: number;
  message: string;
  data: {
    records: LogRecord[];
    total: number;
  };
};

export const submitLogCollection = (data?: object) => {
  console.log(data);
  return http.request<LogCollectionResponse>(
    "post",
    rcmBaseUrlApi("rcmlog/collect"),
    {
      data,
      timeout: 50000
    }
  );
};

interface PageParams {
  currentPage: number;
  pageSize: number;
}

export function getLogCollectionRecords(params: PageParams) {
  return http.request<LogCollectionRecord>(
    "get",
    rcmBaseUrlApi("rcmlog/collectRecord"),
    {
      params
    }
  );
}

export interface DeleteLogParams {
  ip: string;
  collectionTime: string;
}

export const deleteLogCollectionRecord = (params: DeleteLogParams) => {
  return http.request<DeleteLogCollectionResponse>(
    "delete",
    rcmBaseUrlApi("rcmlog/collectRecord"),
    {
      params
    }
  );
};

// 故障解析API请求
export const startFaultAnalysis = async (data: object) => {
  const { VITE_CONTAINER_RUNNING_API_KEY } = import.meta.env;

  const requestBody = JSON.stringify({
    inputs: data,
    response_mode: "streaming",
    user: "rcm-fault-assistant"
  });

  console.log("API请求详情:", {
    url: "http://10.90.30.63:10180/v1/workflows/run",
    headers: {
      Authorization: `Bearer ${VITE_CONTAINER_RUNNING_API_KEY.substring(0, 5)}...`, // 只显示前5个字符
      "Content-Type": "application/json"
    },
    body: requestBody
  });

  try {
    const response = await fetch("http://10.90.30.63:10180/v1/workflows/run", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VITE_CONTAINER_RUNNING_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: requestBody
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API响应错误:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(
        `API请求失败: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response;
  } catch (error) {
    console.error("API请求异常:", error);
    throw error;
  }
};
