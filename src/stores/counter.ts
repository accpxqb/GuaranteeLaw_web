import type { PageRequest } from "@/types/page-request";
import type { Sourcing } from "@/types/sourcing";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => {
    return {
      managerBcList: <any>[],
      customerBcList: <any>[],
    };
  },
  persist: {
    storage: sessionStorage,
  },
});

export const usePageStore = defineStore("page", {
  state: () => {
    return {
      Page: <PageRequest>{
        PastPage: 0,
        CurrentPage: 1,
        PageSize: 10,
      },
    };
  },
  persist: {
    storage: sessionStorage,
  },
});

export const useSourcingFormStore = defineStore("form", {
  state: () => {
    return {
      sourcingForm: <Sourcing>{},
      requirements: <any>[],
      hotelLevels: <any>[],
      requirementsArr: <any>[],
    };
  },
  persist: {
    storage: sessionStorage,
  },
});

/**
 * 用户搜索
 */
export const useSearchStore = defineStore("search", {
  state: () => {
    return {
      name: "",
    };
  },
});

/**持久化用户搜索历史 */
export const useSearchHistoryStore = defineStore("searchHistory", {
  state: () => {
    return {
      history: <object[]>[],
    };
  },
  persist: {
    storage: localStorage,
  },
});

/**用户信息 */
export const useUserDataStore = defineStore("userDataInfo", {
  state: () => {
    return {
      logged: false,
      userName: "",
      mobile: "",
      userExtends: <object[]>[],
      smsExpirationTime: 0,
    };
  },
  persist: {
    storage: localStorage,
  },
});

