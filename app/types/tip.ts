export enum TipStatus {
  PENDING = "pending",
  WON = "won",
  LOST = "lost",
  VOID = "void",
}

export interface Tip {
  id: string;
  match: string;
  league: string;
  pick: string;
  category: string;
  odds: number;
  country: string;
  reasoning: string | null;
  kickoffTime: string;
  status: TipStatus;
  resultNotes: string | null;
  isVip: boolean;
  createdBy: {
    id: string;
    email: string | null;
    phoneNumber: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTipDto {
  match: string;
  league: string;
  pick: string;
  category: string;
  odds: number;
  reasoning?: string;
  kickoffTime: string;
  isVip?: boolean;
}

export interface UpdateTipDto {
  match?: string;
  resultNotes?: string;
  league?: string;
  pick?: string;
  category?: string;
  country?: string;
  isVip?: boolean;
  odds?: number;
  reasoning?: string;
  status?: TipStatus;
  kickoffTime?: string;
}

export interface QueryTipsDto {
  status?: TipStatus;
  page?: number;
  limit?: number;
  isVip?: boolean;
  league?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedTipsResponse {
  data: Tip[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TipStatistics {
  total: number;
  won: number;
  lost: number;
  pending: number;
  voided: number;
  settled: number;
  winRate: number;
}
