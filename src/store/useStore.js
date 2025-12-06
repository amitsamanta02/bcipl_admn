import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Sidebar state
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({
        sidebarOpen: !state.sidebarOpen
      })),

    }),
    {
      name: 'admin-dashboard-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        user: state.user,
      }),
    }
  )
);

export default useStore;
