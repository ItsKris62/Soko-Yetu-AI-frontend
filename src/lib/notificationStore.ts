import { create } from 'zustand'
import { api } from './api'

interface NotificationState {
  notificationCount: number
  setNotificationCount: (count: number) => void
  fetchNotifications: () => Promise<void>
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notificationCount: 0,
  setNotificationCount: (count) => set({ notificationCount: count }),
  fetchNotifications: async () => {
    try {
      const res = await api.get('/notifications/count')
      set({ notificationCount: res.data.count })
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  },
}))