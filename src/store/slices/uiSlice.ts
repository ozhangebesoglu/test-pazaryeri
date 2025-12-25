import { StateCreator } from 'zustand';
import { Theme, Language, DEFAULT_LANGUAGE } from '@/lib/constants';

/**
 * Modal State
 */
export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: unknown;
}

/**
 * Toast Notification
 */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/**
 * UI Slice
 * Manages global UI state
 */
export interface UISlice {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Language
  language: Language;
  setLanguage: (language: Language) => void;

  // Mobile Menu
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Modal
  modal: ModalState;
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Loading States
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
}

let toastIdCounter = 0;

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set, get) => ({
  // Theme
  theme: 'system',
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  },

  // Language
  language: DEFAULT_LANGUAGE,
  setLanguage: (language) => {
    set({ language });
  },

  // Mobile Menu
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => {
    set({ isMobileMenuOpen: open });
  },
  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  // Search
  isSearchOpen: false,
  searchQuery: '',
  setSearchOpen: (open) => {
    set({ isSearchOpen: open });
    if (!open) {
      set({ searchQuery: '' });
    }
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  clearSearch: () => {
    set({ searchQuery: '', isSearchOpen: false });
  },

  // Modal
  modal: {
    isOpen: false,
    type: null,
    data: undefined,
  },
  openModal: (type, data) => {
    set({ modal: { isOpen: true, type, data } });
  },
  closeModal: () => {
    set({ modal: { isOpen: false, type: null, data: undefined } });
  },

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastIdCounter}`;
    const newToast: Toast = { ...toast, id };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  clearToasts: () => {
    set({ toasts: [] });
  },

  // Loading States
  isPageLoading: false,
  setPageLoading: (loading) => {
    set({ isPageLoading: loading });
  },
});
