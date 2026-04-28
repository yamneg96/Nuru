import api from "./client";
import type { ServiceLocation } from "@shared/types";

export async function getServices(filters?: { tag?: string; type?: string; search?: string }): Promise<ServiceLocation[]> {
  const { data } = await api.get<ServiceLocation[]>("/services", { params: filters });
  return data;
}
