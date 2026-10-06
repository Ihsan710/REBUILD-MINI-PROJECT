import { Injectable, signal, computed } from '@angular/core';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  materialTitle?: string;
  orderedBy?: string;
  quantityKg?: number;
  timestamp: string;
  type: 'order' | 'dispatch' | 'system';
  read: boolean;
  link?: string;
}

const STORAGE_KEY = 'rebuild_platform_notifications';

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    title: 'Material Order Received',
    message: 'TMT Structural Steel Rebar Scrap (4,200 kg) has been taken! Order placed by Anita Desai.',
    materialTitle: 'TMT Structural Steel Rebar Scrap',
    orderedBy: 'Anita Desai',
    quantityKg: 4200,
    timestamp: '10 mins ago',
    type: 'order',
    read: false,
    link: '/seller'
  },
  {
    id: 'notif-02',
    title: 'Material Taken & Reserved',
    message: 'Red Clay Brick Lot (8,500 kg) has been ordered by Anita Desai. Awaiting dispatch confirmation.',
    materialTitle: 'Red Clay Brick Lot',
    orderedBy: 'Anita Desai',
    quantityKg: 8500,
    timestamp: '1 hour ago',
    type: 'order',
    read: false,
    link: '/seller'
  },
  {
    id: 'notif-03',
    title: 'Dispatch Confirmed',
    message: 'Crushed Concrete Aggregate (12,000 kg) has been picked up and delivered to Anita Desai.',
    materialTitle: 'Crushed Concrete Aggregate',
    orderedBy: 'Anita Desai',
    quantityKg: 12000,
    timestamp: 'Yesterday',
    type: 'dispatch',
    read: true,
    link: '/seller'
  }
];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<AppNotification[]>(this.loadInitialNotifications());
  readonly notifications = this.notificationsSignal.asReadonly();

  readonly unreadCount = computed(() => {
    return this.notificationsSignal().filter(n => !n.read).length;
  });

  private loadInitialNotifications(): AppNotification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to defaults
    }
    return DEFAULT_NOTIFICATIONS;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notificationsSignal()));
    } catch (e) {
      console.warn('Failed to persist notifications:', e);
    }
  }

  addNotification(data: {
    title: string;
    message: string;
    materialTitle?: string;
    orderedBy?: string;
    quantityKg?: number;
    type?: 'order' | 'dispatch' | 'system';
    link?: string;
  }) {
    const newNotif: AppNotification = {
      id: 'notif-' + Math.random().toString(36).substring(2, 9),
      title: data.title,
      message: data.message,
      materialTitle: data.materialTitle,
      orderedBy: data.orderedBy || 'Anita Desai',
      quantityKg: data.quantityKg,
      timestamp: 'Just now',
      type: data.type || 'order',
      read: false,
      link: data.link || '/seller'
    };

    this.notificationsSignal.update(list => [newNotif, ...list]);
    this.persist();
  }

  markAsRead(id: string) {
    this.notificationsSignal.update(list =>
      list.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    this.persist();
  }

  markAllAsRead() {
    this.notificationsSignal.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
    this.persist();
  }

  clearAll() {
    this.notificationsSignal.set([]);
    this.persist();
  }
}
