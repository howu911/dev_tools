import { http } from "@/utils/http";

export type LogCollectionData = {
  ip: string;
  logType: string[];
  remark?: string;
};

export interface LogRecord {
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
  return http.request<LogCollectionResponse>("post", "/rcmlog/collect", {
    data
  });
};

interface PageParams {
  currentPage: number;
  pageSize: number;
}

export function getLogCollectionRecords(params: PageParams) {
  return http.request<LogCollectionRecord>("get", "/rcmlog/collectRecord", {
    params
  });
}
