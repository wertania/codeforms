import { defineStore } from 'pinia';

export interface GlobalState {
  isLoggedIn: boolean;
}

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    isLoggedIn: true,
  }),
});