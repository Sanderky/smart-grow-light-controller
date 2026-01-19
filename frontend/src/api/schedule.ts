import { api } from "./axios";

export type ActionType = "ON" | "OFF";

export interface ScheduleEvent {
  id: number;
  days: number[]; // 0-6
  time: string; // HH:mm
  action: ActionType;
}

export interface NewScheduleEvent {
  days: number[];
  time: string; // HH:mm
  action: ActionType;
}

export interface SystemStatus {
  lightState: "ON" | "OFF";
  scheduleEnabled: boolean;
  serverTime: string;
  serverDate: string;
  nextEvent: {
    action: ActionType;
    minutesLeft: number;
    time: string;
    day: number;
  } | null;
}

export const scheduleApi = {
  getStatus: async (): Promise<SystemStatus> => {
    const { data } = await api.get<SystemStatus>("/status");
    return data;
  },

  getRules: async (): Promise<ScheduleEvent[]> => {
    const { data } = await api.get<ScheduleEvent[]>("/schedule");
    return data;
  },

  addRule: async (rule: NewScheduleEvent): Promise<ScheduleEvent> => {
    const { data } = await api.post<{ success: boolean; rule: ScheduleEvent }>(
      "/schedule",
      rule,
    );
    return data.rule;
  },

  updateRule: async (id: number, rule: NewScheduleEvent): Promise<void> => {
    await api.put(`/schedule/${id}`, rule);
  },

  deleteRule: async (id: number): Promise<void> => {
    await api.delete(`/schedule/${id}`);
  },

  toggleSchedule: async (enabled: boolean): Promise<{ enabled: boolean }> => {
    const { data } = await api.post("/settings/schedule", { enabled });
    return data;
  },

  setLightState: async (
    action: "on" | "off",
  ): Promise<{ newState: string }> => {
    const { data } = await api.post(`/light/${action}`);
    return data;
  },
};
