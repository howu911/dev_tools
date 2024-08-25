import { http } from "@/utils/http";

export type ServicePodResult = {
  service_name: string;
  pod_name: string;
  kpi: number;
  isSending: boolean;
};

export type sendKpiResult = {
  success: boolean;
  data: {};
};

export type stopKpiResult = {
  success: boolean;
  data: {};
};

type ServicePodsResponse = {
  success: boolean;
  data: ServicePodResult[];
};

export const getServicePods = (data?: object) => {
  return http.request<ServicePodsResponse>("get", "/api/containers", { data });
};

export const sendKpi = (data: { name: string; kpi: number }) => {
  return http.request<sendKpiResult>("post", "/api/send-kpi", { data });
};

export const stopKpi = (data: { name: string }) => {
  return http.request<stopKpiResult>("post", "/api/stop-kpi", { data });
};
