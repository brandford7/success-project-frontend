export enum VipDuration {
  ONE_MONTH = 30,
  THREE_MONTHS = 90,
  SIX_MONTHS = 180,
  ONE_YEAR = 365,
}

export interface VipPlan {
  id: string;
  name: string;
  duration: VipDuration;
  price: number;
  features: string[];
  popular?: boolean;
  savings?: string;
}

export interface GrantVipDto {
  duration: VipDuration;
  customDays?: number;
}

export interface VipStats {
  totalVips: number;
  activeVips: number;
  expiredVips: number;
}
