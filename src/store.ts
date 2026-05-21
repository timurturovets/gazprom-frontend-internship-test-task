import { create } from 'zustand';
import { ViewMode } from './types';

interface AppState {
  token: string;
  viewMode: ViewMode;
  setToken: (token: string) => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: '',
  viewMode: 'users',
  setToken: (token) => set({ token }),
  setViewMode: (viewMode) => set({ viewMode }),
}));
