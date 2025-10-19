export type SourceRecord = {
  farcaster_id: string | null;
  source_type: string | null;
  recorded_at: string;
};

export type PieDatum = {
  source: string;
  count: number;
  percentage: number;
};

export type AreaDataPoint = {
  date: string;
  [key: string]: number | string;
};

export type ChartData = {
  pieData: PieDatum[];
  areaData: AreaDataPoint[];
  sources: string[];
};

export type UserRecord = {
  user_id: string;
  user_name: string;
  count: number;
};

export type AppResponse = {
  success: boolean;
  data?: {
    sources: SourceRecord[];
  } | null;
  message?: string;
  error?: string;
};

export type UsersResponse = {
  success: boolean;
  data: UserRecord[];
  message?: string;
  error?: string;
};

export type TopUser = UserRecord;
