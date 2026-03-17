import { defineStore } from "pinia";
import type {
  Tip,
  CreateTipDto,
  UpdateTipDto,
  QueryTipsDto,
  PaginatedTipsResponse,
  TipStatistics,
} from "~/types/tip";

export const useTipsStore = defineStore("tips", {
  state: () => ({
    tips: [] as Tip[],
    currentTip: null as Tip | null,
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
    statistics: null as TipStatistics | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    pendingTips: (state) =>
      state.tips.filter((tip) => tip.status === "pending"),
    settledTips: (state) =>
      state.tips.filter((tip) => ["won", "lost", "void"].includes(tip.status)),
    vipTips: (state) => state.tips.filter((tip) => tip.isVip),
    freeTips: (state) => state.tips.filter((tip) => !tip.isVip),
    allTips: (state) => state.tips,
  },

  actions: {
    async fetchTips(query: QueryTipsDto = {}) {
      this.loading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();

        console.log("Fetching tips with query:", query); // Debug log

        const { data } = await $api.get<PaginatedTipsResponse>("/tips", {
          params: query,
        });

        console.log("Tips response:", data); // Debug log

        this.tips = data.data;
        this.pagination = data.meta;

        return data;
      } catch (error: any) {
        console.error("Error fetching tips:", error); // Debug log
        this.error = error.response?.data?.message || "Failed to fetch tips";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchAll(page = 1) {
      return await this.fetchTips({
        page,
        isVip: undefined,
      });
    },

    async fetchVipTips(query: QueryTipsDto = {}) {
      this.loading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();
        const { data } = await $api.get<PaginatedTipsResponse>("/tips/vip", {
          params: query,
        });

        this.tips = data.data;
        this.pagination = data.meta;

        return data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Failed to fetch VIP tips";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTipById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();
        const { data } = await $api.get<Tip>(`/tips/${id}`);

        this.currentTip = data;

        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to fetch tip";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTip(createTipDto: CreateTipDto) {
      this.loading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();
        const { data } = await $api.post<Tip>("/tips", createTipDto);

        // Add to the beginning of the list
        this.tips.unshift(data);

        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to create tip";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTip(id: string, updateTipDto: UpdateTipDto) {
      this.loading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();
        const { data } = await $api.patch<Tip>(`/tips/${id}`, updateTipDto);

        // Update in the list
        const index = this.tips.findIndex((tip) => tip.id === id);
        if (index !== -1) {
          this.tips[index] = data;
        }

        // Update current tip if it's the same
        if (this.currentTip?.id === id) {
          this.currentTip = data;
        }

        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to update tip";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTipStatus(
      id: string,
      status: string,
      resultNotes?: string,
    ): Promise<Tip> {
      this.loading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();
        const { data } = await $api.patch(`/tips/${id}/status`, {
          status,
          resultNotes,
        });

        // Update the tip in the list if it exists
        const index = this.tips.findIndex((tip) => tip.id === id);
        if (index !== -1) {
          this.tips[index] = data;
        }

        // Update current tip if it's the same
        if (this.currentTip?.id === id) {
          this.currentTip = data;
        }

        return data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Failed to update tip status";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTip(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();
        await $api.delete(`/tips/${id}`);

        // Remove from list
        this.tips = this.tips.filter((tip) => tip.id !== id);

        // Clear current tip if it's the same
        if (this.currentTip?.id === id) {
          this.currentTip = null;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to delete tip";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStatistics() {
      this.loading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();
        const { data } = await $api.get<TipStatistics>("/tips/statistics");

        this.statistics = data;

        return data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Failed to fetch statistics";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
